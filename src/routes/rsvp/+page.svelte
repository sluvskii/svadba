<script lang="ts">
	import { content, ui, applyContentOverride } from '#lib/content.js';
	import { i18n, pick, setLang } from '#lib/i18n.svelte.js';
	import Monogram from '#lib/components/Monogram.svelte';
	import Ornament from '#lib/components/Ornament.svelte';
	import RsvpForm from '#lib/components/RsvpForm.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	/* svelte-ignore state_referenced_locally */
	if (data.contentOverride) {
		applyContentOverride(data.contentOverride);
	}
</script>

<svelte:head>
	<title>{pick({ ru: 'Приглашение на свадьбу', tt: 'Туйга чакыру' })} — {pick(content.footer.names)}</title>
	<meta property="og:title" content="{pick({ ru: 'Приглашение на свадьбу', tt: 'Туйга чакыру' })} — {pick(content.footer.names)}" />
	<meta property="og:description" content={pick(content.rsvp.openForm.intro)} />
</svelte:head>

<div class="invite">
	<header class="invite__header">
		<a class="invite__brand" href="/">
			<Monogram size={30} />
			<span class="invite__brand-names">{pick(content.footer.names)}</span>
		</a>
		<div class="lang" aria-label={pick(ui.langLabel)}>
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
			<p class="eyebrow eyebrow--plain">{pick(content.rsvp.openForm.kicker)}</p>
			<h1 class="display invite__name">
				{pick({ ru: 'Приглашение на свадьбу', tt: 'Туйга чакыру' })}
			</h1>
			<Ornament variant="divider" class="invite__divider" />
			<p class="lead invite__note">{pick(content.rsvp.openForm.intro)}</p>
			<p class="invite__meta">
				<span>{pick(content.wedding.dateLong)}</span>
				<span class="invite__meta-dot" aria-hidden="true"></span>
				<span>{pick(content.wedding.city)}</span>
			</p>
		</section>

		<section class="invite__form-card">
			<h2 class="display invite__form-title">{pick(content.rsvp.title)}</h2>
			<RsvpForm
				isOpen={true}
				drinkOptions={data.drinkOptions}
				token={form?.token ?? null}
				initiallySubmitted={form?.success === true}
			/>
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

	.invite__main {
		position: relative;
		z-index: 1;
	}

	.invite__hero {
		text-align: center;
		padding: clamp(40px, 7vh, 80px) 0 clamp(24px, 4vh, 44px);
	}

	.invite__name {
		font-size: clamp(42px, 7.5vw, 76px);
		line-height: 1.08;
		font-weight: 500;
		color: var(--pine-deep);
		margin: 16px 0 6px;
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
		margin-top: 24px;
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

	.invite__form-card {
		max-width: 640px;
		margin: clamp(24px, 4vh, 42px) auto 0;
		padding: clamp(26px, 4.5vw, 48px);
		background: #ffffff;
		border: 1px solid var(--line);
		border-radius: 0;
	}

	.invite__form-title {
		text-align: center;
		font-size: clamp(30px, 4.4vw, 44px);
		margin: 0 0 clamp(24px, 4vw, 36px);
	}

	.invite__footer {
		position: relative;
		z-index: 1;
		text-align: center;
		padding: clamp(50px, 8vh, 80px) 24px 40px;
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

		.invite__form-card {
			border-radius: 0;
		}
	}
</style>
