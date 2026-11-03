import { error, fail } from '@sveltejs/kit';
import { getGuestByToken, saveRsvp } from '#lib/repo';
import { notifyTelegramRsvp } from '#lib/notify';
import { drinkOptions } from '#lib/rsvp-form';
import { t } from '#lib/i18n.svelte';
import type { Actions, PageServerLoad } from './$types';

/** Минимальная пауза между отправками ответа одним гостем, мс (защита от спама). */
const RSVP_RESEND_COOLDOWN_MS = 30_000;

export const load: PageServerLoad = async (event) => {
	const row = await getGuestByToken(event, event.params.token);
	if (!row) {
		throw error(404, 'invite-not-found');
	}

	let parsedDrinks: string[] = [];
	if (row.rsvp?.drinks) {
		try {
			parsedDrinks = JSON.parse(row.rsvp.drinks);
		} catch {
			parsedDrinks = [];
		}
	}

	const guest = {
		id: row.id,
		token: row.token,
		name: row.name,
		nameTt: row.name,
		side: row.side,
		note: row.note
			? t(row.note, row.note)
			: t(
					'Будем счастливы видеть вас рядом в этот тёплый зимний день.',
					'Бу кышкы көндә сезне яныбызда күрергә бик шат булырбыз.'
				),
		table: row.table_name || (row.table_id ? `Стол ${row.table_id}` : null),
		plusOneAllowed: Boolean(row.plus_one_allowed),
		plusOneName: row.rsvp?.plus_one_name ?? null,
		childrenAllowed: Boolean(row.children_allowed),
		response: row.rsvp
			? {
					attendance: row.rsvp.attending,
					plusOneName: row.rsvp.plus_one_name || '',
					children: row.rsvp.children_names || '',
					drinks: parsedDrinks,
					food: row.rsvp.food_notes || '',
					transfer: Boolean(row.rsvp.transfer_needed),
					song: row.rsvp.song_request || '',
					comment: row.rsvp.comment || '',
					submittedAt: row.rsvp.updated_at
				}
			: null
	};

	return { guest };
};

export const actions: Actions = {
	default: async (event) => {
		const row = await getGuestByToken(event, event.params.token);
		if (!row) {
			return fail(404, { message: 'unknown-guest' });
		}

		const data = await event.request.formData();
		const attendance = data.get('attendance');
		if (attendance !== 'yes' && attendance !== 'no') {
			return fail(400, { message: 'attendance-required' });
		}

		// Повторная отправка раньше кулдауна — не пишем в БД и не дёргаем Telegram.
		if (row.rsvp?.updated_at) {
			const lastAt = Date.parse(`${row.rsvp.updated_at.replace(' ', 'T')}Z`);
			if (Number.isFinite(lastAt) && Date.now() - lastAt < RSVP_RESEND_COOLDOWN_MS) {
				return fail(429, { message: 'too-fast' });
			}
		}

		// Напитки принимаем только из справочника формы.
		const validDrinkIds = new Set(drinkOptions.map((d) => d.id));
		const drinks = data
			.getAll('drinks')
			.map(String)
			.filter((d) => validDrinkIds.has(d))
			.slice(0, 16);

		// +1 и детей фиксируем только если гостю это разрешено.
		const plusOneName = row.plus_one_allowed
			? String(data.get('plusOneName') ?? '').trim().slice(0, 120)
			: '';
		const childrenNames = row.children_allowed
			? String(data.get('children') ?? '').trim().slice(0, 300)
			: '';
		const foodNotes = String(data.get('food') ?? '').trim().slice(0, 300);
		const transferNeeded = data.get('transfer') === 'on' || data.get('transfer') === 'true';
		const songRequest = String(data.get('song') ?? '').trim().slice(0, 200);
		const comment = String(data.get('comment') ?? '').trim().slice(0, 1000);

		await saveRsvp(event, row.id, {
			attending: attendance,
			plusOneName: plusOneName || undefined,
			childrenNames: childrenNames || undefined,
			drinks,
			foodNotes: foodNotes || undefined,
			transferNeeded,
			songRequest: songRequest || undefined,
			comment: comment || undefined
		});

		// Отправка уведомления молодожёнам в Telegram
		await notifyTelegramRsvp(event, {
			guestName: row.name,
			attending: attendance,
			plusOneName: plusOneName || null,
			childrenNames: childrenNames || null,
			drinks,
			foodNotes: foodNotes || null,
			transferNeeded,
			songRequest: songRequest || null,
			comment: comment || null
		});

		return { success: true };
	}
};
