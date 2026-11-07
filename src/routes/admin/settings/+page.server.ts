import { fail } from '@sveltejs/kit';
import { dev } from '$app/env';
import { getSettings, saveSettings } from '#lib/repo';
import { hashPassword, verifyPassword, signSession } from '#lib/db';
import { sendTelegramTest } from '#lib/notify';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const settings = await getSettings(event);

	// Токен бота — секрет: наружу отдаём только факт подключения и Chat ID.
	return {
		tgConnected: Boolean(settings.telegramBotToken && settings.telegramChatId),
		telegramChatId: settings.telegramChatId || '',
		seatingVisible: settings.seatingVisible
	};
};

export const actions: Actions = {
	saveTelegram: async (event) => {
		const data = await event.request.formData();
		// Пустое поле токена = «оставить прежний».
		const token = String(data.get('telegramBotToken') ?? '').trim();
		const chatId = String(data.get('telegramChatId') ?? '').trim();

		const settings = await getSettings(event);
		if (token) settings.telegramBotToken = token;
		if (chatId) settings.telegramChatId = chatId;
		await saveSettings(event, settings);

		return { successTelegram: true };
	},

	testTelegram: async (event) => {
		// Тестируем сохранённые на сервере значения — токен не ходит через форму.
		const settings = await getSettings(event);
		const token = settings.telegramBotToken;
		const chatId = settings.telegramChatId;

		if (!token || !chatId) {
			return fail(400, { telegramError: 'Сначала сохраните токен бота и Chat ID' });
		}

		const res = await sendTelegramTest(token, chatId);
		if (!res.ok) {
			return fail(400, { telegramError: res.error || 'Ошибка отправки в Telegram' });
		}

		return { telegramTestOk: true };
	},

	changePassword: async (event) => {
		const data = await event.request.formData();
		const oldPassword = String(data.get('oldPassword') ?? '').trim();
		const newPassword = String(data.get('newPassword') ?? '').trim();
		const confirmPassword = String(data.get('confirmPassword') ?? '').trim();

		if (!newPassword || newPassword.length < 4) {
			return fail(400, { passwordError: 'Новый пароль должен содержать не менее 4 символов' });
		}

		if (newPassword !== confirmPassword) {
			return fail(400, { passwordError: 'Пароли не совпадают' });
		}

		const settings = await getSettings(event);

		// Проверка старого пароля
		const isValid = await verifyPassword(oldPassword, settings.adminPasswordHash);
		if (!isValid) {
			return fail(400, { passwordError: 'Неверный текущий пароль' });
		}

		settings.adminPasswordHash = await hashPassword(newPassword);
		// Новая эпоха — все выданные ранее сессии становятся недействительными.
		settings.sessionEpoch = (settings.sessionEpoch || 0) + 1;
		await saveSettings(event, settings);

		// Сразу выдаём новую сессию с новой эпохой — чтобы не выкидывало на логин.
		const secret = (event.platform?.env as any)?.SESSION_SECRET || settings.sessionSecret;
		const sessionToken = await signSession(secret, `admin:${Date.now()}:${settings.sessionEpoch}`);
		event.cookies.set('svadba_session', sessionToken, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: !dev,
			maxAge: 60 * 60 * 24 * 30
		});

		return { passwordSuccess: true };
	}
};
