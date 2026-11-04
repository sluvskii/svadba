export type TimelineIconVariant =
	| 'ceremony'
	| 'banquet'
	| 'night'
	| 'gathering'
	| 'transfer'
	| 'photo'
	| 'dance'
	| 'cake'
	| 'sparklers'
	| 'rings';

export type TimelineIconOption = {
	id: string; // 'auto' | TimelineIconVariant
	label: string;
	emoji: string;
};

export const TIMELINE_ICONS: TimelineIconOption[] = [
	{ id: 'auto', label: 'Автоматически по смыслу', emoji: '✨' },
	{ id: 'ceremony', label: 'Церемония и арка', emoji: '💍' },
	{ id: 'banquet', label: 'Банкет и тосты', emoji: '🥂' },
	{ id: 'night', label: 'Финал и ночной фонарь', emoji: '🌙' },
	{ id: 'gathering', label: 'Сбор гостей и фуршет', emoji: '🍸' },
	{ id: 'transfer', label: 'Кортеж и трансфер', emoji: '🚗' },
	{ id: 'photo', label: 'Фотосессия и фотозона', emoji: '📸' },
	{ id: 'dance', label: 'Первый танец и музыка', emoji: '💃' },
	{ id: 'cake', label: 'Свадебный торт', emoji: '🎂' },
	{ id: 'sparklers', label: 'Бенгальские огни и салют', emoji: '✨' },
	{ id: 'rings', label: 'Букет невесты и кольца', emoji: '💐' }
];

export const VALID_TIMELINE_ICONS = new Set([
	'ceremony',
	'banquet',
	'night',
	'gathering',
	'transfer',
	'photo',
	'dance',
	'cake',
	'sparklers',
	'rings'
]);

/**
 * Интеллектуальный определитель скетч-иконки для этапа расписания.
 * Если задан конкретный валидный icon, возвращает его.
 * Иначе анализирует ключевые слова в названии и тексте описания.
 * По умолчанию гарантированно возвращает 'rings'.
 */
export function detectTimelineIcon(
	title: string = '',
	text: string = '',
	explicitIcon?: string
): TimelineIconVariant {
	const raw = (explicitIcon || '').trim().toLowerCase();
	if (raw && raw !== 'auto' && VALID_TIMELINE_ICONS.has(raw)) {
		return raw as TimelineIconVariant;
	}

	const combined = `${title} ${text}`.toLowerCase();

	if (/трансфер|выезд|дорог|автобус|машин|поездк|кортеж/i.test(combined)) return 'transfer';
	if (/сбор|встреч|welcome|прибыти|съезд|фуршет/i.test(combined)) return 'gathering';
	if (/фото|съемк|фотосесси|фотозон|селфи|кадр/i.test(combined)) return 'photo';
	if (/танец|танц|дискотек|вальс|музык|диджей/i.test(combined)) return 'dance';
	if (/торт|десерт|сладк|каравай/i.test(combined)) return 'cake';
	if (/салют|фейерверк|бенгальск|огни|фаер|шоу/i.test(combined)) return 'sparklers';
	if (/банкет|ужин|застоль|тост|праздничн|обед/i.test(combined)) return 'banquet';
	if (/завершени|финал|окончани|ночь|прощани|разъезд|провожа/i.test(combined)) return 'night';
	if (/церемони|регистрац|роспись|венчани|брак|арк|кольц|загс/i.test(combined)) return 'ceremony';

	return 'rings';
}

/**
 * Генерация плавной непрерывной SVG кривой Безье для N пунктов расписания.
 * Каждая волна изгибается поочерёдно вправо и влево, идеально обрамляя шаги.
 */
export function generateTimelinePath(count: number): string {
	const n = Math.max(1, count);
	let d = 'M 50,20';
	const range = 960;
	for (let i = 0; i < n; i++) {
		const y0 = 20 + (i * range) / n;
		const y1 = 20 + ((i + 1) * range) / n;
		const peakX = i % 2 === 0 ? 76 : 24;
		const cp1Y = Math.round(y0 + 0.35 * (y1 - y0));
		const cp2Y = Math.round(y0 + 0.65 * (y1 - y0));
		d += ` C ${peakX},${cp1Y} ${peakX},${cp2Y} 50,${Math.round(y1)}`;
	}
	return d;
}
