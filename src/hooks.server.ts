import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit/hooks';
import { verifySession } from '#lib/db';
import { getSettings } from '#lib/repo';

/** Время жизни сессии администратора (30 дней, совпадает с maxAge cookie). */
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** Разбор payload сессии: `admin:<issuedAt>:<epoch>`. */
function parseAdminPayload(payload: string): { issuedAt: number; epoch: number } | null {
	const parts = payload.split(':');
	if (parts.length !== 3 || parts[0] !== 'admin') return null;
	const issuedAt = Number(parts[1]);
	const epoch = Number(parts[2]);
	if (!Number.isFinite(issuedAt) || !Number.isFinite(epoch)) return null;
	return { issuedAt, epoch };
}

export const handle: Handle = async ({ event, resolve }) => {
	const settings = await getSettings(event);
	const sessionSecret = (event.platform?.env as any)?.SESSION_SECRET || settings.sessionSecret;

	const sessionCookie = event.cookies.get('svadba_session');

	let isAdmin = false;
	if (sessionCookie) {
		const payload = await verifySession(sessionSecret, sessionCookie);
		if (payload) {
			const parsed = parseAdminPayload(payload);
			// Сессия действительна, пока не истёк срок и не сменилась эпоха (пароль).
			if (
				parsed &&
				Date.now() - parsed.issuedAt < SESSION_TTL_MS &&
				parsed.epoch === settings.sessionEpoch
			) {
				isAdmin = true;
			}
		}
	}

	event.locals.isAdmin = isAdmin;

	const pathname = event.url.pathname;
	if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login') && !pathname.startsWith('/admin/logout')) {
		if (!isAdmin) {
			throw redirect(303, `/admin/login?returnTo=${encodeURIComponent(pathname)}`);
		}
	}

	const response = await resolve(event);

	// Базовые защитные заголовки для всех ответов.
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

	return response;
};
