<script lang="ts">
	import type { PageProps } from './$types';
	import { applyContentOverride } from '#lib/content.js';
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

	// Слияние делаем один раз при инициализации — начальное значение data намеренное.
	/* svelte-ignore state_referenced_locally */
	applyContentOverride(data.contentOverride);
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
