import { fail } from '@sveltejs/kit';
import { loadContentOverride, saveContentOverride } from '#lib/repo';
import { content as defaultContent } from '#lib/content';
import { pick } from '#lib/i18n.svelte';
import { parseEditableDrinks, type EditableDrink } from '#lib/rsvp-form';
import type { Actions, PageServerLoad } from './$types';

const MAX_PHOTO_BYTES = 8 * 1024 * 1024; // 8 МБ

type EditableChapter = { title: string; text: string };
type EditableFaq = { q: string; a: string };
type EditableCourse = { label: string; title: string; text: string };

/** Строки из override или пустая строка. */
function str(ov: Record<string, unknown> | null, key: string): string {
	const v = ov?.[key];
	return typeof v === 'string' ? v : '';
}

/** Разбор JSON-списка из формы с валидацией и лимитами. */
function parseJsonList<T>(raw: FormDataEntryValue | null, limit: number): T[] | null {
	if (typeof raw !== 'string' || !raw.trim()) return null;
	try {
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return null;
		return parsed.slice(0, limit) as T[];
	} catch {
		return null;
	}
}

const clean = (v: unknown, max: number): string =>
	typeof v === 'string' ? v.trim().slice(0, max) : '';

export const load: PageServerLoad = async (event) => {
	const override = await loadContentOverride(event);

	// Default values extracted from defaultContent
	const current = {
		dateLong: (override?.dateLong as string) || pick(defaultContent.wedding.dateLong),
		venue: (override?.venue as string) || pick(defaultContent.wedding.venue),
		city: (override?.city as string) || pick(defaultContent.wedding.city),
		address: (override?.address as string) || pick(defaultContent.wedding.address),
		mapUrl: (override?.mapUrl as string) || defaultContent.wedding.mapUrl,
		gatheringTime: typeof override?.gatheringTime === 'string' ? override.gatheringTime : '',
		ceremonyTime: (override?.ceremonyTime as string) || '14:20',
		dinnerTime: (override?.dinnerTime as string) || '18:00',
		endTime: (override?.endTime as string) || '00:00',
		invitationTitle: (override?.invitationTitle as string) || pick(defaultContent.invitation.title),
		invitationText: (override?.invitationText as string) || defaultContent.invitation.paragraphs.map(p => pick(p)).join('\n\n'),
		invitationSignature: (override?.invitationSignature as string) || pick(defaultContent.invitation.signature),
		dressCodeTitle: (override?.dressCodeTitle as string) || pick(defaultContent.dressCode.title),
		dressCodeText: (override?.dressCodeText as string) || pick(defaultContent.dressCode.text),
		dressCodeNote: (override?.dressCodeNote as string) || pick(defaultContent.dressCode.note)
	};

	const drinksList: EditableDrink[] = parseEditableDrinks(override?.drinks);

	// Списки: сохранённые главы/вопросы/блюда или пустые массивы —
	// редактор стартует с тем, что реально видно на сайте.
	const storyRaw = override?.story as { chapters?: EditableChapter[] } | undefined;
	const storyChapters: EditableChapter[] = Array.isArray(storyRaw?.chapters)
		? storyRaw!.chapters!.map((c) => ({
				title: clean(c?.title, 80),
				text: clean(c?.text, 700)
			}))
		: [];

	const faqRaw = override?.faq as { items?: EditableFaq[] } | undefined;
	const faqItems: EditableFaq[] = Array.isArray(faqRaw?.items)
		? faqRaw!.items!.map((c) => ({ q: clean(c?.q, 160), a: clean(c?.a, 600) }))
		: defaultContent.faq.items.map((item) => ({
				q: pick(item.q),
				a: pick(item.a)
			}));

	const menuRaw = override?.menu as { courses?: EditableCourse[]; bar?: string } | undefined;
	const menuCourses: EditableCourse[] = Array.isArray(menuRaw?.courses)
		? menuRaw!.courses!.map((c) => ({
				label: clean(c?.label, 40),
				title: clean(c?.title, 80),
				text: clean(c?.text, 400)
			}))
		: defaultContent.menu.courses.map((c) => ({
				label: pick(c.label),
				title: pick(c.title),
				text: pick(c.text)
			}));
	const menuBar: string = str(menuRaw ?? ({} as Record<string, unknown>), 'bar') ||
		pick(defaultContent.menu.bar);

	// Есть ли уже фото ресторана в KV.
	let photoExists = false;
	const kv = event.platform?.env?.IMAGES;
	if (kv) {
		try {
			const list = await kv.list({ prefix: 'media:restaurant' });
			photoExists = list.keys.length > 0;
		} catch {
			photoExists = false;
		}
	}

	return { current, storyChapters, faqItems, menuCourses, menuBar, drinksList, photoExists };
};

export const actions: Actions = {
	save: async (event) => {
		const data = await event.request.formData();

		const payload: Record<string, unknown> = {
			dateLong: String(data.get('dateLong') ?? '').trim().slice(0, 80),
			venue: String(data.get('venue') ?? '').trim().slice(0, 80),
			city: String(data.get('city') ?? '').trim().slice(0, 80),
			address: String(data.get('address') ?? '').trim().slice(0, 160),
			mapUrl: String(data.get('mapUrl') ?? '').trim().slice(0, 500),
			gatheringTime: String(data.get('gatheringTime') ?? '').trim().slice(0, 10),
			ceremonyTime: String(data.get('ceremonyTime') ?? '').trim().slice(0, 10),
			dinnerTime: String(data.get('dinnerTime') ?? '').trim().slice(0, 10),
			endTime: String(data.get('endTime') ?? '').trim().slice(0, 10),
			invitationTitle: String(data.get('invitationTitle') ?? '').trim().slice(0, 120),
			invitationText: String(data.get('invitationText') ?? '').trim().slice(0, 1500),
			invitationSignature: String(data.get('invitationSignature') ?? '').trim().slice(0, 120),
			dressCodeTitle: String(data.get('dressCodeTitle') ?? '').trim().slice(0, 120),
			dressCodeText: String(data.get('dressCodeText') ?? '').trim().slice(0, 600),
			dressCodeNote: String(data.get('dressCodeNote') ?? '').trim().slice(0, 400)
		};

		// Напитки RSVP
		const drinksRaw = parseJsonList<EditableDrink>(data.get('drinksJson'), 24);
		if (drinksRaw && drinksRaw.length > 0) {
			payload.drinks = drinksRaw
				.map((d, i) => ({
					id: clean(d?.id, 40) || `drink-${i + 1}`,
					labelRu: clean(d?.labelRu, 60),
					labelTt: clean(d?.labelTt, 60),
					alcohol: Boolean(d?.alcohol)
				}))
				.filter((d) => d.labelRu);
		}

		// История: главы (title + text). Пустые главы отбрасываются.
		const chapters = parseJsonList<EditableChapter>(data.get('storyJson'), 8);
		if (chapters) {
			payload.story = {
				chapters: chapters
					.map((c) => ({ title: clean(c?.title, 80), text: clean(c?.text, 700) }))
					.filter((c) => c.title || c.text)
			};
		}

		// FAQ: пары вопрос-ответ.
		const faq = parseJsonList<EditableFaq>(data.get('faqJson'), 12);
		if (faq) {
			payload.faq = {
				items: faq
					.map((c) => ({ q: clean(c?.q, 160), a: clean(c?.a, 600) }))
					.filter((c) => c.q || c.a)
			};
		}

		// Меню: курсы + строка бара.
		const courses = parseJsonList<EditableCourse>(data.get('menuJson'), 8);
		if (courses) {
			payload.menu = {
				courses: courses
					.map((c) => ({
						label: clean(c?.label, 40),
						title: clean(c?.title, 80),
						text: clean(c?.text, 400)
					}))
					.filter((c) => c.label || c.title || c.text),
				bar: String(data.get('menuBar') ?? '').trim().slice(0, 400)
			};
		}

		try {
			await saveContentOverride(event, payload);
		} catch {
			return fail(500, {
				saveError: 'База данных недоступна. Перезапустите dev-сервер и попробуйте ещё раз.'
			});
		}

		return { success: true };
	},

	uploadPhoto: async (event) => {
		const kv = event.platform?.env?.IMAGES;
		if (!kv) {
			return fail(500, { photoError: 'KV-хранилище недоступно. Проверьте wrangler.jsonc.' });
		}

		const data = await event.request.formData();
		const file = data.get('photo');

		if (!(file instanceof File) || file.size === 0) {
			return fail(400, { photoError: 'Выберите файл изображения' });
		}
		if (!file.type.startsWith('image/')) {
			return fail(400, { photoError: 'Нужен файл-изображение (JPG, PNG, WebP)' });
		}
		if (file.size > MAX_PHOTO_BYTES) {
			return fail(400, { photoError: 'Файл больше 8 МБ — уменьшите фотографию' });
		}

		const buf = await file.arrayBuffer();
		await kv.put('media:restaurant', buf, {
			metadata: { type: file.type },
			// HTTP-метаданные KV: заголовки ответа при выдаче.
			httpMetadata: { contentType: file.type }
		});

		return { photoSuccess: true };
	},

	removePhoto: async (event) => {
		const kv = event.platform?.env?.IMAGES;
		if (!kv) {
			return fail(500, { photoError: 'KV-хранилище недоступно' });
		}
		await kv.delete('media:restaurant');
		return { photoRemoved: true };
	}
};
