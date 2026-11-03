import { dev } from '$app/env';
import { fail, redirect } from '@sveltejs/kit';
import {
	getSettings,
	DEFAULT_ADMIN_PASSWORD,
	isLoginBlocked,
	recordLoginFailure,
	clearLoginAttempts,
	LOGIN_WINDOW_MINUTES
} from '#lib/repo';
import { verifyPassword, signSession } from '#lib/db';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.isAdmin) {
		const returnTo = url.searchParams.get('returnTo') || '/admin';
		throw redirect(303, returnTo);
	}
	return {};
};

/** IP клиента (на Cloudflare приходит в cf-connecting-ip). */
function clientIp(request: Request): string {
	return request.headers.get('cf-connecting-ip') || 'local';
}

export const actions: Actions = {
	default: async (event) => {
		const ip = clientIp(event.request);

		// Защита от перебора пароля.
		if (await isLoginBlocked(event, ip)) {
			return fail(429, {
				error: `Слишком много попыток. Попробуйте снова через ${LOGIN_WINDOW_MINUTES} минут.`
			});
		}

		const data = await event.request.formData();
		const password = String(data.get('password') ?? '').trim();

		if (!password) {
			return fail(400, { error: 'Пожалуйста, введите пароль' });
		}

		const settings = await getSettings(event);
		const hash = settings.adminPasswordHash;

		let isValid = false;
		if (hash) {
			isValid = await verifyPassword(password, hash);
		} else {
			isValid = password === DEFAULT_ADMIN_PASSWORD;
		}

		if (!isValid) {
			await recordLoginFailure(event, ip);
			return fail(400, { error: 'Неверный пароль. Попробуйте ещё раз.' });
		}

		await clearLoginAttempts(event, ip);

		// Эпоха в токене: смена пароля инвалидирует все старые сессии.
		const secret = (event.platform?.env as any)?.SESSION_SECRET || settings.sessionSecret;
		const sessionToken = await signSession(secret, `admin:${Date.now()}:${settings.sessionEpoch}`);

		event.cookies.set('svadba_session', sessionToken, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: !dev,
			maxAge: 60 * 60 * 24 * 30 // 30 дней
		});

		// returnTo разрешаем только внутренние пути — открытый редирект небезопасен.
		const returnToRaw = event.url.searchParams.get('returnTo') || '/admin';
		const returnTo = returnToRaw.startsWith('/admin') ? returnToRaw : '/admin';
		throw redirect(303, returnTo);
	}
};
