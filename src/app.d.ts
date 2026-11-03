// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Env } from '../worker-configuration';

declare global {
	namespace App {
		interface Platform {
			env: Env;
			ctx: ExecutionContext;
			caches: RequestCaches;
		}
		interface Locals {
			/** true, когда запрос авторизован как молодожёны (admin) */
			isAdmin: boolean;
		}
	}
}

export {};
