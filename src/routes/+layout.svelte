<script lang="ts">
	import '@fontsource-variable/cormorant-garamond';
	import '@fontsource-variable/cormorant-garamond/wght-italic.css';
	import '@fontsource-variable/manrope';
	import '@fontsource-variable/playfair-display';
	import '@fontsource-variable/playfair-display/wght-italic.css';
	import '@fontsource/marck-script';
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { initLang } from '#lib/i18n.svelte.js';
	import favicon from '#lib/assets/favicon.svg';
	import ScrollProgress from '#lib/components/ScrollProgress.svelte';
	import EnvelopeIntro from '#lib/components/EnvelopeIntro.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	const isAdmin = $derived(page.url.pathname.startsWith('/admin'));

	onMount(initLang);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Алина и Камиль — 17 декабря 2026</title>
	<meta
		name="description"
		content="Приглашаем вас разделить с нами самый тёплый зимний день. 17 декабря 2026, Нефтекамск, ресторан «Тантана»."
	/>
	<meta name="theme-color" content="#1b3025" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Алина и Камиль" />
	<meta property="og:title" content="Алина и Камиль — 17 декабря 2026" />
	<meta
		property="og:description"
		content="Приглашаем вас разделить с нами самый тёплый зимний день. Нефтекамск, ресторан «Тантана»."
	/>
</svelte:head>

{#if !isAdmin}
	<EnvelopeIntro />
{/if}

<ScrollProgress />
<a class="skip-link" href="#main">К содержанию</a>

{@render children()}
