import { fail } from '@sveltejs/kit';
import {
	listGuests,
	getGuestByToken,
	createGuest,
	saveRsvp,
	loadContentOverride,
	isActionBlocked,
	registerActionHit,
	RSVP_HITS_PER_WINDOW,
	RSVP_WINDOW_MINUTES
} from '#lib/repo';
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

type MatchCandidate = {
	id: number;
	token: string;
	name: string;
	rsvp: { plus_one_name: string | null; children_names: string | null; transfer_needed: number } | null;
};

/**
 * Ищем гостя по имени. Возвращаем либо ровно одного кандидата,
 * либо признак неоднозначности (несколько похожих — просим уточнить).
 * Наружу никогда не отдаём список имён.
 */
function findGuest(
	guests: MatchCandidate[],
	normInput: string,
	inputWords: string[]
): { guest: MatchCandidate | null; ambiguous: boolean } {
	// 1. Точное совпадение
	const exact = guests.filter((g) => normalize(g.name) === normInput);
	if (exact.length === 1) return { guest: exact[0], ambiguous: false };
	if (exact.length > 1) return { guest: null, ambiguous: true };

	// 2. Вхождение целым словом (не подстрокой внутри слова: «Татьяна» ≠ «Яна»).
	//    Работает в обе стороны: «Сафина» найдёт «Рамиля Сафина».
	const wordIncludes = guests.filter((g) => {
		const gNorm = normalize(g.name);
		if (gNorm.length < 3) return false;
		const re = new RegExp(`(^| )${normInput.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}( |$)`);
		const reInput = new RegExp(`(^| )${gNorm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}( |$)`);
		return re.test(gNorm) || reInput.test(normInput);
	});
	if (wordIncludes.length === 1) return { guest: wordIncludes[0], ambiguous: false };
	if (wordIncludes.length > 1) return { guest: null, ambiguous: true };

	// 3. Совпадение по значимым словам («Рамиля Габдуллина» vs «Габдуллина Рамиля»):
	// каждое слово короткой стороны должно найтись в длинной.
	if (inputWords.length > 0) {
		const candidates = guests.filter((g) => {
			const gWords = extractCoreWords(g.name);
			// Имя без значимых слов (одна буква, инициалы) не матчится по словам —
			// иначе пустое сравнение матчится с любым вводом (0 >= 0).
			if (gWords.length === 0) return false;
			const shorter = inputWords.length <= gWords.length ? inputWords : gWords;
			const longer = inputWords.length <= gWords.length ? gWords : inputWords;
			return shorter.every((w) => longer.some((lw) => lw.includes(w) || w.includes(lw)));
		});
		if (candidates.length === 1) return { guest: candidates[0], ambiguous: false };
		if (candidates.length > 1) return { guest: null, ambiguous: true };
	}

	return { guest: null, ambiguous: false };
}

export const actions: Actions = {
	default: async (event) => {
		// Защита от ботов: не более RSVP_HITS_PER_WINDOW запросов с одного IP за окно.
		const ip = event.request.headers.get('cf-connecting-ip') || 'local';
		const hitKey = `rsvp:${ip}`;
		if (await isActionBlocked(event, hitKey, RSVP_HITS_PER_WINDOW)) {
			return fail(429, {
				saveError: `Слишком много отправок. Попробуйте через ${RSVP_WINDOW_MINUTES} минут.`
			});
		}
		await registerActionHit(event, hitKey);

		const data = await event.request.formData();

		// Honeypot: скрытое поле, которое заполняют только боты.
		// Отвечаем «успехом», ничего не сохраняя и не уведомляя.
		if (String(data.get('website') ?? '') !== '') {
			return { success: true, guestName: '', attending: 'no', token: null };
		}

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

		let guests: MatchCandidate[] = [];
		let listFailed = false;
		try {
			guests = await listGuests(event);
		} catch (e) {
			// Не можем прочитать список — матчить нельзя, иначе продублируем гостя.
			console.error('Failed to list guests during RSVP:', e);
			listFailed = true;
		}

		let matchedGuest: MatchCandidate | null = null;
		if (!listFailed) {
			const { guest, ambiguous } = findGuest(guests, normInput, inputWords);
			if (ambiguous) {
				return fail(400, { ambiguous: true });
			}
			matchedGuest = guest;
		}

		let token: string | null = null;
		let finalGuestName = name;

		try {
			if (matchedGuest) {
				finalGuestName = matchedGuest.name;

				// Повторный ответ через общую форму не должен затирать поля,
				// которых в ней нет (+1, дети, трансфер) — берём их из прежнего ответа.
				const existing = matchedGuest.rsvp ?? null;
				const mergedPlusOne = plusOneName || existing?.plus_one_name || undefined;
				const mergedChildren = childrenNames || existing?.children_names || undefined;
				const mergedTransfer = existing ? Boolean(existing.transfer_needed) : false;

				await saveRsvp(event, matchedGuest.id, {
					attending: attendance,
					plusOneName: mergedPlusOne || undefined,
					childrenNames: mergedChildren || undefined,
					drinks,
					foodNotes: foodNotes || undefined,
					transferNeeded: mergedTransfer,
					songRequest: songRequest || undefined,
					comment: comment || undefined
				});
			} else if (listFailed) {
				// Запись без матча при недоступном списке — риск дубля; честная ошибка лучше молчаливой потери.
				return fail(500, { saveError: true });
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

			// Мгновенное уведомление в Telegram молодожёнам.
			// Падение уведомления не должно превращать сохранённый ответ в 500.
			try {
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
				console.error('RSVP notify failed (answer is saved):', e);
			}
		} catch (e) {
			console.error('Error saving fast RSVP:', e);
			return fail(500, { saveError: true });
		}

		// Токен наружу из открытой формы не отдаём: имя — ключ, но ссылка на
		// чужую персональную страницу по имени — лишняя информация.
		return {
			success: true,
			guestName: finalGuestName,
			attending: attendance,
			token: null
		};
	}
};
