-- Ограничение попыток входа в админку (защита от перебора пароля).
CREATE TABLE IF NOT EXISTS login_attempts (
	ip TEXT PRIMARY KEY,
	count INTEGER NOT NULL DEFAULT 0,
	window_start TEXT NOT NULL DEFAULT (datetime('now'))
);
