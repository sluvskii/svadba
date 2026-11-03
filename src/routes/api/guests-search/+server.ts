import { json } from '@sveltejs/kit';
import { listGuests } from '#lib/repo';
import type { RequestHandler } from './$types';

/**
 * Поиск гостей по имени для общей страницы /rsvp.
 * Отдаём только имя и токен — этих данных достаточно, чтобы открыть приглашение.
 */
export const GET: RequestHandler = async (event) => {
	const q = (event.url.searchParams.get('q') ?? '').trim().toLowerCase();
	if (q.length < 2) {
		return json({ results: [] });
	}

	const guests = await listGuests(event);
	const results = guests
		.filter((g) => g.name.toLowerCase().includes(q))
		.slice(0, 8)
		.map((g) => ({ token: g.token, name: g.name }));

	return json({ results });
};
