import { listGuests } from '#lib/repo';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const guests = await listGuests(event);

	let confirmedCount = 0;
	let declinedCount = 0;
	let pendingCount = 0;
	let plusOnesConfirmed = 0;
	let transferCount = 0;

	const drinksTally: Record<string, number> = {
		'red-wine': 0,
		'white-wine': 0,
		champagne: 0,
		vodka: 0,
		cognac: 0,
		whiskey: 0,
		soft: 0,
		none: 0
	};

	const foodNotes: { guestName: string; note: string }[] = [];
	const songRequests: { guestName: string; song: string }[] = [];
	const childrenNotes: { guestName: string; children: string }[] = [];
	const recentRsvps: any[] = [];

	for (const g of guests) {
		if (!g.rsvp) {
			pendingCount++;
			continue;
		}

		if (g.rsvp.attending === 'yes') {
			confirmedCount++;
			if (g.rsvp.plus_one_name) {
				plusOnesConfirmed++;
			}
			if (g.rsvp.children_names) {
				childrenNotes.push({ guestName: g.name, children: g.rsvp.children_names });
			}
			if (g.rsvp.transfer_needed) {
				transferCount++;
			}

			// parse drinks
			if (g.rsvp.drinks) {
				try {
					const list: string[] = JSON.parse(g.rsvp.drinks);
					for (const d of list) {
						drinksTally[d] = (drinksTally[d] || 0) + 1;
					}
				} catch {
					// skip
				}
			}

			if (g.rsvp.food_notes) {
				foodNotes.push({ guestName: g.name, note: g.rsvp.food_notes });
			}
			if (g.rsvp.song_request) {
				songRequests.push({ guestName: g.name, song: g.rsvp.song_request });
			}

			recentRsvps.push({
				id: g.id,
				name: g.name,
				side: g.side,
				attending: 'yes',
				plusOne: g.rsvp.plus_one_name,
				updatedAt: g.rsvp.updated_at,
				comment: g.rsvp.comment
			});
		} else if (g.rsvp.attending === 'no') {
			declinedCount++;
			recentRsvps.push({
				id: g.id,
				name: g.name,
				side: g.side,
				attending: 'no',
				updatedAt: g.rsvp.updated_at,
				comment: g.rsvp.comment
			});
		}
	}

	recentRsvps.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

	const totalGuests = guests.length;
	const totalAttendingPeople = confirmedCount + plusOnesConfirmed;

	return {
		totalGuests,
		confirmedCount,
		plusOnesConfirmed,
		totalAttendingPeople,
		declinedCount,
		pendingCount,
		transferCount,
		drinksTally,
		foodNotes,
		songRequests,
		childrenNotes,
		recentRsvps: recentRsvps.slice(0, 10)
	};
};
