import { listTablesWithGuests, getSettings, loadContentOverride } from '#lib/repo';
import { content, type Table } from '#lib/content';
import { t } from '#lib/i18n.svelte';
import type { PageServerLoad } from './$types';

const DEFAULT_COORDS = [
	{ x: 18, y: 22 },
	{ x: 82, y: 22 },
	{ x: 10, y: 52 },
	{ x: 90, y: 52 },
	{ x: 22, y: 82 },
	{ x: 50, y: 90 },
	{ x: 78, y: 82 }
];

export const load: PageServerLoad = async (event) => {
	const [settings, tablesFromDb, contentOverride] = await Promise.all([
		getSettings(event),
		listTablesWithGuests(event),
		loadContentOverride(event)
	]);

	const seatingVisible = settings.seatingVisible;

	let tables: Table[] = content.seating.tables;
	if (tablesFromDb && tablesFromDb.length > 0) {
		tables = tablesFromDb.map((tDb, idx) => {
			const coords = DEFAULT_COORDS[idx % DEFAULT_COORDS.length];
			// Стандартные названия «Стол N» показываем по-татарски, авторские — как есть.
			const numeric = tDb.name.match(/^Стол\s+(\d+)$/i);
			const nameTt = numeric ? `Өстәл ${numeric[1]}` : tDb.name;
			return {
				id: tDb.id,
				name: t(tDb.name, nameTt),
				x: coords.x,
				y: coords.y,
				capacity: tDb.capacity,
				guests: tDb.guests.map((g) => g.name)
			};
		});
	}

	return {
		seatingVisible,
		tables,
		contentOverride
	};
};
