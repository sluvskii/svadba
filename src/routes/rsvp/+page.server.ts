import { fail, redirect } from '@sveltejs/kit';
import { listGuests } from '#lib/repo';
import type { Actions } from './$types';

/**
 * Имя как ключ доступа: приводим к единому виду (регистр, ё/е, пробелы)
 * и ищем ТОЧНОЕ совпадение. Списки имён наружу не показываем никогда.
 */
function normalize(s: string): string {
	return s
		.trim()
		.toLowerCase()
		.replace(/ё/g, 'е')
		.replace(/\s+/g, ' ');
}

export const actions: Actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const name = String(data.get('name') ?? '').trim();

		if (!name) {
			return fail(400, { notFound: true });
		}

		const guests = await listGuests(event);
		const matches = guests.filter((g) => normalize(g.name) === normalize(name));

		if (matches.length === 1) {
			throw redirect(303, `/invite/${matches[0].token}`);
		}

		if (matches.length > 1) {
			return fail(400, { ambiguous: true });
		}

		return fail(404, { notFound: true });
	}
};
