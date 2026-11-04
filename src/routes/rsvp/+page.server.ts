import { fail } from '@sveltejs/kit';
import { listGuests, getGuestByToken, createGuest, saveRsvp, loadContentOverride } from '#lib/repo';
import { parseDrinkOptions } from '#lib/rsvp-form';
import { notifyTelegramRsvp } from '#lib/notify';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const contentOverride = await loadContentOverride(event);
	const drinkOptions = parseDrinkOptions(contentOverride?.drinks);
	return { contentOverride, drinkOptions };
};

/**
 * Нормализация строки: нижний регистр, замена ё -> е, удаление пунктуации и лишних пробелов.
 */
function normalize(s: string): string {
	return s
		.trim()
		.toLowerCase()
		.replace(/ё/g, 'е')
		.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
		.replace(/\s+/g, ' ');
}

/**
 * Очистка от вежливых обращений для сопоставления (бабушка, апа, тетя и т.д.)
 */
function extractCoreWords(s: string): string[] {
	const stopWords = new Set([
		'бабушка',
		'бабуля',
		'дедушка',
		'деда',
		'әби',
		'әбием',
		'нәнәй',
		'нәнәем',
		'бабай',
		'дәү әни',
		'дәү әти',
		'апа',
		'апай',
		'абый',
		'абыстай',
		'тетя',
		'тётя',
		'дядя',
		'сестра',
		'брат'
	]);
	return normalize(s)
		.split(' ')
		.filter((w) => w.length > 1 && !stopWords.has(w));
}

export const actions: Actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const name = String(data.get('name') ?? '').trim().slice(0, 120);
		const attendance = data.get('attendance');

		if (!name) {
			return fail(400, { missingName: true });
		}

		if (attendance !== 'yes' && attendance !== 'no') {
			return fail(400, { missingAttendance: true, name });
		}

		const override = await loadContentOverride(event);
		const activeDrinks = parseDrinkOptions(override?.drinks);
		const validDrinkIds = new Set(activeDrinks.map((d) => d.id));
		const drinks = data
			.getAll('drinks')
			.map(String)
			.filter((d) => validDrinkIds.has(d))
			.slice(0, 20);

		const plusOneName = String(data.get('plusOneName') ?? '').trim().slice(0, 120);
		const childrenNames = String(data.get('children') ?? '').trim().slice(0, 300);
		const foodNotes = String(data.get('food') ?? '').trim().slice(0, 300);
		const songRequest = String(data.get('song') ?? '').trim().slice(0, 200);
		const comment = String(data.get('comment') ?? '').trim().slice(0, 1000);

		const normInput = normalize(name);
		const inputWords = extractCoreWords(name);

		let matchedGuest: { id: number; token: string; name: string } | null = null;

		try {
			const guests = await listGuests(event);

			// 1. Точное совпадение
			matchedGuest = guests.find((g) => normalize(g.name) === normInput) ?? null;

			// 2. Частичное совпадение (если одно имя содержится в другом)
			if (!matchedGuest) {
				matchedGuest =
					guests.find((g) => {
						const gNorm = normalize(g.name);
						return gNorm.length >= 3 && (normInput.includes(gNorm) || gNorm.includes(normInput));
					}) ?? null;
			}

			// 3. Совпадение по значимым словам (например «Рамиля Габдуллина» vs «Габдуллина Рамиля»)
			if (!matchedGuest && inputWords.length > 0) {
				matchedGuest =
					guests.find((g) => {
						const gWords = extractCoreWords(g.name);
						const matches = inputWords.filter((w) => gWords.some((gw) => gw.includes(w) || w.includes(gw)));
						return matches.length >= Math.min(inputWords.length, gWords.length, 2);
					}) ?? null;
			}
		} catch (e) {
			console.error('Failed to list guests during RSVP:', e);
		}

		let token: string | null = null;
		let finalGuestName = name;

		try {
			if (matchedGuest) {
				finalGuestName = matchedGuest.name;
				token = matchedGuest.token;
				await saveRsvp(event, matchedGuest.id, {
					attending: attendance,
					plusOneName: plusOneName || undefined,
					childrenNames: childrenNames || undefined,
					drinks,
					foodNotes: foodNotes || undefined,
					transferNeeded: false,
					songRequest: songRequest || undefined,
					comment: comment || undefined
				});
			} else {
				// Если гостя нет в БД — сохраняем, чтобы ни один ответ не потерялся!
				token = await createGuest(event, {
					name,
					side: 'both',
					plusOneAllowed: Boolean(plusOneName),
					childrenAllowed: Boolean(childrenNames),
					note: 'Быстрый ответ на сайте'
				});
				const created = await getGuestByToken(event, token);
				if (created) {
					await saveRsvp(event, created.id, {
						attending: attendance,
						plusOneName: plusOneName || undefined,
						childrenNames: childrenNames || undefined,
						drinks,
						foodNotes: foodNotes || undefined,
						transferNeeded: false,
						songRequest: songRequest || undefined,
						comment: comment || undefined
					});
				}
			}

			// Мгновенное уведомление в Telegram молодожёнам
			await notifyTelegramRsvp(event, {
				guestName: finalGuestName,
				attending: attendance,
				plusOneName: plusOneName || null,
				childrenNames: childrenNames || null,
				drinks,
				foodNotes: foodNotes || null,
				transferNeeded: false,
				songRequest: songRequest || null,
				comment: comment || (matchedGuest ? '' : 'Записан через общую форму')
			});
		} catch (e) {
			console.error('Error saving fast RSVP:', e);
		}

		return {
			success: true,
			guestName: finalGuestName,
			attending: attendance,
			token
		};
	}
};
