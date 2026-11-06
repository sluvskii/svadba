<script lang="ts">
	import '@fontsource-variable/cormorant-garamond';
	import '@fontsource-variable/cormorant-garamond/wght-italic.css';
	import '@fontsource-variable/manrope';
	import '@fontsource-variable/playfair-display';
	import '@fontsource-variable/playfair-display/wght-italic.css';
	import '@fontsource/marck-script';
	import '../app.css';
	import { onMount } from 'svelte';
	import { content } from '#lib/content.js';
	import { i18n, initLang, pick } from '#lib/i18n.svelte.js';
	import favicon from '#lib/assets/favicon.svg';
	import ScrollProgress from '#lib/components/ScrollProgress.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	onMount(initLang);

	const metaTitle = $derived(`${pick(content.footer.names)} — ${pick(content.wedding.dateLong)}`);
	const metaDescription = $derived(
		`${pick(content.hero.note)} ${pick(content.wedding.dateLong)}, ${pick(content.wedding.city)}, ${pick(content.wedding.venue)}.`
	);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{metaTitle}</title>
	<meta name="description" content={metaDescription} />
	<meta name="theme-color" content="#1b3025" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={pick(content.footer.names)} />
	<meta property="og:title" content={metaTitle} />
	<meta property="og:description" content={metaDescription} />
</svelte:head>

<ScrollProgress />
<a class="skip-link" href="#main">{i18n.lang === 'tt' ? 'Эчтәлеккә' : 'К содержанию'}</a>

{@render children()}
