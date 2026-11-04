/** Работа с D1: гости, ответы, столы, контент, настройки */

import { newToken, hashPassword } from './db';

type Env = App.Platform['env'];

export interface GuestRow {
	id: number;
	token: string;
	name: string;
	side: 'bride' | 'groom' | 'both';
	plus_one_allowed: number;
	children_allowed: number;
	note: string | null;
	created_at: string;
}

export interface RsvpRow {
	id: number;
	guest_id: number;
	attending: 'yes' | 'no';
	plus_one_name: string | null;
	children_names: string | null;
	drinks: string; // JSON-массив строковых id
	food_notes: string | null;
	transfer_needed: number;
	song_request: string | null;
	comment: string | null;
	updated_at: string;
}

export interface TableRow {
	id: number;
	name: string;
	capacity: number;
	sort_order: number;
}

export interface TableWithGuests extends TableRow {
	guests: {
		id: number;
		name: string;
		side: 'bride' | 'groom' | 'both';
		token: string;
	}[];
}

export interface GuestDetail extends GuestRow {
	table_id: number | null;
	table_name: string | null;
	rsvp: RsvpRow | null;
}

export interface SiteSettings {
	adminPasswordHash: string;
	/** Случайный секрет для подписи сессий, генерируется при первой инициализации и живёт в БД. */
	sessionSecret: string;
	/** Увеличивается при смене пароля — все выданные раньше сессии перестают действовать. */
	sessionEpoch: number;
	seatingVisible: boolean;
	telegramBotToken: string;
	telegramChatId: string;
}

export const DEFAULT_ADMIN_PASSWORD = '1712';
/** Запасной секрет для окружения без БД (локальные статические тесты). */
export const FALLBACK_SESSION_SECRET = 'svadba-secret-salt-2026-alina-kamil';

/** Ограничение перебора пароля: не более N неудачных попыток за окно времени. */
export const LOGIN_MAX_ATTEMPTS = 5;
export const LOGIN_WINDOW_MINUTES = 10;

function env(event: { platform?: App.Platform }): Env | null {
	return event.platform?.env ?? null;
}

export async function getGuestByToken(
	event: { platform?: App.Platform },
	token: string
): Promise<GuestDetail | null> {
	const db = env(event)?.DB;
	if (!db) return null;

	const row = await db
		.prepare(
			`SELECT g.*, 
			        t.id AS table_id, t.name AS table_name,
			        r.id AS rsvp_id, r.attending, r.plus_one_name, r.children_names,
			        r.drinks, r.food_notes, r.transfer_needed, r.song_request, r.comment, r.updated_at AS rsvp_updated_at
			 FROM guests g
			 LEFT JOIN seats s ON s.guest_id = g.id
			 LEFT JOIN tables t ON t.id = s.table_id
			 LEFT JOIN rsvps r ON r.guest_id = g.id
			 WHERE g.token = ?`
		)
		.bind(token)
		.first<any>();

	if (!row) return null;

	return {
		id: row.id,
		token: row.token,
		name: row.name,
		side: row.side,
		plus_one_allowed: row.plus_one_allowed,
		children_allowed: row.children_allowed,
		note: row.note,
		created_at: row.created_at,
		table_id: row.table_id ?? null,
		table_name: row.table_name ?? null,
		rsvp: row.rsvp_id
			? {
					id: row.rsvp_id,
					guest_id: row.id,
					attending: row.attending,
					plus_one_name: row.plus_one_name,
					children_names: row.children_names,
					drinks: row.drinks || '[]',
					food_notes: row.food_notes,
					transfer_needed: row.transfer_needed,
					song_request: row.song_request,
					comment: row.comment,
					updated_at: row.rsvp_updated_at
				}
			: null
	};
}

export async function listGuests(event: { platform?: App.Platform }): Promise<GuestDetail[]> {
	const db = env(event)?.DB;
	if (!db) return [];

	const rows = await db
		.prepare(
			`SELECT g.*, 
			        t.id AS table_id, t.name AS table_name,
			        r.id AS rsvp_id, r.attending, r.plus_one_name, r.children_names,
			        r.drinks, r.food_notes, r.transfer_needed, r.song_request, r.comment, r.updated_at AS rsvp_updated_at
			 FROM guests g
			 LEFT JOIN seats s ON s.guest_id = g.id
			 LEFT JOIN tables t ON t.id = s.table_id
			 LEFT JOIN rsvps r ON r.guest_id = g.id
			 ORDER BY g.name COLLATE NOCASE`
		)
		.all<any>();

	return rows.results.map((row: any) => ({
		id: row.id,
		token: row.token,
		name: row.name,
		side: row.side,
		plus_one_allowed: row.plus_one_allowed,
		children_allowed: row.children_allowed,
		note: row.note,
		created_at: row.created_at,
		table_id: row.table_id ?? null,
		table_name: row.table_name ?? null,
		rsvp: row.rsvp_id
			? {
					id: row.rsvp_id,
					guest_id: row.id,
					attending: row.attending,
					plus_one_name: row.plus_one_name,
					children_names: row.children_names,
					drinks: row.drinks || '[]',
					food_notes: row.food_notes,
					transfer_needed: row.transfer_needed,
					song_request: row.song_request,
					comment: row.comment,
					updated_at: row.rsvp_updated_at
				}
			: null
	}));
}

export async function createGuest(
	event: { platform?: App.Platform },
	data: { name: string; side: string; plusOneAllowed: boolean; childrenAllowed: boolean; note?: string }
): Promise<string> {
	const db = env(event)?.DB;
	if (!db) throw new Error('DB is not configured');
	const token = newToken();
	await db
		.prepare(
			`INSERT INTO guests (token, name, side, plus_one_allowed, children_allowed, note)
			 VALUES (?, ?, ?, ?, ?, ?)`
		)
		.bind(
			token,
			data.name.trim().slice(0, 120),
			data.side === 'bride' || data.side === 'groom' ? data.side : 'both',
			data.plusOneAllowed ? 1 : 0,
			data.childrenAllowed ? 1 : 0,
			data.note?.trim().slice(0, 500) || null
		)
		.run();
	return token;
}

export async function updateGuest(
	event: { platform?: App.Platform },
	id: number,
	data: { name: string; side: string; plusOneAllowed: boolean; childrenAllowed: boolean; note?: string }
): Promise<void> {
	const db = env(event)?.DB;
	if (!db) throw new Error('DB is not configured');
	await db
		.prepare(
			`UPDATE guests
			 SET name = ?, side = ?, plus_one_allowed = ?, children_allowed = ?, note = ?
			 WHERE id = ?`
		)
		.bind(
			data.name.trim().slice(0, 120),
			data.side === 'bride' || data.side === 'groom' ? data.side : 'both',
			data.plusOneAllowed ? 1 : 0,
			data.childrenAllowed ? 1 : 0,
			data.note?.trim().slice(0, 500) || null,
			id
		)
		.run();
}

export async function deleteGuest(event: { platform?: App.Platform }, id: number): Promise<void> {
	const db = env(event)?.DB;
	if (!db) return;
	await db.prepare('DELETE FROM rsvps WHERE guest_id = ?').bind(id).run();
	await db.prepare('DELETE FROM seats WHERE guest_id = ?').bind(id).run();
	await db.prepare('DELETE FROM guests WHERE id = ?').bind(id).run();
}

export async function saveRsvp(
	event: { platform?: App.Platform },
	guestId: number,
	data: {
		attending: 'yes' | 'no';
		plusOneName?: string;
		childrenNames?: string;
		drinks: string[];
		foodNotes?: string;
		transferNeeded: boolean;
		songRequest?: string;
		comment?: string;
	}
): Promise<void> {
	const db = env(event)?.DB;
	if (!db) throw new Error('DB is not configured');
	await db
		.prepare(
			`INSERT INTO rsvps (guest_id, attending, plus_one_name, children_names, drinks, food_notes, transfer_needed, song_request, comment, updated_at)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
			 ON CONFLICT(guest_id) DO UPDATE SET
			   attending = excluded.attending,
			   plus_one_name = excluded.plus_one_name,
			   children_names = excluded.children_names,
			   drinks = excluded.drinks,
			   food_notes = excluded.food_notes,
			   transfer_needed = excluded.transfer_needed,
			   song_request = excluded.song_request,
			   comment = excluded.comment,
			   updated_at = excluded.updated_at`
		)
		.bind(
			guestId,
			data.attending,
			data.plusOneName?.trim() || null,
			data.childrenNames?.trim() || null,
			JSON.stringify(data.drinks),
			data.foodNotes?.trim() || null,
			data.transferNeeded ? 1 : 0,
			data.songRequest?.trim() || null,
			data.comment?.trim() || null
		)
		.run();
}

export async function listTables(event: { platform?: App.Platform }): Promise<TableRow[]> {
	const db = env(event)?.DB;
	if (!db) return [];
	const res = await db.prepare('SELECT * FROM tables ORDER BY sort_order, id').all<TableRow>();
	return res.results;
}

export async function listTablesWithGuests(event: { platform?: App.Platform }): Promise<TableWithGuests[]> {
	const db = env(event)?.DB;
	if (!db) return [];

	const tablesRes = await db.prepare('SELECT * FROM tables ORDER BY sort_order, id').all<TableRow>();
	const tables = tablesRes.results;

	const seatsRes = await db
		.prepare(
			`SELECT s.table_id, g.id, g.name, g.side, g.token
			 FROM seats s
			 JOIN guests g ON g.id = s.guest_id
			 ORDER BY s.position, g.name`
		)
		.all<{ table_id: number; id: number; name: string; side: 'bride' | 'groom' | 'both'; token: string }>();

	const map = new Map<number, TableWithGuests['guests']>();
	for (const t of tables) map.set(t.id, []);

	for (const seat of seatsRes.results) {
		const list = map.get(seat.table_id);
		if (list) {
			list.push({ id: seat.id, name: seat.name, side: seat.side, token: seat.token });
		}
	}

	return tables.map((t: TableRow) => ({
		...t,
		guests: map.get(t.id) ?? []
	}));
}

export async function upsertTable(
	event: { platform?: App.Platform },
	data: { id?: number; name: string; capacity: number; sort_order: number }
): Promise<number> {
	const db = env(event)?.DB;
	if (!db) throw new Error('DB is not configured');
	if (data.id) {
		await db
			.prepare('UPDATE tables SET name = ?, capacity = ?, sort_order = ? WHERE id = ?')
			.bind(data.name.trim().slice(0, 60), data.capacity, data.sort_order, data.id)
			.run();
		return data.id;
	} else {
		const res = await db
			.prepare('INSERT INTO tables (name, capacity, sort_order) VALUES (?, ?, ?)')
			.bind(data.name.trim().slice(0, 60), data.capacity, data.sort_order)
			.run();
		return Number(res.meta.last_row_id);
	}
}

export async function deleteTable(event: { platform?: App.Platform }, id: number): Promise<void> {
	const db = env(event)?.DB;
	if (!db) return;
	await db.prepare('DELETE FROM seats WHERE table_id = ?').bind(id).run();
	await db.prepare('DELETE FROM tables WHERE id = ?').bind(id).run();
}

export async function assignSeat(
	event: { platform?: App.Platform },
	guestId: number,
	tableId: number | null,
	position = 1
): Promise<void> {
	const db = env(event)?.DB;
	if (!db) return;
	await db.prepare('DELETE FROM seats WHERE guest_id = ?').bind(guestId).run();
	if (tableId != null) {
		await db
			.prepare('INSERT INTO seats (table_id, guest_id, position) VALUES (?, ?, ?)')
			.bind(tableId, guestId, position)
			.run();
	}
}

export async function loadContentOverride(
	event: { platform?: App.Platform }
): Promise<Record<string, unknown> | null> {
	const db = env(event)?.DB;
	if (!db) return null;
	const row = await db
		.prepare("SELECT value FROM site_content WHERE key = 'site'")
		.first<{ value: string }>();
	if (!row) return null;
	try {
		return JSON.parse(row.value) as Record<string, unknown>;
	} catch {
		return null;
	}
}

export async function saveContentOverride(
	event: { platform?: App.Platform },
	value: Record<string, unknown>
): Promise<void> {
	const db = env(event)?.DB;
	if (!db) throw new Error('DB is not configured');
	await db
		.prepare(
			`INSERT INTO site_content (key, value, updated_at) VALUES ('site', ?, datetime('now'))
			 ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
		)
		.bind(JSON.stringify(value))
		.run();
}

export async function getSettings(event: { platform?: App.Platform }): Promise<SiteSettings> {
	const db = env(event)?.DB;
	const defaultSettings: SiteSettings = {
		adminPasswordHash: '',
		sessionSecret: FALLBACK_SESSION_SECRET,
		sessionEpoch: 0,
		seatingVisible: false,
		telegramBotToken: '',
		telegramChatId: ''
	};

	if (!db) return defaultSettings;

	const row = await db
		.prepare("SELECT value FROM site_content WHERE key = 'settings'")
		.first<{ value: string }>();

	if (!row) {
		// Initialize default password hash if not set
		const hash = await hashPassword(DEFAULT_ADMIN_PASSWORD);
		defaultSettings.adminPasswordHash = hash;
		defaultSettings.sessionSecret = newToken(32);
		await saveSettings(event, defaultSettings);
		return defaultSettings;
	}

	try {
		const parsed = JSON.parse(row.value);
		defaultSettings.adminPasswordHash =
			parsed.adminPasswordHash || (await hashPassword(DEFAULT_ADMIN_PASSWORD));
		defaultSettings.seatingVisible = Boolean(parsed.seatingVisible);
		defaultSettings.telegramBotToken = parsed.telegramBotToken || '';
		defaultSettings.telegramChatId = parsed.telegramChatId || '';
		defaultSettings.sessionEpoch = Number(parsed.sessionEpoch) || 0;

		// Секрет сессии появился позже: генерируем один раз и сохраняем.
		if (parsed.sessionSecret) {
			defaultSettings.sessionSecret = parsed.sessionSecret;
		} else {
			defaultSettings.sessionSecret = newToken(32);
			await saveSettings(event, defaultSettings);
		}

		return defaultSettings;
	} catch {
		return defaultSettings;
	}
}

export async function saveSettings(
	event: { platform?: App.Platform },
	settings: SiteSettings
): Promise<void> {
	const db = env(event)?.DB;
	if (!db) throw new Error('DB is not configured');
	await db
		.prepare(
			`INSERT INTO site_content (key, value, updated_at) VALUES ('settings', ?, datetime('now'))
			 ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
		)
		.bind(JSON.stringify(settings))
		.run();
}

/** Заблокирован ли вход для данного IP (перебор пароля). */
export async function isLoginBlocked(
	event: { platform?: App.Platform },
	ip: string
): Promise<boolean> {
	const db = env(event)?.DB;
	if (!db) return false;
	const row = await db
		.prepare(
			`SELECT count FROM login_attempts
			 WHERE ip = ? AND window_start > datetime('now', ?)`
		)
		.bind(ip, `-${LOGIN_WINDOW_MINUTES} minutes`)
		.first<{ count: number }>();
	return Boolean(row && row.count >= LOGIN_MAX_ATTEMPTS);
}

/** Зафиксировать неудачную попытку входа. */
export async function recordLoginFailure(
	event: { platform?: App.Platform },
	ip: string
): Promise<void> {
	const db = env(event)?.DB;
	if (!db) return;
	await db
		.prepare(
			`INSERT INTO login_attempts (ip, count, window_start) VALUES (?, 1, datetime('now'))
			 ON CONFLICT(ip) DO UPDATE SET
			   count = CASE WHEN window_start > datetime('now', '-${LOGIN_WINDOW_MINUTES} minutes')
			                THEN count + 1 ELSE 1 END,
			   window_start = CASE WHEN window_start > datetime('now', '-${LOGIN_WINDOW_MINUTES} minutes')
			                       THEN window_start ELSE datetime('now') END`
		)
		.bind(ip)
		.run();
}

/** Сбросить счётчик попыток после успешного входа. */
export async function clearLoginAttempts(
	event: { platform?: App.Platform },
	ip: string
): Promise<void> {
	const db = env(event)?.DB;
	if (!db) return;
	await db.prepare('DELETE FROM login_attempts WHERE ip = ?').bind(ip).run();
}
