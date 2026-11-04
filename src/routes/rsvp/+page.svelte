<script lang="ts">
	import { enhance } from '$app/forms';
	import { content, applyContentOverride } from '#lib/content.js';
	import { i18n, pick, setLang } from '#lib/i18n.svelte.js';
	import Monogram from '#lib/components/Monogram.svelte';
	import Ornament from '#lib/components/Ornament.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	/* svelte-ignore state_referenced_locally */
	if (data.contentOverride) {
		applyContentOverride(data.contentOverride);
	}

	let name = $state('');
	let attendance = $state<'yes' | 'no' | ''>('');
	let comment = $state('');
	let submitting = $state(false);
	let clientError = $state('');

	function validate() {
		if (!name.trim()) {
			clientError = pick(content.rsvp.openForm.errorName);
			return false;
		}
		if (!attendance) {
			clientError = pick(content.rsvp.openForm.errorAttendance);
			return false;
		}
		clientError = '';
		return true;
	}
</script>

<svelte:head>
	<title>{pick(content.rsvp.openForm.title)} — {pick(content.footer.names)}</title>
	<meta property="og:title" content="{pick(content.rsvp.openForm.title)} — {pick(content.footer.names)}" />
	<meta property="og:description" content={pick(content.rsvp.openForm.intro)} />
</svelte:head>

<div class="rsvp-page">
	<header class="rsvp-page__header">
		<a class="rsvp-page__brand" href="/">
			<Monogram size={32} />
			<span class="rsvp-page__brand-names">{pick(content.footer.names)}</span>
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

	<main class="rsvp-page__main">
		{#if form?.success}
			<section class="rsvp-card rsvp-card--success" role="status">
				<Ornament variant="flower" class="rsvp-card__flower" />
				<p class="tiny muted rsvp-card__kicker">{pick(content.rsvp.openForm.successKicker)}</p>
				<h1 class="display rsvp-card__title">
					{pick(content.rsvp.openForm.successTitle)}, {form.guestName}!
				</h1>
				<Ornament variant="divider" class="rsvp-card__divider" />
				<p class="lead rsvp-card__text">
					{#if form.attending === 'yes'}
						{pick(content.rsvp.openForm.successYes)}
					{:else}
						{pick(content.rsvp.openForm.successNo)}
					{/if}
				</p>

				{#if form.token && form.attending === 'yes'}
					<div class="rsvp-card__extra-box">
						<p class="tiny muted">{pick(content.rsvp.openForm.detailsKicker)}</p>
						<p class="rsvp-card__extra-desc">
							{pick(content.rsvp.openForm.detailsDesc)}
						</p>
						<a class="btn btn--outline rsvp-card__extra-link" href="/invite/{form.token}">
							{pick(content.rsvp.openForm.detailsLink)}
						</a>
					</div>
				{/if}

				<div class="rsvp-card__actions">
					<a class="btn rsvp-card__action-btn" href="/">
						{pick(content.rsvp.openForm.homeBtn)}
					</a>
					<a class="link-line rsvp-card__reset" href="/rsvp">
						<span>{pick(content.rsvp.openForm.resetBtn)}</span>
					</a>
				</div>
			</section>
		{:else}
			<section class="rsvp-card">
				<p class="tiny muted rsvp-card__kicker">{pick(content.rsvp.openForm.kicker)}</p>
				<h1 class="display rsvp-card__title">{pick(content.rsvp.openForm.title)}</h1>
				<Ornament variant="divider" class="rsvp-card__divider" />
				<p class="rsvp-card__intro">
					{pick(content.rsvp.openForm.intro)}
				</p>

				<form
					class="rsvp-form"
					method="POST"
					use:enhance={() => {
						if (!validate()) {
							return async ({ update }) => {
								await update({ reset: false });
							};
						}
						submitting = true;
						return async ({ update }) => {
							await update({ reset: false });
							submitting = false;
						};
					}}
				>
					<!-- Поле ввода имени -->
					<div class="rsvp-field">
						<label class="rsvp-field__label" for="guest-name">
							{pick(content.rsvp.openForm.nameLabel)} <span class="rsvp-field__req">*</span>
						</label>
						<input
							class="input rsvp-field__input"
							id="guest-name"
							type="text"
							name="name"
							bind:value={name}
							placeholder={pick(content.rsvp.openForm.namePlaceholder)}
							autocomplete="name"
							required
						/>
						<span class="rsvp-field__hint">
							{pick(content.rsvp.openForm.nameHint)}
						</span>
					</div>

					<!-- Выбор: Приду / Не смогу -->
					<div class="rsvp-field">
						<span class="rsvp-field__label">
							{pick(content.rsvp.openForm.attendanceLabel)} <span class="rsvp-field__req">*</span>
						</span>
						<div class="rsvp-choice-grid">
							<label class="choice-card" class:is-selected={attendance === 'yes'}>
								<input
									class="sr-only"
									type="radio"
									name="attendance"
									value="yes"
									bind:group={attendance}
								/>
								<span class="choice-card__icon choice-card__icon--yes" aria-hidden="true">
									<svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
										<path d="M4 10.5L8 14.5L16 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								</span>
								<span class="choice-card__title">{pick(content.rsvp.openForm.yesTitle)}</span>
								<span class="choice-card__desc">{pick(content.rsvp.openForm.yesDesc)}</span>
							</label>

							<label class="choice-card" class:is-selected={attendance === 'no'}>
								<input
									class="sr-only"
									type="radio"
									name="attendance"
									value="no"
									bind:group={attendance}
								/>
								<span class="choice-card__icon choice-card__icon--no" aria-hidden="true">
									<svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
										<path d="M5 5L15 15M15 5L5 15" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
									</svg>
								</span>
								<span class="choice-card__title">{pick(content.rsvp.openForm.noTitle)}</span>
								<span class="choice-card__desc">{pick(content.rsvp.openForm.noDesc)}</span>
							</label>
						</div>
					</div>

					<!-- Поле пожелания (необязательно) -->
					<div class="rsvp-field">
						<label class="rsvp-field__label" for="guest-comment">
							{pick(content.rsvp.openForm.commentLabel)} <span class="rsvp-field__opt">{pick(content.rsvp.openForm.commentOpt)}</span>
						</label>
						<textarea
							class="input rsvp-field__textarea"
							id="guest-comment"
							name="comment"
							bind:value={comment}
							rows="3"
							placeholder={pick(content.rsvp.openForm.commentPlaceholder)}
						></textarea>
					</div>

					{#if clientError}
						<p class="rsvp-alert" role="alert">{clientError}</p>
					{:else if form?.missingName}
						<p class="rsvp-alert" role="alert">{pick(content.rsvp.openForm.errorName)}</p>
					{:else if form?.missingAttendance}
						<p class="rsvp-alert" role="alert">{pick(content.rsvp.openForm.errorAttendance)}</p>
					{/if}

					<button class="btn rsvp-submit" type="submit" disabled={submitting}>
						{submitting ? pick(content.rsvp.openForm.submitting) : pick(content.rsvp.openForm.submit)}
					</button>
				</form>

				<footer class="rsvp-card__foot">
					<p class="tiny muted">
						{pick(content.rsvp.openForm.questionsFoot)}
					</p>
				</footer>
			</section>
		{/if}
	</main>
</div>

<style>
	.rsvp-page {
		min-height: 100svh;
		display: flex;
		flex-direction: column;
		background:
			radial-gradient(120% 55% at 50% 0%, rgba(158, 174, 151, 0.16), transparent 62%),
			var(--paper);
		color: var(--ink);
	}

	.rsvp-page__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 24px clamp(20px, 4vw, 48px) 0;
	}

	.rsvp-page__brand {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		text-decoration: none;
		color: var(--pine-deep);
		transition: opacity 0.2s var(--ease);
	}

	.rsvp-page__brand:hover {
		opacity: 0.8;
	}

	.rsvp-page__brand-names {
		font-family: var(--serif);
		font-size: 1.1rem;
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

	.rsvp-page__main {
		flex: 1;
		display: grid;
		place-items: center;
		padding: clamp(24px, 4vw, 56px) 20px clamp(40px, 6vw, 80px);
	}

	.rsvp-card {
		width: min(100%, 640px);
		padding: clamp(32px, 5.5vw, 56px) clamp(24px, 5vw, 48px);
		background: rgba(255, 253, 248, 0.96);
		border: 1px solid var(--line);
		border-radius: 0;
		box-shadow: 0 16px 40px -10px rgba(25, 30, 27, 0.05);
		text-align: left;
	}

	.rsvp-card--success {
		text-align: center;
	}

	.rsvp-card__kicker {
		letter-spacing: 0.18em;
		text-transform: uppercase;
		text-align: center;
	}

	.rsvp-card__title {
		font-size: clamp(32px, 4.4vw, 48px);
		line-height: 1.05;
		margin: 12px 0 0;
		text-align: center;
	}

	:global(.rsvp-card__divider) {
		width: 150px;
		color: var(--brass);
		margin: 14px auto 20px;
	}

	:global(.rsvp-card__flower) {
		width: 44px;
		height: 62px;
		color: var(--pine);
		margin: 0 auto 16px;
	}

	.rsvp-card__intro {
		max-width: 46ch;
		margin: 0 auto 28px;
		text-align: center;
		font-size: 15px;
		line-height: 1.6;
		color: var(--ink-soft);
	}

	.rsvp-card__text {
		max-width: 46ch;
		margin: 0 auto;
		color: var(--ink-soft);
		font-size: 17px;
	}

	.rsvp-card__extra-box {
		margin: 28px auto 0;
		padding: 24px 20px;
		border: 1px dashed var(--line-strong);
		background: rgba(245, 243, 237, 0.6);
		max-width: 440px;
		text-align: center;
	}

	.rsvp-card__extra-desc {
		font-size: 14px;
		color: var(--ink-soft);
		margin: 6px 0 16px;
	}

	.rsvp-card__extra-link {
		width: 100%;
		font-size: 13px;
		letter-spacing: 0.08em;
	}

	.rsvp-card__actions {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
		margin-top: 32px;
	}

	.rsvp-card__action-btn {
		width: min(100%, 320px);
	}

	.rsvp-card__reset {
		font-size: 13px;
		color: var(--ink-faint);
	}

	.rsvp-form {
		display: flex;
		flex-direction: column;
		gap: 26px;
	}

	.rsvp-field {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.rsvp-field__label {
		font-family: var(--sans);
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--pine-deep);
	}

	.rsvp-field__req {
		color: #b91c1c;
	}

	.rsvp-field__opt {
		font-size: 12px;
		font-weight: 400;
		color: var(--ink-faint);
		text-transform: none;
		letter-spacing: normal;
	}

	.rsvp-field__input {
		width: 100%;
		font-size: 16px;
		padding: 14px 16px;
		border: 1px solid var(--line-strong);
		border-radius: 0;
		background: #ffffff;
		transition: border-color 0.2s var(--ease), box-shadow 0.2s var(--ease);
	}

	.rsvp-field__input:focus {
		outline: none;
		border-color: var(--pine);
		box-shadow: 0 0 0 2px rgba(45, 71, 57, 0.15);
	}

	.rsvp-field__hint {
		font-size: 12px;
		color: var(--ink-faint);
		line-height: 1.4;
	}

	.rsvp-choice-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
	}

	.choice-card {
		display: flex;
		flex-direction: column;
		padding: 18px 16px;
		border: 1px solid var(--line-strong);
		border-radius: 0;
		background: #ffffff;
		cursor: pointer;
		position: relative;
		transition: all 0.2s var(--ease);
		user-select: none;
	}

	.choice-card:hover {
		border-color: var(--pine);
		background: rgba(245, 247, 244, 0.8);
	}

	.choice-card.is-selected {
		border-color: var(--pine-deep);
		background: var(--pine-deep);
		color: #ffffff;
		box-shadow: 0 4px 16px -2px rgba(35, 58, 46, 0.2);
	}

	.choice-card__icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		margin-bottom: 12px;
		border-radius: 50%;
		border: 1px solid var(--line-strong);
		background: var(--paper-2);
		color: var(--ink);
		transition: all 0.2s var(--ease);
		flex-shrink: 0;
	}

	.choice-card__icon svg {
		display: block;
		width: 16px;
		height: 16px;
	}

	.choice-card.is-selected .choice-card__icon {
		background: #ffffff;
		border-color: #ffffff;
	}

	.choice-card.is-selected .choice-card__icon--yes {
		color: #1e5e3a;
	}

	.choice-card.is-selected .choice-card__icon--no {
		color: #b91c1c;
	}

	.choice-card__title {
		font-family: var(--serif);
		font-size: 18px;
		font-weight: 500;
		line-height: 1.2;
		margin-bottom: 4px;
	}

	.choice-card__desc {
		font-size: 12px;
		line-height: 1.4;
		color: var(--ink-faint);
		transition: color 0.2s var(--ease);
	}

	.choice-card.is-selected .choice-card__desc {
		color: rgba(255, 255, 255, 0.8);
	}

	.rsvp-field__textarea {
		width: 100%;
		font-size: 15px;
		line-height: 1.5;
		padding: 12px 16px;
		border: 1px solid var(--line-strong);
		border-radius: 0;
		background: #ffffff;
		resize: vertical;
		min-height: 78px;
	}

	.rsvp-field__textarea:focus {
		outline: none;
		border-color: var(--pine);
		box-shadow: 0 0 0 2px rgba(45, 71, 57, 0.15);
	}

	.rsvp-alert {
		margin: 4px 0 0;
		padding: 12px 16px;
		border: 1px solid #f8b4b4;
		background: #fff5f5;
		color: #9b1c1c;
		font-size: 13px;
		line-height: 1.5;
	}

	.rsvp-submit {
		width: 100%;
		margin-top: 8px;
		padding: 16px;
		font-size: 14px;
		letter-spacing: 0.12em;
	}

	.rsvp-card__foot {
		margin-top: 26px;
		padding-top: 18px;
		border-top: 1px solid var(--line);
		text-align: center;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	@media (max-width: 600px) {
		.rsvp-choice-grid {
			grid-template-columns: 1fr;
		}

		.rsvp-card {
			padding: 28px 18px;
		}
	}
</style>
