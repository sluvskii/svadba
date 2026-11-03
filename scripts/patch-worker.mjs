// Патч собранного воркера: adapter-cloudflare 8.0.2 не передаёт platform
// в server.respond под SvelteKit 3 — биндинги D1/KV не доходят до event.platform.
// Добавляем platform (env из cloudflare:workers + контекст запроса) вручную.
import fs from 'node:fs';

const file = '.svelte-kit/cloudflare/_worker.js';
let src = fs.readFileSync(file, 'utf8');

if (src.includes('platform: { env, ctx, caches, cf: req.cf }')) {
	console.log('worker already patched');
	process.exit(0);
}

const fetchNeedle = 'async fetch(req, env) {';
if (!src.includes(fetchNeedle)) {
	console.error('fetch signature not found — adapter version changed?');
	process.exit(1);
}
src = src.replace(fetchNeedle, 'async fetch(req, env, ctx) {');

const respondNeedle = `		return await server.respond(req, {
			getClientAddress() {
				return /** @type {string} */ (req.headers.get('cf-connecting-ip'));
			}
		});`;
if (!src.includes(respondNeedle)) {
	console.error('respond block not found — adapter version changed?');
	process.exit(1);
}
src = src.replace(
	respondNeedle,
	`		return await server.respond(req, {
			getClientAddress() {
				return /** @type {string} */ (req.headers.get('cf-connecting-ip'));
			},
			platform: { env, ctx, caches, cf: req.cf }
		});`
);

fs.writeFileSync(file, src);
console.log('worker patched: platform wired into server.respond');
