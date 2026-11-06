import { fail } from '@sveltejs/kit';
import { loadContentOverride, saveContentOverride } from '#lib/repo';
import { content as defaultContent } from '#lib/content';
import { pick } from '#lib/i18n.svelte';
import { parseEditableDrinks, type EditableDrink } from '#lib/rsvp-form';
import type { Actions, PageServerLoad } from './$types';

const MAX_PHOTO_BYTES = 8 * 1024 * 1024; // 8 МБ

type EditableChapter = { title: string; titleTt: string; text: string; textTt: string };
type EditableFaq = { q: string; qTt: string; a: string; aTt: string };
type EditableCourse = {
	label: string;
	labelTt: string;
	title: string;
	titleTt: string;
	text: string;
	textTt: string;
};
type EditableTimelineItem = {
	time: string;
	title: string;
	titleTt: string;
	text: string;
	textTt: string;
	icon: string;
};

/** Строки из override или пустая строка. */
function str(ov: Record<string, unknown> | null, key: string): string {
	const v = ov?.[key];
	return typeof v === 'string' ? v : '';
}

/**
 * Пара «русский / татарский» для скалярного поля.
 * Если текст переопределён в админке, берём сохранённый татарский вариант (может быть пустым).
 * Если переопределения нет — показываем оба значения по умолчанию.
 */
function pair(
	override: Record<string, unknown> | null,
	key: string,
	defaultValue: { ru: string; tt?: string }
): { ru: string; tt: string } {
	const custom = str(override, key).trim();
	if (custom) {
		return { ru: custom, tt: str(override, `${key}Tt`).trim() };
	}
	return { ru: defaultValue.ru, tt: defaultValue.tt ?? '' };
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
	const dateLong = pair(override, 'dateLong', defaultContent.wedding.dateLong);
	const venue = pair(override, 'venue', defaultContent.wedding.venue);
	const city = pair(override, 'city', defaultContent.wedding.city);
	const address = pair(override, 'address', defaultContent.wedding.address);
	const invitationTitle = pair(override, 'invitationTitle', defaultContent.invitation.title);
	const invitationSignature = pair(
		override,
		'invitationSignature',
		defaultContent.invitation.signature
	);
	const dressCodeTitle = pair(override, 'dressCodeTitle', defaultContent.dressCode.title);
	const dressCodeText = pair(override, 'dressCodeText', defaultContent.dressCode.text);
	const dressCodeNote = pair(override, 'dressCodeNote', defaultContent.dressCode.note);

	const invitationText = pair(
		override,
		'invitationText',
		{
			ru: defaultContent.invitation.paragraphs.map((p) => pick(p)).join('\n\n'),
			tt: defaultContent.invitation.paragraphs.map((p) => pick(p, 'tt')).join('\n\n')
		}
	);

	const current = {
		dateLong: dateLong.ru,
		dateLongTt: dateLong.tt,
		venue: venue.ru,
		venueTt: venue.tt,
		city: city.ru,
		cityTt: city.tt,
		address: address.ru,
		addressTt: address.tt,
		mapUrl: (override?.mapUrl as string) || defaultContent.wedding.mapUrl,
		gatheringTime: typeof override?.gatheringTime === 'string' ? override.gatheringTime : '',
		ceremonyTime: (override?.ceremonyTime as string) || '14:20',
		dinnerTime: (override?.dinnerTime as string) || '18:00',
		endTime: (override?.endTime as string) || '00:00',
		invitationTitle: invitationTitle.ru,
		invitationTitleTt: invitationTitle.tt,
		invitationText: invitationText.ru,
		invitationTextTt: invitationText.tt,
		invitationSignature: invitationSignature.ru,
		invitationSignatureTt: invitationSignature.tt,
		dressCodeTitle: dressCodeTitle.ru,
		dressCodeTitleTt: dressCodeTitle.tt,
		dressCodeText: dressCodeText.ru,
		dressCodeTextTt: dressCodeText.tt,
		dressCodeNote: dressCodeNote.ru,
		dressCodeNoteTt: dressCodeNote.tt
	};

	const drinksList: EditableDrink[] = parseEditableDrinks(override?.drinks);

	// Списки: сохранённые главы/вопросы/блюда или значения по умолчанию —
	// редактор стартует с тем, что реально видно на сайте.
	const storyRaw = override?.story as { chapters?: EditableChapter[] } | undefined;
	const storyChapters: EditableChapter[] = Array.isArray(storyRaw?.chapters)
		? storyRaw!.chapters!.map((c) => ({
				title: clean(c?.title, 80),
				titleTt: clean(c?.titleTt, 80),
				text: clean(c?.text, 700),
				textTt: clean(c?.textTt, 700)
			}))
		: [];

	const faqRaw = override?.faq as { items?: EditableFaq[] } | undefined;
	const faqItems: EditableFaq[] = Array.isArray(faqRaw?.items)
		? faqRaw!.items!.map((c) => ({
				q: clean(c?.q, 160),
				qTt: clean(c?.qTt, 160),
				a: clean(c?.a, 600),
				aTt: clean(c?.aTt, 600)
			}))
		: defaultContent.faq.items.map((item) => ({
				q: pick(item.q),
				qTt: pick(item.q, 'tt'),
				a: pick(item.a),
				aTt: pick(item.a, 'tt')
			}));

	const menuRaw = override?.menu as { courses?: EditableCourse[]; bar?: string; barTt?: string } | undefined;
	const menuCourses: EditableCourse[] = Array.isArray(menuRaw?.courses)
		? menuRaw!.courses!.map((c) => ({
				label: clean(c?.label, 40),
				labelTt: clean(c?.labelTt, 40),
				title: clean(c?.title, 80),
				titleTt: clean(c?.titleTt, 80),
				text: clean(c?.text, 400),
				textTt: clean(c?.textTt, 400)
			}))
		: defaultContent.menu.courses.map((c) => ({
				label: pick(c.label),
				labelTt: pick(c.label, 'tt'),
				title: pick(c.title),
				titleTt: pick(c.title, 'tt'),
				text: pick(c.text),
				textTt: pick(c.text, 'tt')
			}));
	const customBar =
		typeof menuRaw?.bar === 'string' && menuRaw.bar.trim() ? menuRaw.bar.trim() : '';
	const menuBar = customBar || pick(defaultContent.menu.bar);
	const menuBarTt = customBar
		? typeof menuRaw?.barTt === 'string'
			? menuRaw.barTt.trim()
			: ''
		: pick(defaultContent.menu.bar, 'tt');

	const timelineRaw = override?.timeline as { items?: EditableTimelineItem[] } | undefined;
	let timelineItems: EditableTimelineItem[];
	if (Array.isArray(timelineRaw?.items) && timelineRaw.items.length > 0) {
		timelineItems = timelineRaw.items.map((it) => ({
			time: clean(it?.time, 15),
			title: clean(it?.title, 80),
			titleTt: clean(it?.titleTt, 80),
			text: clean(it?.text, 300),
			textTt: clean(it?.textTt, 300),
			icon: clean(it?.icon, 30) || 'auto'
		}));
	} else {
		timelineItems = defaultContent.timeline.items.map((it) => ({
			time: it.time,
			title: pick(it.title),
			titleTt: pick(it.title, 'tt'),
			text: pick(it.text),
			textTt: pick(it.text, 'tt'),
			icon: it.icon || 'auto'
		}));
	}

	// Какие фотографии уже загружены в KV.
	let photoExists = false;
	let couplePhotoExists = false;
	const kv = event.platform?.env?.IMAGES;
	if (kv) {
		try {
			const list = await kv.list({ prefix: 'media:' });
			photoExists = list.keys.some((key: { name: string }) => key.name === 'media:restaurant');
			couplePhotoExists = list.keys.some((key: { name: string }) => key.name === 'media:couple');
		} catch {
			photoExists = false;
			couplePhotoExists = false;
		}
	}

	return {
		current,
		storyChapters,
		faqItems,
		menuCourses,
		menuBar,
		menuBarTt,
		drinksList,
		timelineItems,
		photoExists,
		couplePhotoExists
	};
};

export const actions: Actions = {
	save: async (event) => {
		const data = await event.request.formData();

		const field = (name: string, max: number): string =>
			String(data.get(name) ?? '').trim().slice(0, max);
		const payload: Record<string, unknown> = {
			dateLong: field('dateLong', 80),
			dateLongTt: field('dateLongTt', 80),
			venue: field('venue', 80),
			venueTt: field('venueTt', 80),
			city: field('city', 80),
			cityTt: field('cityTt', 80),
			address: field('address', 160),
			addressTt: field('addressTt', 160),
			mapUrl: field('mapUrl', 500),
			gatheringTime: field('gatheringTime', 10),
			ceremonyTime: field('ceremonyTime', 10),
			dinnerTime: field('dinnerTime', 10),
			endTime: field('endTime', 10),
			invitationTitle: field('invitationTitle', 120),
			invitationTitleTt: field('invitationTitleTt', 120),
			invitationText: field('invitationText', 1500),
			invitationTextTt: field('invitationTextTt', 1500),
			invitationSignature: field('invitationSignature', 120),
			invitationSignatureTt: field('invitationSignatureTt', 120),
			dressCodeTitle: field('dressCodeTitle', 120),
			dressCodeTitleTt: field('dressCodeTitleTt', 120),
			dressCodeText: field('dressCodeText', 600),
			dressCodeTextTt: field('dressCodeTextTt', 600),
			dressCodeNote: field('dressCodeNote', 400),
			dressCodeNoteTt: field('dressCodeNoteTt', 400)
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

		// Расписание программы дня
		const timelineList = parseJsonList<EditableTimelineItem>(data.get('timelineJson'), 16);
		if (timelineList && timelineList.length > 0) {
			const cleanedTimeline = timelineList
				.map((it) => ({
					time: clean(it?.time, 15),
					title: clean(it?.title, 80),
					titleTt: clean(it?.titleTt, 80),
					text: clean(it?.text, 300),
					textTt: clean(it?.textTt, 300),
					icon: clean(it?.icon, 30) || 'auto'
				}))
				.filter((it) => it.time || it.title || it.titleTt);

			payload.timeline = { items: cleanedTimeline };

			// Синхронизация традиционных полей для обратной совместимости
			const gather = cleanedTimeline.find((it) => /сбор|welcome|встреч/i.test(it.title));
			const cerem = cleanedTimeline.find((it) => /церемони|регистрац|роспись/i.test(it.title));
			const dinner = cleanedTimeline.find((it) => /банкет|ужин|застоль/i.test(it.title));
			const end = cleanedTimeline[cleanedTimeline.length - 1];

			if (gather) payload.gatheringTime = gather.time;
			if (cerem) payload.ceremonyTime = cerem.time;
			if (dinner) payload.dinnerTime = dinner.time;
			if (end) payload.endTime = end.time;
		}

		// История: главы (title + text). Пустые главы отбрасываются.
		const chapters = parseJsonList<EditableChapter>(data.get('storyJson'), 8);
		if (chapters) {
			payload.story = {
				chapters: chapters
					.map((c) => ({
						title: clean(c?.title, 80),
						titleTt: clean(c?.titleTt, 80),
						text: clean(c?.text, 700),
						textTt: clean(c?.textTt, 700)
					}))
					.filter((c) => c.title || c.text || c.titleTt || c.textTt)
			};
		}

		// FAQ: пары вопрос-ответ.
		const faq = parseJsonList<EditableFaq>(data.get('faqJson'), 12);
		if (faq) {
			payload.faq = {
				items: faq
					.map((c) => ({
						q: clean(c?.q, 160),
						qTt: clean(c?.qTt, 160),
						a: clean(c?.a, 600),
						aTt: clean(c?.aTt, 600)
					}))
					.filter((c) => c.q || c.a || c.qTt || c.aTt)
			};
		}

		// Меню: курсы + строка бара.
		const courses = parseJsonList<EditableCourse>(data.get('menuJson'), 8);
		if (courses) {
			payload.menu = {
				courses: courses
					.map((c) => ({
						label: clean(c?.label, 40),
						labelTt: clean(c?.labelTt, 40),
						title: clean(c?.title, 80),
						titleTt: clean(c?.titleTt, 80),
						text: clean(c?.text, 400),
						textTt: clean(c?.textTt, 400)
					}))
					.filter((c) => c.label || c.title || c.text || c.labelTt || c.titleTt || c.textTt),
				bar: field('menuBar', 400),
				barTt: field('menuBarTt', 400)
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
	},

	uploadCouplePhoto: async (event) => {
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
		await kv.put('media:couple', buf, {
			metadata: { type: file.type },
			httpMetadata: { contentType: file.type }
		});

		return { photoSuccess: true };
	},

	removeCouplePhoto: async (event) => {
		const kv = event.platform?.env?.IMAGES;
		if (!kv) {
			return fail(500, { photoError: 'KV-хранилище недоступно' });
		}
		await kv.delete('media:couple');
		return { photoRemoved: true };
	}
};
