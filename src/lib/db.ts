/** Утилиты для Cloudflare Workers / D1 */

/** Случайный токен приглашения (url-safe) */
export function newToken(bytes = 24): string {
	const arr = crypto.getRandomValues(new Uint8Array(bytes));
	return base64UrlEncode(arr);
}

function base64UrlEncode(arr: Uint8Array): string {
	let bin = '';
	for (const b of arr) bin += String.fromCharCode(b);
	return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Сравнение с хэшем пароля (PBKDF2-SHA256), формат: salt$iterations$hash (base64url) */
export async function hashPassword(password: string): Promise<string> {
	const salt = crypto.getRandomValues(new Uint8Array(16));
	const iterations = 100_000;
	const derived = await deriveKey(password, salt, iterations);
	return `${base64UrlEncode(salt)}$${iterations}$${base64UrlEncode(new Uint8Array(derived))}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
	const [saltB64, iterStr, hashB64] = stored.split('$');
	if (!saltB64 || !iterStr || !hashB64) return false;
	const salt = base64UrlDecode(saltB64);
	const iterations = Number.parseInt(iterStr, 10);
	const expected = base64UrlDecode(hashB64);
	const derived = new Uint8Array(await deriveKey(password, salt, iterations));
	if (derived.length !== expected.length) return false;
	let diff = 0;
	for (let i = 0; i < derived.length; i++) diff |= derived[i] ^ expected[i];
	return diff === 0;
}

async function deriveKey(password: string, salt: Uint8Array, iterations: number): Promise<ArrayBuffer> {
	const enc = new TextEncoder();
	const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, [
		'deriveBits'
	]);
	return crypto.subtle.deriveBits(
		{ name: 'PBKDF2', salt: toArrayBuffer(salt), iterations, hash: 'SHA-256' },
		keyMaterial,
		256
	);
}

function toArrayBuffer(arr: Uint8Array): ArrayBuffer {
	const copy = new ArrayBuffer(arr.length);
	new Uint8Array(copy).set(arr);
	return copy;
}

function base64UrlDecode(s: string): Uint8Array {
	const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
	const arr = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
	return arr;
}

/** Подпись токена сессии администратора (HMAC-SHA256) */
export async function signSession(secret: string, payload: string): Promise<string> {
	const enc = new TextEncoder();
	const key = await crypto.subtle.importKey(
		'raw',
		enc.encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign']
	);
	const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
	return `${payload}.${base64UrlEncode(new Uint8Array(sig))}`;
}

export async function verifySession(secret: string, token: string): Promise<string | null> {
	const dot = token.lastIndexOf('.');
	if (dot <= 0) return null;
	const payload = token.slice(0, dot);
	const expected = await signSession(secret, payload);
	if (expected !== token) return null;
	return payload;
}
