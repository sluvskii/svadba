import { fail } from '@sveltejs/kit';
import {
	listTablesWithGuests,
	listGuests,
	getSettings,
	saveSettings,
	upsertTable,
	deleteTable,
	assignSeat
} from '#lib/repo';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const [tables, allGuests, settings] = await Promise.all([
		listTablesWithGuests(event),
		listGuests(event),
		getSettings(event)
	]);

	const unassignedGuests = allGuests.filter((g) => g.table_id === null);

	return {
		tables,
		unassignedGuests,
		totalGuests: allGuests.length,
		seatedCount: allGuests.length - unassignedGuests.length,
		seatingVisible: settings.seatingVisible
	};
};

export const actions: Actions = {
	toggleVisibility: async (event) => {
		const settings = await getSettings(event);
		settings.seatingVisible = !settings.seatingVisible;
		await saveSettings(event, settings);
		return { success: true, seatingVisible: settings.seatingVisible };
	},

	addTable: async (event) => {
		const data = await event.request.formData();
		const name = String(data.get('name') ?? '').trim();
		const capacity = Number(data.get('capacity') ?? 8);

		if (!name) return fail(400, { error: 'Укажите название стола' });

		const tables = await listTablesWithGuests(event);
		const sortOrder = tables.length + 1;

		await upsertTable(event, {
			name,
			capacity: capacity > 0 ? capacity : 8,
			sort_order: sortOrder
		});

		return { success: true };
	},

	updateTable: async (event) => {
		const data = await event.request.formData();
		const id = Number(data.get('id'));
		const name = String(data.get('name') ?? '').trim();
		const capacity = Number(data.get('capacity') ?? 8);

		if (!id || !name) return fail(400, { error: 'Неверные данные' });

		// Сохраняем существующий порядок сортировки, а не сбрасываем его.
		const tables = await listTablesWithGuests(event);
		const current = tables.find((t) => t.id === id);

		await upsertTable(event, {
			id,
			name,
			capacity: capacity > 0 ? capacity : 8,
			sort_order: current?.sort_order ?? tables.length + 1
		});

		return { success: true };
	},

	deleteTable: async (event) => {
		const data = await event.request.formData();
		const id = Number(data.get('id'));
		if (!id) return fail(400, { error: 'Неверный ID стола' });

		await deleteTable(event, id);
		return { success: true };
	},

	assignSeat: async (event) => {
		const data = await event.request.formData();
		const guestId = Number(data.get('guestId'));
		const tableIdRaw = data.get('tableId');
		const tableId = tableIdRaw && tableIdRaw !== '' ? Number(tableIdRaw) : null;

		if (!guestId) return fail(400, { error: 'Неверный guestId' });

		await assignSeat(event, guestId, tableId);
		return { success: true };
	}
};
