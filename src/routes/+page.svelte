<script lang="ts">
	import type { PageProps } from './$types';
	import { content } from '#lib/content.js';
	import { t, type Localized } from '#lib/i18n.svelte.js';
	import Details from '#lib/components/Details.svelte';
	import DressCode from '#lib/components/DressCode.svelte';
	import Faq from '#lib/components/Faq.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import Hero from '#lib/components/Hero.svelte';
	import Invitation from '#lib/components/Invitation.svelte';
	import Menu from '#lib/components/Menu.svelte';
	import Rsvp from '#lib/components/Rsvp.svelte';
	import Seating from '#lib/components/Seating.svelte';
	import Story from '#lib/components/Story.svelte';
	import Timeline from '#lib/components/Timeline.svelte';

	let { data }: PageProps = $props();

	/**
	 * Переопределение текстов из админки (D1 → site_content 'site').
	 * Мутируем общий объект content до первого рендера компонентов —
	 * и SSR, и гидрация увидят актуальные значения.
	 */
	function applyOverride(ov: Record<string, unknown> | null): void {
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

		const times: [string, number][] = [
			['gatheringTime', 0],
			['ceremonyTime', 1],
			['dinnerTime', 2],
			['endTime', 3]
		];
		for (const [key, idx] of times) {
			const value = str(key);
			if (!value) continue;
			if (content.details.schedule[idx]) content.details.schedule[idx].value = value;
			if (content.timeline.items[idx]) content.timeline.items[idx].time = value;
		}

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

		// Наша история: главы из админки заменяют список целиком.
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

		// Вопросы и ответы.
		const faq = ov['faq'] as { items?: { q?: unknown; a?: unknown }[] } | undefined;
		if (faq && Array.isArray(faq.items)) {
			const items = faq.items
				.map((it) => ({
					q: typeof it?.q === 'string' ? it.q.trim() : '',
					a: typeof it?.a === 'string' ? it.a.trim() : ''
				}))
				.filter((it) => it.q || it.a)
				.slice(0, 12);
			if (items.length) {
				content.faq.items = items.map((it) => ({ q: t(it.q), a: t(it.a) }));
			}
		}

		// Меню: курсы и строка про бар.
		const menu = ov['menu'] as
			| { courses?: { label?: unknown; title?: unknown; text?: unknown }[]; bar?: unknown }
			| undefined;
		if (menu && Array.isArray(menu.courses)) {
			const list = menu.courses
				.map((c) => ({
					label: typeof c?.label === 'string' ? c.label.trim() : '',
					title: typeof c?.title === 'string' ? c.title.trim() : '',
					text: typeof c?.text === 'string' ? c.text.trim() : ''
				}))
				.filter((c) => c.label || c.title || c.text)
				.slice(0, 8);
			if (list.length) {
				content.menu.courses = list.map((c) => ({
					label: t(c.label),
					title: t(c.title),
					text: t(c.text)
				}));
			}
		}
		if (menu && typeof menu.bar === 'string' && menu.bar.trim()) {
			content.menu.bar = t(menu.bar.trim());
		}
	}

	// Слияние делаем один раз при инициализации — начальное значение data намеренное.
	/* svelte-ignore state_referenced_locally */
	applyOverride(data.contentOverride);
</script>

<Hero inviteHref="#rsvp" />

<main id="main">
	<Invitation />
	<Story />
	<Details />
	<Timeline />
	<DressCode />
	<Menu />
	<Seating tables={data.tables} visible={data.seatingVisible} />
	<Rsvp />
	<Faq />
</main>

<Footer />
