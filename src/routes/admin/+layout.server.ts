import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// Страница входа доступна без сессии, иначе /admin/login зациклится на редиректе сам в себя.
	if (!locals.isAdmin && !url.pathname.startsWith('/admin/login')) {
		throw redirect(303, `/admin/login?returnTo=${encodeURIComponent(url.pathname)}`);
	}
	return {
		isAdmin: locals.isAdmin,
		pathname: url.pathname
	};
};
