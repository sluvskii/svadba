import adapter from '@sveltejs/adapter-cloudflare';
import { sveltekit } from '@sveltejs/kit/vite';
import { getPlatformProxy } from 'wrangler';
import { defineConfig } from 'vite';

const cf_adapter = adapter();

/**
 * SvelteKit 3 в dev берёт `event.platform` из adapter.emulate(),
 * а adapter-cloudflare v8 этот хук пока не реализует — биндинги D1/KV
 * в dev-сервере не работают. Добавляем emulate сами: wrangler
 * поднимает локальный runtime с биндингами из wrangler.jsonc.
 */
const the_adapter = {
	...cf_adapter,
	emulate: async () => {
		const proxy = await getPlatformProxy();
		return {
			// PlatformProxy структурно совместим с App.Platform (env/ctx/caches)
			platform: async () => proxy as unknown as App.Platform
		};
	}
};

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: the_adapter
		})
	]
});
