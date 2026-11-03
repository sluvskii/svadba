import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * Выдача загруженных в KV изображений (админка → Тексты → Фото ресторана).
 * Ключи хранятся как `media:<key>`, тип MIME — в метаданных значения.
 */
export const GET: RequestHandler = async (event) => {
	const kv = event.platform?.env?.IMAGES;
	if (!kv) {
		throw error(404, 'media-unavailable');
	}

	const key = event.params.key ?? '';
	// Разрешаем только безопасные ключи вида "restaurant".
	if (!/^[a-z0-9-]{1,64}$/.test(key)) {
		throw error(404, 'media-not-found');
	}

	const obj = await kv.getWithMetadata(`media:${key}`, { type: 'arrayBuffer' });
	if (!obj.value) {
		throw error(404, 'media-not-found');
	}

	const type = typeof obj.metadata?.type === 'string' ? obj.metadata.type : 'application/octet-stream';

	return new Response(obj.value as ArrayBuffer, {
		headers: {
			'Content-Type': type,
			// Короткий кеш: после перезагрузки фото обновляется в течение минуты.
			'Cache-Control': 'public, max-age=60',
			'X-Content-Type-Options': 'nosniff'
		}
	});
};
