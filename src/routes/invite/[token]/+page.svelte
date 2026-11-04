<script lang="ts">
	import { content, ui } from '#lib/content.js';
	import { i18n, pick, setLang } from '#lib/i18n.svelte.js';
	import RsvpForm from '#lib/components/RsvpForm.svelte';
	import Monogram from '#lib/components/Monogram.svelte';
	import Ornament from '#lib/components/Ornament.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const guest = $derived(data.guest);
	const displayName = $derived(
		i18n.lang === 'tt' ? (guest.nameTt ?? guest.name) : guest.name
	);
	const timelineItems = $derived(content.timeline.items);
</script>

<div class="invite">
	<header class="invite__header">
		<a class="invite__brand" href="/">
			<Monogram size={30} />
			<span class="invite__brand-names">{pick(content.footer.names)}</span>
		</a>
		<div class="lang" aria-label="Язык сайта / Тел теле">
			<button
				class="lang__btn"
				class:is-active={i18n.lang === 'ru'}
				type="button"
				onclick={() => setLang('ru')}
				aria-pressed={i18n.lang === 'ru'}>РУС</button
			>
			<span class="lang__sep" aria-hidden="true">/</span>
			<button
				class="lang__btn"
				class:is-active={i18n.lang === 'tt'}
				type="button"
				onclick={() => setLang('tt')}
				aria-pressed={i18n.lang === 'tt'}>ТАТ</button
			>
		</div>
	</header>

	<main class="invite__main shell shell--narrow" id="main">
		<section class="invite__hero">
			<p class="eyebrow eyebrow--plain">{pick(ui.invite.for)}</p>
			<h1 class="display invite__name">
				{displayName}
			</h1>
			<Ornament variant="divider" class="invite__divider" />
			<p class="lead invite__note">{pick(guest.note)}</p>
			<p class="invite__meta">
				<span>{pick(content.wedding.dateLong)}</span>
				<span class="invite__meta-dot" aria-hidden="true"></span>
				<span>{pick(content.wedding.city)}</span>
			</p>
		</section>

		{#if guest.table !== null}
			<section class="invite__table-card">
				<span class="tiny muted">{pick(ui.invite.yourTable)}</span>
				<strong class="display invite__table-num">{guest.table}</strong>
				<span class="invite__table-note">{pick(ui.invite.seatNote)}</span>
			</section>
		{/if}

		<section class="invite__form-card">
			<h2 class="display invite__form-title">{pick(content.rsvp.title)}</h2>
			<RsvpForm {guest} initiallySubmitted={form?.success === true} />
		</section>

		<section class="invite__recap">
			<h2 class="display invite__recap-title">{pick(ui.invite.program)}</h2>
			<div class="invite__recap-list">
				{#each timelineItems as item (item.time)}
					<div class="invite__recap-item">
						<span class="invite__recap-time">{item.time}</span>
						<span class="invite__recap-label">{pick(item.title)}</span>
					</div>
				{/each}
			</div>
			<a class="link-line invite__recap-link" href="/">
				<span>{pick(ui.invite.viewDetails)}</span>
				<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" stroke-width="1.1" />
				</svg>
			</a>
		</section>
	</main>

	<footer class="invite__footer">
		<Ornament variant="divider" class="invite__footer-ornament" />
		<p class="tiny muted">{pick(content.footer.names)} · {pick(content.footer.place)}</p>
	</footer>
</div>

<style>
	.invite {
		position: relative;
		min-height: 100svh;
		background:
			radial-gradient(120% 55% at 50% 0%, rgba(158, 174, 151, 0.16), transparent 62%),
			var(--paper);
		color: var(--ink);
		overflow-x: clip;
	}

	/* Шапка */
	.invite__header {
		position: relative;
		z-index: 3;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 30px 42px 0;
	}

	.invite__brand {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		text-decoration: none;
		color: var(--pine-deep);
	}

	.invite__brand-names {
		font-family: var(--serif);
		font-size: 1.05rem;
		letter-spacing: 0.04em;
	}

	.lang {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}

	.lang__btn {
		appearance: none;
		background: none;
		border: 0;
		border-bottom: 1px solid transparent;
		padding: 6px 7px;
		font-family: var(--sans);
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.14em;
		color: var(--ink-faint);
		cursor: pointer;
		transition: color 0.2s var(--ease);
	}

	.lang__btn:hover {
		color: var(--ink);
	}

	.lang__btn.is-active {
		color: var(--pine-deep);
		border-bottom-color: var(--brass);
	}

	.lang__sep {
		color: var(--line-strong);
		font-size: 11px;
	}

	/* Основная колонка */
	.invite__main {
		position: relative;
		z-index: 1;
	}

	/* Герой приглашения */
	.invite__hero {
		text-align: center;
		padding: clamp(48px, 9vh, 110px) 0 clamp(30px, 5vh, 56px);
	}

	.invite__name {
		font-size: clamp(58px, 10vw, 108px);
		line-height: 1.02;
		font-weight: 500;
		color: var(--pine-deep);
		margin: 18px 0 6px;
	}

	:global(.invite__divider) {
		width: 170px;
		color: var(--brass);
		margin: 6px auto 22px;
	}

	.invite__note {
		max-width: 46ch;
		margin: 0 auto;
	}

	.invite__meta {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 14px;
		margin-top: 26px;
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}

	.invite__meta-dot {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: var(--brass);
	}

	/* Карточка стола */
	.invite__table-card {
		max-width: 380px;
		margin: clamp(28px, 5vh, 48px) auto 0;
		padding: 26px 28px;
		text-align: center;
		background: var(--pine);
		color: var(--paper);
		border-radius: 18px;
		box-shadow: 0 24px 60px -32px rgba(29, 51, 42, 0.55);
	}

	.invite__table-card .tiny {
		color: var(--line-light);
	}

	.invite__table-num {
		display: block;
		font-size: clamp(40px, 6vw, 56px);
		font-weight: 500;
		margin: 6px 0 4px;
	}

	.invite__table-note {
		display: block;
		font-size: 11px;
		line-height: 1.5;
		color: rgba(247, 242, 233, 0.66);
	}

	/* Форма ответа */
	.invite__form-card {
		max-width: 640px;
		margin: clamp(30px, 5vh, 52px) auto 0;
		padding: clamp(26px, 4.5vw, 48px);
		background: #ffffff;
		border: 1px solid var(--line);
		border-radius: 20px;
		box-shadow:
			0 24px 60px -30px rgba(29, 51, 42, 0.18),
			0 4px 16px rgba(29, 51, 42, 0.03);
	}

	.invite__form-title {
		text-align: center;
		font-size: clamp(30px, 4.4vw, 44px);
		margin: 0 0 clamp(24px, 4vw, 36px);
	}

	/* Программа дня */
	.invite__recap {
		max-width: 520px;
		margin: clamp(44px, 7vh, 72px) auto 0;
		text-align: center;
	}

	.invite__recap-title {
		font-size: clamp(28px, 4vw, 40px);
		margin: 0 0 22px;
	}

	.invite__recap-list {
		text-align: left;
		border-top: 1px solid var(--line);
	}

	.invite__recap-item {
		display: flex;
		align-items: baseline;
		gap: 22px;
		padding: 14px 6px;
		border-bottom: 1px solid var(--line);
	}

	.invite__recap-time {
		font-family: var(--serif);
		font-size: 1.3rem;
		font-weight: 600;
		color: var(--brass);
		min-width: 62px;
	}

	.invite__recap-label {
		font-size: 14px;
		color: var(--ink-soft);
	}

	:global(a.invite__recap-link) {
		margin-top: 26px;
	}

	/* Подвал */
	.invite__footer {
		position: relative;
		z-index: 1;
		text-align: center;
		padding: clamp(60px, 9vh, 96px) 24px 46px;
	}

	:global(.invite__footer-ornament) {
		width: 150px;
		color: var(--brass);
		margin: 0 auto 14px;
	}

	@media (max-width: 640px) {
		.invite__header {
			padding: 22px 24px 0;
		}

		.invite__table-card,
		.invite__form-card {
			border-radius: 18px;
		}
	}
</style>
