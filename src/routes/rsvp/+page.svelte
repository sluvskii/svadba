<script lang="ts">
	import { enhance } from '$app/forms';
	import { content } from '#lib/content.js';
	import { i18n, pick, setLang } from '#lib/i18n.svelte.js';
	import Monogram from '#lib/components/Monogram.svelte';
	import Ornament from '#lib/components/Ornament.svelte';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();

	let submitting = $state(false);
</script>

<div class="find">
	<header class="find__header">
		<a class="find__brand" href="/">
			<Monogram size={30} />
			<span class="find__brand-names">{pick(content.footer.names)}</span>
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

	<main class="find__main">
		<section class="find__card">
			<p class="tiny muted find__kicker">{pick(content.rsvp.eyebrow)}</p>
			<h1 class="display find__title">{pick(content.rsvp.find.title)}</h1>
			<Ornament variant="divider" class="find__divider" />
			<p class="lead find__intro">{pick(content.rsvp.find.intro)}</p>

			<form
				class="find__form"
				method="POST"
				use:enhance={() => {
					submitting = true;
					return async ({ update }) => {
						await update();
						submitting = false;
					};
				}}
			>
				<input
					class="input find__input"
					type="text"
					name="name"
					placeholder={pick(content.rsvp.find.placeholder)}
					autocomplete="off"
					aria-label={pick(content.rsvp.find.placeholder)}
					required
				/>
				<button class="btn find__submit" type="submit" disabled={submitting}>
					{submitting ? '...' : pick(content.rsvp.button)}
				</button>
			</form>

			{#if form?.ambiguous}
				<p class="find__error" role="alert">{pick(content.rsvp.find.ambiguous)}</p>
			{:else if form?.notFound}
				<p class="find__error" role="alert">{pick(content.rsvp.find.notFound)}</p>
			{/if}

			<p class="tiny muted find__foot">{pick(content.rsvp.note)}</p>
		</section>
	</main>
</div>

<style>
	.find {
		min-height: 100svh;
		display: flex;
		flex-direction: column;
		background:
			radial-gradient(120% 55% at 50% 0%, rgba(158, 174, 151, 0.16), transparent 62%),
			var(--paper);
		color: var(--ink);
	}

	.find__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 26px clamp(20px, 4vw, 42px) 0;
	}

	.find__brand {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		text-decoration: none;
		color: var(--pine-deep);
	}

	.find__brand-names {
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

	.find__main {
		flex: 1;
		display: grid;
		place-items: center;
		padding: 30px 20px 60px;
	}

	.find__card {
		width: min(100%, 560px);
		text-align: center;
		padding: clamp(28px, 5vw, 52px);
		background: rgba(255, 253, 248, 0.92);
		border: 1px solid var(--line);
		border-radius: 22px;
		box-shadow: 0 30px 70px -46px rgba(29, 51, 42, 0.4);
	}

	.find__kicker {
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}

	.find__title {
		font-size: clamp(30px, 4.4vw, 44px);
		margin: 12px 0 0;
	}

	:global(.find__divider) {
		width: 150px;
		color: var(--brass);
		margin: 14px auto 20px;
	}

	.find__intro {
		max-width: 42ch;
		margin: 0 auto;
	}

	.find__form {
		margin-top: 28px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.find__input {
		width: 100%;
		text-align: center;
		font-size: 16px;
	}

	.find__submit {
		width: 100%;
	}

	.find__error {
		margin: 18px auto 0;
		max-width: 44ch;
		padding: 12px 16px;
		border: 1px solid #f8b4b4;
		border-radius: 10px;
		background: #fff5f5;
		color: #9b1c1c;
		font-size: 13px;
		line-height: 1.6;
	}

	.find__foot {
		margin-top: 26px;
		padding-top: 18px;
		border-top: 1px solid var(--line);
	}

	@media (max-width: 520px) {
		.find__card {
			border-radius: 16px;
			padding: 24px 20px;
		}
	}
</style>
