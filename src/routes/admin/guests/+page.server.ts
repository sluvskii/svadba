import { fail } from '@sveltejs/kit';
import { listGuests, listTables, createGuest, updateGuest, deleteGuest, assignSeat } from '#lib/repo';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const [guests, tables] = await Promise.all([
		listGuests(event),
		listTables(event)
	]);

	return {
		guests,
		tables
	};
};

export const actions: Actions = {
	create: async (event) => {
		const data = await event.request.formData();
		const mode = String(data.get('mode') ?? 'single');

		if (mode === 'batch') {
			const batchText = String(data.get('batchText') ?? '');
			const side = String(data.get('side') ?? 'both');
			const plusOne = data.get('plusOne') === 'on' || data.get('plusOne') === 'true';
			const children = data.get('children') === 'on' || data.get('children') === 'true';

			const names = batchText
				.split(/\r?\n/)
				.map((n) => n.trim())
				.filter((n) => n.length > 0);

			if (names.length === 0) {
				return fail(400, { error: 'Список имён пуст' });
			}

			for (const name of names) {
				await createGuest(event, {
					name,
					side,
					plusOneAllowed: plusOne,
					childrenAllowed: children
				});
			}

			return { success: true, count: names.length };
		} else {
			const name = String(data.get('name') ?? '').trim();
			if (!name) {
				return fail(400, { error: 'Укажите имя гостя' });
			}
			const side = String(data.get('side') ?? 'both');
			const plusOneAllowed = data.get('plusOne') === 'on' || data.get('plusOne') === 'true';
			const childrenAllowed = data.get('children') === 'on' || data.get('children') === 'true';
			const note = String(data.get('note') ?? '').trim();

			await createGuest(event, {
				name,
				side,
				plusOneAllowed,
				childrenAllowed,
				note: note || undefined
			});

			return { success: true };
		}
	},

	update: async (event) => {
		const data = await event.request.formData();
		const id = Number(data.get('id'));
		const name = String(data.get('name') ?? '').trim();

		if (!id || !name) {
			return fail(400, { error: 'Неверные данные' });
		}

		const side = String(data.get('side') ?? 'both');
		const plusOneAllowed = data.get('plusOne') === 'on' || data.get('plusOne') === 'true';
		const childrenAllowed = data.get('children') === 'on' || data.get('children') === 'true';
		const note = String(data.get('note') ?? '').trim();

		await updateGuest(event, id, {
			name,
			side,
			plusOneAllowed,
			childrenAllowed,
			note: note || undefined
		});

		return { success: true };
	},

	delete: async (event) => {
		const data = await event.request.formData();
		const id = Number(data.get('id'));
		if (!id) return fail(400, { error: 'Неверный ID' });

		await deleteGuest(event, id);
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
