/** Уведомления в Telegram для молодожёнов */

import { getSettings } from './repo';

type EventLike = { platform?: App.Platform };

export interface RsvpNotificationData {
	guestName: string;
	attending: 'yes' | 'no';
	plusOneName?: string | null;
	childrenNames?: string | null;
	drinks: string[];
	foodNotes?: string | null;
	transferNeeded: boolean;
	songRequest?: string | null;
	comment?: string | null;
}

const DRINK_NAMES: Record<string, string> = {
	'red-wine': '🍷 Красное вино',
	'white-wine': '🥂 Белое вино',
	champagne: '🍾 Шампанское',
	vodka: '🍸 Водка',
	cognac: '🥃 Коньяк',
	whiskey: '🥃 Виски',
	soft: '🧃 Безалкогольные напитки',
	none: '🚫 Не пьет алкоголь'
};

export async function notifyTelegramRsvp(
	event: EventLike,
	data: RsvpNotificationData
): Promise<void> {
	const settings = await getSettings(event);
	const token = event.platform?.env?.TELEGRAM_BOT_TOKEN || settings.telegramBotToken;
	const chatId = event.platform?.env?.TELEGRAM_CHAT_ID || settings.telegramChatId;

	if (!token || !chatId) return;

	const statusEmoji = data.attending === 'yes' ? '✅ Будет на свадьбе!' : '❌ К сожалению, не сможет';
	const drinkList = data.drinks.length > 0
		? data.drinks.map((d) => DRINK_NAMES[d] || d).join(', ')
		: 'Не указано';

	let msg = `💌 *Новый ответ на приглашение!*\n\n`;
	msg += `👤 *Гость:* ${data.guestName}\n`;
	msg += `📌 *Статус:* ${statusEmoji}\n`;

	if (data.attending === 'yes') {
		if (data.plusOneName) {
			msg += `👥 *Спутник (+1):* ${data.plusOneName}\n`;
		}
		if (data.childrenNames) {
			msg += `👶 *Дети:* ${data.childrenNames}\n`;
		}
		msg += `🥂 *Напитки:* ${drinkList}\n`;
		if (data.foodNotes) {
			msg += `🍽️ *Пожелания по еде:* ${data.foodNotes}\n`;
		}
		if (data.transferNeeded) {
			msg += `🚗 *Трансфер:* Да, нужен\n`;
		}
		if (data.songRequest) {
			msg += `🎵 *Песня:* ${data.songRequest}\n`;
		}
	}

	if (data.comment) {
		msg += `💬 *Пожелание:* ${data.comment}\n`;
	}

	await sendToAllChats(token, chatId, msg);
}

export async function sendTelegramTest(token: string, chatId: string): Promise<{ ok: boolean; error?: string }> {
	return sendToAllChats(
		token,
		chatId,
		`🔔 *Тестовое уведомление свадебного сайта!*\n\nБот успешно подключён к сайту Алины и Камиля. Сюда будут приходить ответы гостей.`
	);
}

/** Chat ID может содержать несколько получателей через запятую (невеста, жених, группа). */
function parseChatIds(chatId: string): string[] {
	return chatId
		.split(/[,\s;]+/)
		.map((s) => s.trim())
		.filter(Boolean);
}

/** Отправка всем получателям. Ошибка одного не блокирует остальных. */
async function sendToAllChats(
	token: string,
	chatIdField: string,
	text: string
): Promise<{ ok: boolean; error?: string }> {
	const ids = parseChatIds(chatIdField);
	if (ids.length === 0) {
		return { ok: false, error: 'Не указан ни один Chat ID' };
	}

	let lastError: string | undefined;
	for (const id of ids) {
		const res = await sendTelegramMessage(token, id, text);
		if (!res.ok) lastError = res.error;
	}

	return lastError ? { ok: false, error: lastError } : { ok: true };
}

async function sendTelegramMessage(
	token: string,
	chatId: string,
	text: string
): Promise<{ ok: boolean; error?: string }> {
	try {
		const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				chat_id: chatId,
				text,
				parse_mode: 'Markdown',
				disable_web_page_preview: true
			})
		});
		const result = (await res.json()) as any;
		if (!result.ok) {
			return { ok: false, error: result.description || 'Ошибка Telegram API' };
		}
		return { ok: true };
	} catch (err: any) {
		return { ok: false, error: err?.message || 'Сетевая ошибка при отправке в Telegram' };
	}
}
