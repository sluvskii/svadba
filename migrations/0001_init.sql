-- Персональные приглашения и ответы гостей.
-- Токен доступа к странице приглашения (случайная строка).

CREATE TABLE IF NOT EXISTS guests (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	token TEXT NOT NULL UNIQUE,
	name TEXT NOT NULL,
	-- bride | groom | both — чья сторона
	side TEXT NOT NULL DEFAULT 'both',
	-- можно привести пару?
	plus_one_allowed INTEGER NOT NULL DEFAULT 0,
	-- есть ли дети в списке
	children_allowed INTEGER NOT NULL DEFAULT 0,
	note TEXT,
	created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Ответы: по одному на гостя (перезаписывается при изменении)

CREATE TABLE IF NOT EXISTS rsvps (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	guest_id INTEGER NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
	attending TEXT NOT NULL CHECK (attending IN ('yes', 'no')),
	plus_one_name TEXT,
	children_names TEXT,
	drinks TEXT NOT NULL DEFAULT '', -- JSON-массив выбранных id напитков
	food_notes TEXT,
	transfer_needed INTEGER NOT NULL DEFAULT 0,
	song_request TEXT,
	comment TEXT,
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	UNIQUE (guest_id)
);

-- Рассадка: столы и места

CREATE TABLE IF NOT EXISTS tables (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	capacity INTEGER NOT NULL DEFAULT 8,
	sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS seats (
	table_id INTEGER NOT NULL REFERENCES tables(id) ON DELETE CASCADE,
	guest_id INTEGER NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
	position INTEGER NOT NULL DEFAULT 1,
	PRIMARY KEY (table_id, guest_id)
);

-- Контент сайта, редактируемый молодожёнами (JSON-документ целиком)

CREATE TABLE IF NOT EXISTS site_content (
	key TEXT PRIMARY KEY,
	value TEXT NOT NULL,
	updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
