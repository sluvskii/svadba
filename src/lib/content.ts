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
	icon?: string;
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
		kicker: t('До свадьбы осталось', 'Туйга кадәр калды'),
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
		photoCaption: t('Фото пары', 'Пар фотографиясе'),
		photoAlt: t('Алина и Камиль', 'Алинә һәм Камил')
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
		venueEyebrow: t('Место торжества', 'Тантана урыны'),
		title: t('17 декабря 2026', '2026 елның 17 декабре'),
		weekday: t('четверг', 'пәнҗешәмбе'),
		time: '14:00',
		venue: t('Ресторан «Тантана»', '«Тантана» рестораны'),
		address: t(
			'Нефтекамск, Комсомольский проспект, 33А',
			'Нефтекамск, Комсомольский проспекты, 33А'
		),
		note: t(
			'Сбор гостей в 14:00 — приходите чуть заранее, мы всё подготовим.',
			'Кунаклар 14:00дә җыела — бераз алдан килегез, без барысын да әзерләп куябыз.'
		),
		mapLabel: t('Открыть в Яндекс.Картах', 'Яндекс.Карталарда ачу'),
		calendarGoogle: t('Добавить в Google Календарь', 'Google календаренә өстәргә'),
		calendarIcs: t('Добавить в календарь (файл .ics)', 'Календарьгa (.ics файл) өстәргә'),
		calendarTitle: t('Свадьба Алины и Камиля', 'Алинә һәм Камил туе')
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
				),
				icon: 'gathering'
			},
			{
				time: '14:20',
				title: t('Церемония регистрации', 'Тантаналы теркәү'),
				text: t(
					'Самый волнительный момент вечера.',
					'Кичнең иң дулкынландыргыч мизгеле.'
				),
				icon: 'ceremony'
			},
			{
				time: '18:00',
				title: t('Начало банкета', 'Банкет башлануы'),
				text: t(
					'Время за большим столом, тёплых слов и тостов.',
					'Зур өстәл артында җылы сүзләр һәм тостлар вакыты.'
				),
				icon: 'banquet'
			},
			{
				time: '00:00',
				title: t('Завершение вечера', 'Кич тәмамлануы'),
				text: t(
					'Спасибо, что разделили с нами этот день.',
					'Бу көнне безнең белән бүлешкәнегез өчен рәхмәт.'
				),
				icon: 'night'
			}
		] as TimelineItem[]
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
		found: t('Найдено', 'Табылды'),
		clear: t('Очистить', 'Чистартырга'),
		planLabel: t('Схема зала', 'Зал схемасы'),
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
			'Пожалуйста, подтвердите ваше присутствие до 1 декабря 2026 года, чтобы мы могли подготовиться к вашему приходу.',
			'Зинһар, 2026 елның 1 декабренә кадәр килүегезне раслагыз.'
		),
		button: t('Подтвердить присутствие', 'Җавап бирергә'),
		contactsLabel: t('По вопросам', 'Сораулар буенча'),
		openForm: {
			kicker: t('ПОДТВЕРЖДЕНИЕ ПРИСУТСТВИЯ', 'КИЛҮЕГЕЗНЕ РАСЛАУ'),
			title: t('Будете с нами?', 'Безнең белән булырсызмы?'),
			intro: t(
				'Пожалуйста, подтвердите присутствие до 1 декабря 2026 года, чтобы мы могли позаботиться о вашем комфорте.',
				'Зинһар, килүегезне 2026 елның 1 декабренә кадәр раслагыз, без сезнең өчен барысын да уңайлы итәргә телибез.'
			),
			nameLabel: t('Ваше имя и фамилия', 'Исемегез һәм фамилиягез'),
			namePlaceholder: t('Например: Бабушка Рамиля или Ильдар Хакимов', 'Мисал өчен: Рәмилә әби яки Илдар Хәкимов'),
			nameHint: t(
				'Укажите так, как вам привычнее — мы обязательно узнаем вас!',
				'Үзегезгә ничек уңайлы, шулай языгыз — без сезне һичшиксез танырбыз!'
			),
			attendanceLabel: t('Сможете присутствовать?', 'Катнаша алырсызмы?'),
			yesTitle: t('Да, с радостью приду', 'Әйе, бик шатланып киләм'),
			yesDesc: t('Разделю с вами этот особенный день', 'Бу истәлекле көнне сезнең белән бергә үткәрәм'),
			noTitle: t('К сожалению, не смогу', 'Кызганычка каршы, килә алмыйм'),
			noDesc: t('Буду мысленно рядом с вами', 'Уем белән сезнең янда булырмын'),
			commentLabel: t('Пожелание молодожёнам', 'Яшьләргә теләкләр'),
			commentOpt: t('(по желанию)', '(теләк буенча)'),
			commentPlaceholder: t(
				'Пара тёплых слов или важная деталь для нас...',
				'Безнең өчен берничә җылы сүз яки мөһим теләк...'
			),
			errorName: t('Пожалуйста, введите ваше имя и фамилию', 'Зинһар, исемегезне һәм фамилиягезне кертегез'),
			errorAttendance: t('Пожалуйста, выберите: сможете ли вы присутствовать', 'Зинһар, катнаша алырсызмы-юкмы икәнен сайлагыз'),
			submit: t('Отправить ответ', 'Җавапны җибәрү'),
			submitting: t('Отправляем...', 'Җибәрелә...'),
			questionsFoot: t(
				'Если у вас есть вопросы, вы всегда можете позвонить или написать молодожёнам напрямую.',
				'Сорауларыгыз булса, сез һәрвакыт турыдан-туры яшьләргә шалтырата яки яза аласыз.'
			),
			successKicker: t('ОТВЕТ СОХРАНЁН', 'ҖАВАП САКЛАНДЫ'),
			successTitle: t('Спасибо', 'Рәхмәт'),
			successYes: t(
				'Мы очень рады и будем с нетерпением ждать вас на празднике 17 декабря!',
				'Без бик шатбыз һәм сезне 17 декабрьдә бәйрәмебездә түземсезлек белән көтәбез!'
			),
			successNo: t(
				'Спасибо, что сообщили нам. Нам будет вас не хватать, но мы чувствуем вашу любовь и тепло!',
				'Хәбәр итүегез өчен рәхмәт. Сезне бик сагынырбыз, ләкин сезнең мәхәббәтегезне һәм җылыгызны тоябыз!'
			),
			detailsKicker: t('ДЛЯ ДЕТАЛЕЙ', 'ТУЛЫРАК МӘГЪЛҮМАТ'),
			detailsDesc: t(
				'Хотите уточнить предпочтения по напиткам или посмотреть ваш столик?',
				'Эчемлекләр буенча теләкләрегезне белдерергә яки өстәлегезне күрергә телисезме?'
			),
			detailsLink: t('Перейти к деталям приглашения →', 'Чакыру детальләренә күчү →'),
			homeBtn: t('На главную страницу', 'Баш биткә'),
			resetBtn: t('Отправить ещё один ответ', 'Тагын бер җавап җибәрү')
		}
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
					'Ресторан находится в центре Нефтекамска. Рядом есть парковка. Если нужен трансфер — напишите нам, всё организуем.',
					'Ресторан Нефтекамск үзәгендә. Янында парковка бар. Трансфер кирәк булса — безгә языгыз, оештырырбыз.'
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
					'Ориентировочно в 00:00. Но мы не будем против, если вы останетесь чуть дольше.',
					'Якынча түнлә 00:00дә. Ләкин бераз озаграк калсагыз, каршы түгелбез.'
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
	brandHome: t('Алина и Камиль — на главную', 'Алинә һәм Камил — баш биткә'),
	brandNames: t('Алина и Камиль', 'Алинә һәм Камил'),
	brandShort: t('Алина & Камиль', 'Алинә & Камил'),
	mainNav: t('Основная навигация', 'Төп навигация'),
	mobileNav: t('Мобильная навигация', 'Мобиль навигация'),
	langLabel: t('Язык сайта', 'Сайт теле'),
	table: t('Стол', 'Өстәл'),
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

/** Снимок исходных текстов до применения override — для татарского фолбэка. */
const contentDefaults = JSON.parse(JSON.stringify(content)) as typeof content;

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
	/** Локализованное значение из пары ключей `key` (русский) и `keyTt` (татарский). */
	const loc = (key: string, defaultLoc?: Localized, ttKey = `${key}Tt`): Localized | null => {
		const s = str(key);
		if (!s) return null;
		const tt = str(ttKey);
		if (tt) return t(s, tt);
		// Старое переопределение могло сохранить русский текст без татарского.
		// Если это исходный текст — возвращаем его готовый татарский перевод.
		if (defaultLoc && defaultLoc.ru === s && defaultLoc.tt) return t(s, defaultLoc.tt);
		return t(s);
	};

	const venue = loc('venue', contentDefaults.wedding.venue);
	const address = loc('address', contentDefaults.wedding.address);
	const city = loc('city', contentDefaults.wedding.city);
	const dateLong = loc('dateLong', contentDefaults.wedding.dateLong);
	const mapUrl = str('mapUrl');

	if (venue) {
		content.wedding.venue = venue;
		content.details.venue = venue;
	}
	if (address) {
		content.wedding.address = address;
		content.details.address = address;
	}
	if (city) {
		content.wedding.city = city;
		content.hero.city = city;
	}
	if (dateLong) {
		content.wedding.dateLong = dateLong;
		content.hero.date = dateLong;
		content.footer.date = dateLong;
	}
	if (venue) content.footer.place = t(`${str('city') || contentDefaults.wedding.city.ru} · ${venue.ru}`);
	if (mapUrl) content.wedding.mapUrl = mapUrl;

	// Расписание программы вечера (блок «Как пройдёт вечер»)
	const timelineRaw = ov?.timeline as {
		items?: Array<{
			time?: string;
			title?: string;
			titleTt?: string;
			text?: string;
			textTt?: string;
			icon?: string;
		}>;
	} | undefined;
	if (Array.isArray(timelineRaw?.items) && timelineRaw.items.length > 0) {
		const defaultItems = contentDefaults.timeline.items;
		content.timeline.items = timelineRaw.items.map((it) => {
			const title = String(it.title || '').trim();
			const text = String(it.text || '').trim();
			const defTitle = defaultItems.find((d) => d.title.ru === title);
			const defText = defaultItems.find((d) => d.text.ru === text);
			const titleTt =
				String(it.titleTt || '').trim() ||
				(defTitle?.title.tt && defTitle.title.ru === title ? defTitle.title.tt : '');
			const textTt =
				String(it.textTt || '').trim() ||
				(defText?.text.tt && defText.text.ru === text ? defText.text.tt : '');
			return {
				time: String(it.time || '').trim(),
				title: t(title || titleTt, titleTt || undefined),
				text: t(text || textTt, textTt || undefined),
				icon: it.icon ? String(it.icon).trim() : undefined
			};
		});
	} else {
		const gatheringVal = str('gatheringTime');
		const ceremonyVal = str('ceremonyTime') || '14:20';
		const dinnerVal = str('dinnerTime') || '18:00';
		const endVal = str('endTime') || '00:00';

		const newTimeline: TimelineItem[] = [];

		if (gatheringVal) {
			newTimeline.push({
				time: gatheringVal,
				title: t('Сбор гостей', 'Кунаклар җыенуы'),
				text: t(
					'Добро пожаловать! Время познакомиться и настроиться на праздник.',
					'Рәхим итегез! Танышырга һәм бәйрәмгә көйләнергә вакыт.'
				),
				icon: 'gathering'
			});
		}

		newTimeline.push({
			time: ceremonyVal,
			title: t('Церемония регистрации', 'Тантаналы теркәү'),
			text: t('Самый волнительный момент вечера.', 'Кичнең иң дулкынландыргыч мизгеле.'),
			icon: 'ceremony'
		});

		newTimeline.push({
			time: dinnerVal,
			title: t('Начало банкета', 'Банкет башлануы'),
			text: t('Время за большим столом, тёплых слов и тостов.', 'Зур өстәл артында җылы сүзләр һәм тостлар вакыты.'),
			icon: 'banquet'
		});

		newTimeline.push({
			time: endVal,
			title: t('Завершение вечера', 'Кич тәмамлануы'),
			text: t('Спасибо, что разделили с нами этот день.', 'Бу көнне безнең белән бүлешкәнегез өчен рәхмәт.'),
			icon: 'night'
		});

		content.timeline.items = newTimeline;
	}

	const invitationTitle = loc('invitationTitle', contentDefaults.invitation.title);
	const invitationSignature = loc('invitationSignature', contentDefaults.invitation.signature);
	const invitationText = str('invitationText');
	const invitationTextTt = str('invitationTextTt');
	if (invitationTitle) content.invitation.title = invitationTitle;
	if (invitationSignature) content.invitation.signature = invitationSignature;
	if (invitationText) {
		const ruParagraphs = invitationText
			.split(/\n\s*\n/)
			.map((p) => p.trim())
			.filter(Boolean);
		const ttParagraphs = invitationTextTt
			.split(/\n\s*\n/)
			.map((p) => p.trim())
			.filter(Boolean);
		const defaultParagraphs = contentDefaults.invitation.paragraphs;
		content.invitation.paragraphs = ruParagraphs.map((p, i) => {
			const tt = ttParagraphs[i] || '';
			if (tt) return t(p, tt);
			const def = defaultParagraphs[i];
			return def && def.ru === p && def.tt ? t(p, def.tt) : t(p);
		});
	}

	const dressTitle = loc('dressCodeTitle', contentDefaults.dressCode.title);
	const dressText = loc('dressCodeText', contentDefaults.dressCode.text);
	const dressNote = loc('dressCodeNote', contentDefaults.dressCode.note);
	if (dressTitle) content.dressCode.title = dressTitle;
	if (dressText) content.dressCode.text = dressText;
	if (dressNote) content.dressCode.note = dressNote;

	const story = ov['story'] as {
		chapters?: { title?: unknown; titleTt?: unknown; text?: unknown; textTt?: unknown }[];
	} | undefined;
	if (story && Array.isArray(story.chapters)) {
		const tones = ['sage', 'sand', 'pine', 'paper'] as const;
		const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
		const cleanStr = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
		const list = story.chapters
			.map((c) => ({
				title: cleanStr(c?.title),
				titleTt: cleanStr(c?.titleTt),
				text: cleanStr(c?.text),
				textTt: cleanStr(c?.textTt)
			}))
			.filter((c) => c.title || c.text || c.titleTt || c.textTt)
			.slice(0, 8);
		content.story.chapters = list.map((c, i) => ({
			numeral: romans[i] ?? String(i + 1),
			title: t(c.title || c.titleTt, c.titleTt || undefined),
			text: t(c.text || c.textTt, c.textTt || undefined),
			tone: tones[i % tones.length]
		}));
	}

	const faq = ov['faq'] as {
		items?: { q?: unknown; qTt?: unknown; a?: unknown; aTt?: unknown }[];
	} | undefined;
	if (faq && Array.isArray(faq.items)) {
		const cleanStr = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
		const list = faq.items
			.map((item) => ({
				q: cleanStr(item?.q),
				qTt: cleanStr(item?.qTt),
				a: cleanStr(item?.a),
				aTt: cleanStr(item?.aTt)
			}))
			.filter((item) => (item.q || item.qTt) && (item.a || item.aTt))
			.slice(0, 16);
		if (list.length > 0) {
			const defaultItems = contentDefaults.faq.items;
			content.faq.items = list.map((item) => {
				const def = defaultItems.find(
					(d) => d.q.ru === item.q && d.a.ru === item.a
				);
				const qTt =
					item.qTt || (def && def.q.ru === item.q && def.q.tt ? def.q.tt : '');
				const aTt =
					item.aTt || (def && def.a.ru === item.a && def.a.tt ? def.a.tt : '');
				return {
					q: t(item.q || qTt, qTt || undefined),
					a: t(item.a || aTt, aTt || undefined)
				};
			});
		}
	}

	const menu = ov['menu'] as {
		courses?: {
			label?: unknown;
			labelTt?: unknown;
			title?: unknown;
			titleTt?: unknown;
			text?: unknown;
			textTt?: unknown;
		}[];
		bar?: unknown;
		barTt?: unknown;
	} | undefined;
	if (menu) {
		if (Array.isArray(menu.courses)) {
			const cleanStr = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
			const courses = menu.courses
				.map((c) => ({
					label: cleanStr(c?.label),
					labelTt: cleanStr(c?.labelTt),
					title: cleanStr(c?.title),
					titleTt: cleanStr(c?.titleTt),
					text: cleanStr(c?.text),
					textTt: cleanStr(c?.textTt)
				}))
				.filter((c) => c.title || c.titleTt)
				.slice(0, 8);
			if (courses.length > 0) {
				const defaultCourses = contentDefaults.menu.courses;
				content.menu.courses = courses.map((c) => {
					const def = defaultCourses.find(
						(d) => d.title.ru === c.title || d.label.ru === c.label
					);
					const labelTt =
						c.labelTt || (def && def.label.ru === c.label && def.label.tt ? def.label.tt : '');
					const titleTt =
						c.titleTt || (def && def.title.ru === c.title && def.title.tt ? def.title.tt : '');
					const textTt =
						c.textTt || (def && def.text.ru === c.text && def.text.tt ? def.text.tt : '');
					return {
						label: t(c.label || labelTt, labelTt || undefined),
						title: t(c.title || titleTt, titleTt || undefined),
						text: t(c.text || textTt, textTt || undefined)
					};
				});
			}
		}
		const bar = typeof menu.bar === 'string' ? menu.bar.trim() : '';
		const barTtValue = typeof menu.barTt === 'string' ? menu.barTt.trim() : '';
		const defaultBar = contentDefaults.menu.bar;
		const barTt =
			barTtValue ||
			(defaultBar.ru === bar && defaultBar.tt ? defaultBar.tt : '');
		if (bar || barTt) {
			content.menu.bar = t(bar || barTt, barTt || undefined);
		}
	}
}
