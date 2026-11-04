import { t, type Localized } from './i18n.svelte';

export type NavItem = {
	label: Localized;
	href: string;
};

export type Table = {
	id: number;
	name: Localized;
	x: number;
	y: number;
	capacity: number;
	guests: string[];
};

export type TimelineItem = {
	time: string;
	title: Localized;
	text: Localized;
};

export type StoryChapter = {
	numeral: string;
	title: Localized;
	text: Localized;
	tone: 'sage' | 'sand' | 'pine' | 'paper';
};

export type PaleteColor = {
	name: Localized;
	hex: string;
};

export const content = {
	wedding: {
		dateISO: '2026-12-17T14:00:00+05:00',
		dateShort: '17.12.26',
		dateLong: t('17 декабря 2026', '2026 елның 17 декабре'),
		day: '17',
		month: t('декабря', 'декабрь'),
		year: '2026',
		weekday: t('четверг', 'пәнҗешәмбе'),
		city: t('Нефтекамск', 'Нефтекамск'),
		venue: t('Ресторан «Тантана»', '«Тантана» рестораны'),
		address: t(
			'Нефтекамск, Комсомольский проспект, 33А',
			'Нефтекамск, Комсомольский проспекты, 33А'
		),
		mapUrl:
			'https://yandex.ru/maps/?text=%D0%9D%D0%B5%D1%84%D1%82%D0%B5%D0%BA%D0%B0%D0%BC%D1%81%D0%BA%2C%20%D0%9A%D0%BE%D0%BC%D1%81%D0%BE%D0%BC%D0%BE%D0%BB%D1%8C%D1%81%D0%BA%D0%B8%D0%B9%20%D0%BF%D1%80%D0%BE%D1%81%D0%BF%D0%B5%D0%BA%D1%82%2C%2033%D0%90'
	},

	nav: [
		{ label: t('Приглашение', 'Чакыру'), href: '#invitation' },
		{ label: t('Детали', 'Мәгълүмат'), href: '#details' },
		{ label: t('Программа', 'Программа'), href: '#timeline' },
		{ label: t('Дресс-код', 'Кием коды'), href: '#dresscode' },
		{ label: t('Рассадка', 'Урыннар'), href: '#seating' }
	] satisfies NavItem[],

	countdown: {
		days: t('дней', 'көн'),
		hours: t('часов', 'сәгать'),
		minutes: t('минут', 'минут'),
		seconds: t('секунд', 'секунд')
	},

	hero: {
		eyebrow: t('Свадьба', 'Туй'),
		names: [t('Алина', 'Алинә'), t('Камиль', 'Камил')],
		ampersand: '&',
		date: t('17 декабря 2026', '2026 елның 17 декабре'),
		city: t('Нефтекамск', 'Нефтекамск'),
		note: t(
			'Приглашаем вас разделить с нами самый тёплый зимний день.',
			'Иң җылы кышкы көнебезне безнең белән бүлешергә чакырабыз.'
		),
		cta: t('Детали свадьбы', 'Туй мәгълүматы'),
		scroll: t('Листайте вниз', 'Түбәнгә төшегез'),
		photoCaption: t('Фото пары', 'Пар фотографиясе')
	},

	invitation: {
		eyebrow: t('Приглашение', 'Чакыру'),
		title: t('Дорогие друзья и близкие!', 'Хөрмәтле дуслар һәм якыннарыбыз!'),
		paragraphs: [
			t(
				'В этот зимний день мы хотим быть рядом с теми, кто делает нашу жизнь теплее. Будем счастливы разделить с вами радость нашей свадьбы.',
				'Бу кышкы көнне без гомеребезне җылырак иткән кешеләр белән бергә булдык телибез. Туебыз шатлыгын сезнең белән бүлешергә бик шат булырбыз.'
			),
			t(
				'Пусть этот вечер станет тёплым воспоминанием для каждого из нас. Ждём вас 17 декабря в Нефтекамске.',
				'Бу кич һәрберебез өчен җылы истәлек булып калсын. Сезне 17 декабрьдә Нефтекамскида көтәбез.'
			)
		],
		signature: t('С любовью, Алина и Камиль', 'Мәхәббәт белән, Алинә һәм Камил'),
		note: t('17 декабря 2026 · Нефтекамск', '2026 елның 17 декабре · Нефтекамск')
	},

	story: {
		eyebrow: t('Наша история', 'Безнең тарих'),
		title: t('Как всё началось', 'Барысы ничек башланды'),
		intro: t(
			'Несколько моментов, которые привели нас к этому дню.',
			'Безне бу көнгә алып килгән берничә мизгел.'
		),
		// Главы добавляются в админке (Тексты → Наша история).
		// Пока глав нет — секция целиком скрыта с сайта.
		chapters: [] as StoryChapter[]
	},

	details: {
		eyebrow: t('Детали', 'Мәгълүмат'),
		title: t('17 декабря 2026', '2026 елның 17 декабре'),
		weekday: t('четверг', 'пәнҗешәмбе'),
		time: '14:00',
		venue: t('Ресторан «Тантана»', '«Тантана» рестораны'),
		address: t(
			'Нефтекамск, Комсомольский проспект, 33А',
			'Нефтекамск, Комсомольский проспекты, 33А'
		),
		note: t(
			'Сбор гостей в 14:00. Мы будем ждать вас.',
			'Кунаклар 14:00да җыела. Сезне көтәбез.'
		),
		mapLabel: t('Открыть в Яндекс.Картах', 'Яндекс.Карталарда ачу'),
		calendarAdd: t('Добавить в календарь', 'Календарьга өстәргә'),
		schedule: [
			{ label: t('Сбор гостей', 'Кунаклар җыенуы'), value: '14:00' },
			{ label: t('Церемония регистрации', 'Тантаналы теркәү'), value: '14:20' },
			{ label: t('Начало банкета', 'Банкет башлануы'), value: '18:00' },
			{ label: t('Завершение вечера', 'Кич тәмамлануы'), value: '00:00' }
		]
	},

	timeline: {
		eyebrow: t('Программа', 'Программа'),
		title: t('Как пройдёт вечер', 'Кич ничек узачак'),
		intro: t(
			'Мы подготовили несколько моментов, которые хотим пережить вместе с вами.',
			'Сезнең белән бергә кичерәсе берничә мизгел әзерләдек.'
		),
		items: [
			{
				time: '14:00',
				title: t('Сбор гостей', 'Кунаклар җыенуы'),
				text: t(
					'Добро пожаловать! Время познакомиться и настроиться на праздник.',
					'Рәхим итегез! Танышырга һәм бәйрәмгә көйләнергә вакыт.'
				)
			},
			{
				time: '14:20',
				title: t('Церемония регистрации', 'Тантаналы теркәү'),
				text: t(
					'Самый волнительный момент вечера.',
					'Кичнең иң дулкынландыргыч мизгеле.'
				)
			},
			{
				time: '18:00',
				title: t('Начало банкета', 'Банкет башлануы'),
				text: t(
					'Время за большим столом, тёплых слов и тостов.',
					'Зур өстәл артында җылы сүзләр һәм тостлар вакыты.'
				)
			},
			{
				time: '00:00',
				title: t('Завершение вечера', 'Кич тәмамлануы'),
				text: t(
					'Спасибо, что разделили с нами этот день.',
					'Бу көнне безнең белән бүлешкәнегез өчен рәхмәт.'
				)
			}
		] satisfies TimelineItem[]
	},

	dressCode: {
		eyebrow: t('Дресс-код', 'Кием коды'),
		title: t('Спокойные природные оттенки', 'Тыныч тәбигать тондары'),
		text: t(
			'Для нас самое главное — ваше присутствие! Но мы будем очень признательны, если вы поддержите цветовую гамму спокойных природных оттенков.',
			'Безнең өчен иң мөһиме — сезнең катнашуыгыз! Ләкин тыныч тәбигать төсләрендә булсагыз, бик рәхмәтле булырбыз.'
		),
		note: t('', ''),
		palette: [
			{ name: t('Шоколад', 'Шоколад'), hex: '#5b3a34' },
			{ name: t('Кэмел', 'Кэмел'), hex: '#a67b5b' },
			{ name: t('Бежевый', 'Беж'), hex: '#c7b9a5' },
			{ name: t('Шалфей', 'Шалфей'), hex: '#9caf88' },
			{ name: t('Пыльная роза', 'Пыль алсу'), hex: '#f2d5d5' },
			{ name: t('Лимонный', 'Лимон'), hex: '#f6f1c9' }
		] satisfies PaleteColor[]
	},

	menu: {
		eyebrow: t('Меню', 'Меню'),
		title: t('Вкусы вечера', 'Кич тәмнәре'),
		intro: t(
			'Мы выбрали меню, которое, надеемся, понравится каждому. О своих предпочтениях и аллергиях можно написать в ответе.',
			'Һәркемгә ошаар дип өметләнгән меню сайладык. Үз теләкләрегез һәм аллергияләрегез турында җавапта языгыз.'
		),
		courses: [
			{
				label: t('Приветствие', 'Каршы алу'),
				title: t('Лёгкие закуски', 'Җиңел ризыклар'),
				text: t(
					'Небольшие закуски и напитки для начала вечера.',
					'Кич башында кечкенә ризыклар һәм эчемлекләр.'
				)
			},
			{
				label: t('Основное', 'Төп ризык'),
				title: t('Тёплое блюдо', 'Җылы ризык'),
				text: t(
					'Главное блюдо, которое согреет зимним вечером.',
					'Кышкы кичтә җылытырлык төп ризык.'
				)
			},
			{
				label: t('Десерт', 'Десерт'),
				title: t('Свадебный торт', 'Туй торты'),
				text: t('Сладкий финал и немного волшебства.', 'Татлы финал һәм бераз могҗиза.')
			}
		],
		bar: t(
			'В баре будут вино, шампанское, крепкие напитки и безалкогольные альтернативы. Свой выбор отметьте в форме.',
			'Барда шәраб, шампан, көчле эчемлекләр һәм алкогольсез альтернативалар булачак. Сайлаганнарыгызны формада билгеләгез.'
		)
	},

	seating: {
		eyebrow: t('Рассадка', 'Урыннар'),
		title: t('Найдите свой стол', 'Үз өстәлегезне табыгыз'),
		intro: t(
			'Мы постарались посадить рядом тех, с кем вам будет тепло и о чём поговорить.',
			'Сезгә җылы һәм сөйләшерлек кешеләрне янәшә утыртырга тырыштык.'
		),
		searchPlaceholder: t('Введите имя', 'Исемегезне языгыз'),
		searchHint: t('Начните вводить имя', 'Исемне язып башлагыз'),
		notFound: t(
			'Не нашли себя? Напишите нам — всё исправим.',
			'Үзегезне тапмадыгыз? Безгә языгыз — барысын да төзәтербез.'
		),
		yourTable: t('Ваш стол', 'Сезнең өстәлегез'),
		tableLabel: t('Стол', 'Өстәл'),
		guestsLabel: t('гостей', 'кунак'),
		coupleTable: t('Молодожёны', 'Кияү һәм кәләш'),
		danceFloor: t('Танцпол', 'Бию мәйданчыгы'),
		entrance: t('Вход', 'Керү'),
		stage: t('Сцена', 'Сәхнә'),
		empty: t('Пока никого нет', 'Әлегә беркем дә юк'),
		comingSoon: t('Рассадка уточняется молодожёнами и появится здесь ближе ко дню свадьбы', 'Урыннар яшьләр тарафыннан ачыклана һәм туй көненә якынрак монда булачак'),
		tables: [
			{ id: 1, name: t('Стол 1', 'Өстәл 1'), x: 18, y: 22, capacity: 8, guests: [] },
			{ id: 2, name: t('Стол 2', 'Өстәл 2'), x: 82, y: 22, capacity: 8, guests: [] },
			{ id: 3, name: t('Стол 3', 'Өстәл 3'), x: 10, y: 52, capacity: 8, guests: [] },
			{ id: 4, name: t('Стол 4', 'Өстәл 4'), x: 90, y: 52, capacity: 8, guests: [] },
			{ id: 5, name: t('Стол 5', 'Өстәл 5'), x: 22, y: 82, capacity: 8, guests: [] },
			{ id: 6, name: t('Стол 6', 'Өстәл 6'), x: 50, y: 90, capacity: 8, guests: [] },
			{ id: 7, name: t('Стол 7', 'Өстәл 7'), x: 78, y: 82, capacity: 8, guests: [] }
		] satisfies Table[]
	},

	rsvp: {
		eyebrow: t('Ответ', 'Җавап'),
		title: t('Будете с нами?', 'Безнең белән буласызмы?'),
		intro: t(
			'Каждому гостю мы отправили личную ссылку. Потеряли её? Введите ваше имя — и мы найдём ваше приглашение.',
			'Һәр кунакка шәхси сылтама җибәрдек. Сылтама югалсаму? Исемегезне языгыз — без чакыруыгызны табарбыз.'
		),
		note: t(
			'Если ссылка потерялась — напишите нам, мы отправим новую.',
			'Ссылтама югалса — безгә языгыз, яңасын җибәрербез.'
		),
		button: t('Найти своё приглашение', 'Чакыруымны табу'),
		find: {
			title: t('Найдите своё приглашение', 'Чакыруыгызны табыгыз'),
			intro: t(
				'Введите ваше имя точно так, как оно указано в приглашении, — и мы его откроем.',
				'Исемегезне чакыруда язылганча языгыз — без аны ачарбыз.'
			),
			placeholder: t('Ваше имя и фамилия', 'Исемегез һәм фамилиягез'),
			notFound: t(
				'Не нашли приглашение с таким именем? Проверьте написание или напишите нам — отправим личную ссылку.',
				'Чакыру табылмадымы? Язуны тикшерегез яки безгә языгыз — шәхси сылтама җибәрербез.'
			),
			ambiguous: t(
				'Гостей с таким именем несколько. Напишите нам — и мы отправим вам персональную ссылку.',
				'Бу исемле берничә кунак бар. Безгә языгыз — шәхси сылтама җибәрербез.'
			)
		},
		contactsLabel: t('По вопросам', 'Сораулар буенча')
	},

	faq: {
		eyebrow: t('Вопросы', 'Сораулар'),
		title: t('Всё, что важно знать', 'Белергә кирәкле бар нәрсә'),
		items: [
			{
				q: t('Можно ли прийти с детьми?', 'Балалар белән килергә мөмкинме?'),
				a: t(
					'Конечно! Напишите, пожалуйста, в ответе, сколько детей будет с вами, и мы подготовим места.',
					'Әлбәттә! Җавапта ничә бала булачагын языгыз, без урыннар әзерләрбез.'
				)
			},
			{
				q: t('Что подарить?', 'Нәрсә бүләк итәргә?'),
				a: t(
					'Ваше присутствие — уже большой подарок. Если захотите, мы будем благодарны за вклад в наше свадебное путешествие.',
					'Сезнең катнашуыгыз ук зур бүләк. Теләсәгез, туй сәяхәтебезгә кертем өчен рәхмәтле булырбыз.'
				)
			},
			{
				q: t('Как добраться?', 'Ничек барырга?'),
				a: t(
					'Ресторан находится в центре Нефтекамска. Рядом есть парковка. Если нужен трансфер, отметьте это в форме.',
					'Ресторан Нефтекамск үзәгендә. Янында парковка бар. Трансфер кирәк булса, формада билгеләгез.'
				)
			},
			{
				q: t('Можно ли фотографировать?', 'Фотога төшерергә мөмкинме?'),
				a: t(
					'Да, конечно. Только во время церемонии дайте, пожалуйста, поработать нашему фотографу.',
					'Әйе, әлбәттә. Тантана вакытында гына фотографыбызга эшләргә мөмкинлек бирегез.'
				)
			},
			{
				q: t('Во сколько всё закончится?', 'Барысы да сәгать ничәдә тәмамланачак?'),
				a: t(
					'Ориентировочно в 23:00. Но мы не будем против, если вы останетесь чуть дольше.',
					'Якынча 23:00дә. Ләкин бераз озаграк калсагыз, каршы түгелбез.'
				)
			}
		]
	},

	footer: {
		names: t('Алина и Камиль', 'Алинә һәм Камил'),
		date: t('17 декабря 2026', '2026 елның 17 декабре'),
		place: t('Нефтекамск · «Тантана»', 'Нефтекамск · «Тантана»'),
		note: t('С любовью', 'Мәхәббәт белән'),
		top: t('Наверх', 'Өскә')
	}
};

export const ui = {
	langRu: 'РУС',
	langTt: 'ТАТ',
	menu: t('Меню', 'Меню'),
	close: t('Закрыть', 'Ябу'),
	next: t('Далее', 'Алга'),
	back: t('Назад', 'Артка'),
	rsvp: t('Ответить', 'Җавап бирү'),
	details: t('Подробнее', 'Тулырак'),
	all: t('Все', 'Барысы'),
	invite: {
		for: t('Приглашение для', 'Чакыру'),
		yourTable: t('Ваш стол', 'Сезнең өстәлегез'),
		seatNote: t('Номер стола может измениться — мы сообщим при рассадке.', 'Өстәл номеры үзгәрергә мөмкин — утыртканда әйтербез.'),
		program: t('Программа дня', 'Көннән программа'),
		viewDetails: t('Открыть полную страницу свадьбы', 'Туй битен тулысынча ачу'),
		notFoundTitle: t('Приглашение не найдено', 'Чакыру табылмады'),
		notFoundText: t(
			'Проверьте ссылку ещё раз или напишите нам — мы отправим новую.',
			'Сылтаманы тагын бер тикшерегез яки безгә языгыз — яңасын җибәрербез.'
		),
		backHome: t('Вернуться на сайт', 'Сайтка кайту')
	}
};

/**
 * Переопределение текстов из админки (D1 → site_content 'site').
 * Мутирует общий объект content — и SSR, и гидрация увидят актуальные значения.
 */
export function applyContentOverride(ov: Record<string, unknown> | null | undefined): void {
	if (!ov) return;
	const str = (key: string): string => {
		const v = ov[key];
		return typeof v === 'string' && v.trim() ? v.trim() : '';
	};
	const loc = (key: string): Localized | null => {
		const s = str(key);
		return s ? t(s) : null;
	};

	const venue = loc('venue');
	const address = loc('address');
	const city = loc('city');
	const dateLong = loc('dateLong');
	const mapUrl = str('mapUrl');

	if (venue) {
		content.wedding.venue = venue;
		content.details.venue = venue;
	}
	if (address) {
		content.wedding.address = address;
		content.details.address = address;
	}
	if (city) content.wedding.city = city;
	if (dateLong) {
		content.wedding.dateLong = dateLong;
		content.hero.date = dateLong;
	}
	if (mapUrl) content.wedding.mapUrl = mapUrl;

	// Сбор гостей и расписание программы
	const gatheringVal = ov['gatheringTime'] !== undefined ? str('gatheringTime') : '14:00';
	const ceremonyVal = str('ceremonyTime') || '14:20';
	const dinnerVal = str('dinnerTime') || '18:00';
	const endVal = str('endTime') || '00:00';

	const newSchedule: { label: Localized; value: string }[] = [];
	const newTimeline: TimelineItem[] = [];

	if (gatheringVal) {
		newSchedule.push({ label: t('Сбор гостей', 'Кунаклар җыенуы'), value: gatheringVal });
		newTimeline.push({
			time: gatheringVal,
			title: t('Сбор гостей', 'Кунаклар җыенуы'),
			text: t(
				'Добро пожаловать! Время познакомиться и настроиться на праздник.',
				'Рәхим итегез! Танышырга һәм бәйрәмгә көйләнергә вакыт.'
			)
		});
		content.details.time = gatheringVal;
		content.details.note = t(
			`Сбор гостей в ${gatheringVal}. Мы будем ждать вас.`,
			`Кунаклар ${gatheringVal}да җыела. Сезне көтәбез.`
		);
	} else {
		// Сбор гостей убран пользователем
		content.details.time = ceremonyVal;
		content.details.note = t(
			`Начало церемонии в ${ceremonyVal}. Мы будем ждать вас.`,
			`Тантана башлануы ${ceremonyVal}да. Сезне көтәбез.`
		);
	}

	newSchedule.push({ label: t('Церемония регистрации', 'Тантаналы теркәү'), value: ceremonyVal });
	newTimeline.push({
		time: ceremonyVal,
		title: t('Церемония регистрации', 'Тантаналы теркәү'),
		text: t('Самый волнительный момент вечера.', 'Кичнең иң дулкынландыргыч мизгеле.')
	});

	newSchedule.push({ label: t('Начало банкета', 'Банкет башлануы'), value: dinnerVal });
	newTimeline.push({
		time: dinnerVal,
		title: t('Начало банкета', 'Банкет башлануы'),
		text: t('Время за большим столом, тёплых слов и тостов.', 'Зур өстәл артында җылы сүзләр һәм тостлар вакыты.')
	});

	newSchedule.push({ label: t('Завершение вечера', 'Кич тәмамлануы'), value: endVal });
	newTimeline.push({
		time: endVal,
		title: t('Завершение вечера', 'Кич тәмамлануы'),
		text: t('Спасибо, что разделили с нами этот день.', 'Бу көнне безнең белән бүлешкәнегез өчен рәхмәт.')
	});

	content.details.schedule = newSchedule;
	content.timeline.items = newTimeline;

	const invitationTitle = loc('invitationTitle');
	const invitationSignature = loc('invitationSignature');
	const invitationText = str('invitationText');
	if (invitationTitle) content.invitation.title = invitationTitle;
	if (invitationSignature) content.invitation.signature = invitationSignature;
	if (invitationText) {
		content.invitation.paragraphs = invitationText
			.split(/\n\s*\n/)
			.map((p) => p.trim())
			.filter(Boolean)
			.map((p) => t(p));
	}

	const dressTitle = loc('dressCodeTitle');
	const dressText = loc('dressCodeText');
	const dressNote = loc('dressCodeNote');
	if (dressTitle) content.dressCode.title = dressTitle;
	if (dressText) content.dressCode.text = dressText;
	if (dressNote) content.dressCode.note = dressNote;

	const story = ov['story'] as { chapters?: { title?: unknown; text?: unknown }[] } | undefined;
	if (story && Array.isArray(story.chapters)) {
		const tones = ['sage', 'sand', 'pine', 'paper'] as const;
		const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
		const list = story.chapters
			.map((c) => ({
				title: typeof c?.title === 'string' ? c.title.trim() : '',
				text: typeof c?.text === 'string' ? c.text.trim() : ''
			}))
			.filter((c) => c.title || c.text)
			.slice(0, 8);
		content.story.chapters = list.map((c, i) => ({
			numeral: romans[i] ?? String(i + 1),
			title: t(c.title),
			text: t(c.text),
			tone: tones[i % tones.length]
		}));
	}

	const faq = ov['faq'] as { items?: { q?: unknown; a?: unknown }[] } | undefined;
	if (faq && Array.isArray(faq.items)) {
		const list = faq.items
			.map((item) => ({
				q: typeof item?.q === 'string' ? item.q.trim() : '',
				a: typeof item?.a === 'string' ? item.a.trim() : ''
			}))
			.filter((item) => item.q && item.a)
			.slice(0, 16);
		if (list.length > 0) {
			content.faq.items = list.map((item) => ({
				q: t(item.q),
				a: t(item.a)
			}));
		}
	}

	const menu = ov['menu'] as { courses?: { label?: unknown; title?: unknown; text?: unknown }[]; bar?: unknown } | undefined;
	if (menu) {
		if (Array.isArray(menu.courses)) {
			const courses = menu.courses
				.map((c) => ({
					label: typeof c?.label === 'string' ? c.label.trim() : '',
					title: typeof c?.title === 'string' ? c.title.trim() : '',
					text: typeof c?.text === 'string' ? c.text.trim() : ''
				}))
				.filter((c) => c.title)
				.slice(0, 8);
			if (courses.length > 0) {
				content.menu.courses = courses.map((c) => ({
					label: t(c.label),
					title: t(c.title),
					text: t(c.text)
				}));
			}
		}
		if (typeof menu.bar === 'string' && menu.bar.trim()) {
			content.menu.bar = t(menu.bar.trim());
		}
	}
}
