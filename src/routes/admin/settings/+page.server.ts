import { fail } from '@sveltejs/kit';
import { getSettings, saveSettings } from '#lib/repo';
import { hashPassword, verifyPassword } from '#lib/db';
import { sendTelegramTest } from '#lib/notify';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const settings = await getSettings(event);

	return {
		telegramBotToken: settings.telegramBotToken || '',
		telegramChatId: settings.telegramChatId || '',
		seatingVisible: settings.seatingVisible
	};
};

export const actions: Actions = {
	saveTelegram: async (event) => {
		const data = await event.request.formData();
		const token = String(data.get('telegramBotToken') ?? '').trim();
		const chatId = String(data.get('telegramChatId') ?? '').trim();

		const settings = await getSettings(event);
		settings.telegramBotToken = token;
		settings.telegramChatId = chatId;
		await saveSettings(event, settings);

		return { successTelegram: true };
	},

	testTelegram: async (event) => {
		const data = await event.request.formData();
		const token = String(data.get('telegramBotToken') ?? '').trim();
		const chatId = String(data.get('telegramChatId') ?? '').trim();

		if (!token || !chatId) {
			return fail(400, { telegramError: 'Заполните токен бота и Chat ID перед проверкой' });
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

		return { passwordSuccess: true };
	}
};
