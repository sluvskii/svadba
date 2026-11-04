import { t, type Localized } from './i18n.svelte';

export type DrinkOption = {
	id: string;
	label: Localized;
	alcohol: boolean;
};

export type EditableDrink = {
	id: string;
	labelRu: string;
	labelTt?: string;
	alcohol: boolean;
};

export type Attendance = 'yes' | 'no';

export type GuestResponse = {
	attendance: Attendance;
	plusOneName: string;
	children: string;
	drinks: string[];
	food: string;
	transfer?: boolean;
	song: string;
	comment: string;
	submittedAt: string;
};

export type Guest = {
	token: string;
	/** Name as it appears on the invitation. */
	name: string;
	/** Optional Tatar spelling; falls back to `name`. */
	nameTt?: string;
	side: 'bride' | 'groom' | 'both';
	note: Localized;
	/** Table number once seating is final. */
	table: number | string | null;
	plusOneAllowed: boolean;
	/** Pre-filled companion name, if the couple assigned one. */
	plusOneName: string | null;
	/** Whether children may be brought along. */
	childrenAllowed: boolean;
	response: GuestResponse | null;
};

export const rsvpForm = {
	name: t('Ваше имя и фамилия', 'Исемегез һәм фамилиягез'),
	namePlaceholder: t('Например: Бабушка Рамиля или Ильдар Хакимов', 'Мисал өчен: Рәмилә әби яки Илдар Хәкимов'),
	nameHint: t(
		'Укажите так, как вам привычнее — мы обязательно узнаем вас!',
		'Үзегезгә ничек уңайлы, шулай языгыз — без сезне һичшиксез танырбыз!'
	),
	attendance: t('Вы придёте?', 'Сез киләсезме?'),
	yes: t('Да, буду', 'Әйе, киләм'),
	yesHint: t('С радостью разделю этот день', 'Бу көнне шатлык белән бүлешәм'),
	no: t('К сожалению, не смогу', 'Кызганычка каршы, килә алмыйм'),
	noHint: t('Но мы всё равно вас обнимаем', 'Ләкин без барыбер сезне кочаклыйбыз'),
	plusOne: t('Приду с парой', 'Пар белән киләм'),
	plusOneName: t('Имя второго гостя (спутника)', 'Икенче кунакның (юлдашыгызның) исеме'),
	plusOnePlaceholder: t('Кто будет с вами', 'Сезнең белән кем булачак'),
	children: t('Дети', 'Балалар'),
	childrenHint: t('Имена и возраст', 'Исемнәре һәм яшьләре'),
	childrenPlaceholder: t('Например: Амир, 5 лет', 'Мәсәлән: Әмир, 5 яшь'),
	drinks: t('Что предпочитаете пить?', 'Нәрсә эчәргә яратасыз?'),
	drinksHint: t('Можно выбрать несколько', 'Берничәсен сайларга мөмкин'),
	drinksNone: t('Не пью алкоголь', 'Алкоголь эчмим'),
	food: t('Особое питание', 'Аерым туклану'),
	foodPlaceholder: t(
		'Аллергии, халяль, вегетарианское меню...',
		'Аллергияләр, хәләл, вегетариан меню...'
	),
	song: t('Песня, под которую вы точно выйдете танцевать', 'Сез билгеле бии торган җыр'),
	songPlaceholder: t('Название или исполнитель', 'Исеме яки башкаручы'),
	comment: t('Пожелание или вопрос', 'Теләк яки сорау'),
	commentPlaceholder: t('Всё, что хотите нам сказать', 'Безгә әйтергә теләгән бар нәрсә'),
	submit: t('Отправить ответ', 'Җавап җибәрергә'),
	submitting: t('Отправляем...', 'Җибәрәбез...'),
	error: t('Проверьте, пожалуйста, выделенные поля.', 'Зинһар, билгеләнгән кырларны тикшерегез.'),
	successTitle: t('Спасибо!', 'Рәхмәт!'),
	successText: t(
		'Мы получили ваш ответ. Будем счастливы видеть вас 17 декабря.',
		'Җавабыгызны алдык. Сезне 17 декабрьдә күрергә бик шат булырбыз.'
	),
	successNo: t(
		'Спасибо, что сообщили. Мы будем вас обнимать на расстоянии.',
		'Хәбәр иткәнегез өчен рәхмәт. Сезне ерактан кочаклыйбыз.'
	),
	detailsKicker: t('ПЕРСОНАЛЬНОЕ ПРИГЛАШЕНИЕ', 'ШӘХСИ ЧАКЫРУ'),
	detailsDesc: t(
		'Ваше персональное приглашение готово. Там можно посмотреть ваш стол и расписание.',
		'Сезнең шәхси чакыруыгыз әзер. Анда өстәлегезне һәм программаны карый аласыз.'
	),
	detailsLink: t('Перейти к приглашению', 'Чакыруга күчү'),
	homeBtn: t('На главную', 'Баш биткә'),
	edit: t('Изменить ответ', 'Җавапны үзгәртергә'),
	privacy: t(
		'Этот ответ увидите только вы и молодожёны.',
		'Бу җавапны сез генә һәм кияү белән кәләш күрәчәк.'
	),
	attendanceRequired: t('Пожалуйста, выберите один из вариантов.', 'Зинһар, вариантларның берсен сайлагыз.'),
	nameRequired: t('Напишите, пожалуйста, ваше имя.', 'Зинһар, исемегезне языгыз.')
};

export const defaultDrinkOptions: DrinkOption[] = [
	{ id: 'red-wine', label: t('Красное вино', 'Кызыл шәраб'), alcohol: true },
	{ id: 'white-wine', label: t('Белое вино', 'Ак шәраб'), alcohol: true },
	{ id: 'champagne', label: t('Шампанское', 'Шампан'), alcohol: true },
	{ id: 'vodka', label: t('Водка', 'Водка'), alcohol: true },
	{ id: 'soft', label: t('Безалкогольные напитки', 'Алкогольсез эчемлекләр'), alcohol: false },
	{ id: 'none', label: t('Не пью алкоголь', 'Алкоголь эчмим'), alcohol: false }
];

export const defaultEditableDrinks: EditableDrink[] = [
	{ id: 'red-wine', labelRu: 'Красное вино', labelTt: 'Кызыл шәраб', alcohol: true },
	{ id: 'white-wine', labelRu: 'Белое вино', labelTt: 'Ак шәраб', alcohol: true },
	{ id: 'champagne', labelRu: 'Шампанское', labelTt: 'Шампан', alcohol: true },
	{ id: 'vodka', labelRu: 'Водка', labelTt: 'Водка', alcohol: true },
	{ id: 'soft', labelRu: 'Безалкогольные напитки', labelTt: 'Алкогольсез эчемлекләр', alcohol: false },
	{ id: 'none', labelRu: 'Не пью алкоголь', labelTt: 'Алкоголь эчмим', alcohol: false }
];

export function parseDrinkOptions(raw: unknown): DrinkOption[] {
	if (!Array.isArray(raw) || raw.length === 0) {
		return defaultDrinkOptions;
	}
	const list: DrinkOption[] = [];
	for (let i = 0; i < raw.length; i++) {
		const item = raw[i];
		if (!item || typeof item !== 'object') continue;
		const d = item as Record<string, unknown>;
		const labelRu = String(d.labelRu ?? d.name ?? '').trim();
		if (!labelRu) continue;
		const labelTt = String(d.labelTt ?? '').trim() || labelRu;
		const rawId = String(d.id ?? '').trim();
		const id = rawId || `drink-${i + 1}`;
		const alcohol = Boolean(d.alcohol);
		list.push({
			id,
			label: t(labelRu, labelTt),
			alcohol
		});
	}
	return list.length > 0 ? list : defaultDrinkOptions;
}

export function parseEditableDrinks(raw: unknown): EditableDrink[] {
	if (!Array.isArray(raw) || raw.length === 0) {
		return defaultEditableDrinks;
	}
	const list: EditableDrink[] = [];
	for (let i = 0; i < raw.length; i++) {
		const item = raw[i];
		if (!item || typeof item !== 'object') continue;
		const d = item as Record<string, unknown>;
		const labelRu = String(d.labelRu ?? d.name ?? '').trim();
		if (!labelRu) continue;
		const labelTt = String(d.labelTt ?? '').trim();
		const rawId = String(d.id ?? '').trim();
		const id = rawId || `drink-${i + 1}`;
		const alcohol = Boolean(d.alcohol);
		list.push({ id, labelRu, labelTt, alcohol });
	}
	return list.length > 0 ? list : defaultEditableDrinks;
}

export const drinkOptions: DrinkOption[] = defaultDrinkOptions;
