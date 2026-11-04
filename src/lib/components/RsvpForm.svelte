<script lang="ts">
	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import { defaultDrinkOptions, rsvpForm, type DrinkOption, type Guest } from '#lib/rsvp-form.js';
	import { i18n, pick } from '#lib/i18n.svelte.js';
	import Ornament from './Ornament.svelte';

	type Props = {
		guest?: Guest;
		isOpen?: boolean;
		initiallySubmitted?: boolean;
		drinkOptions?: DrinkOption[];
		token?: string | null;
	};

	let {
		guest,
		isOpen = false,
		initiallySubmitted = false,
		drinkOptions = defaultDrinkOptions,
		token = null
	}: Props = $props();

	/* svelte-ignore state_referenced_locally */
	let name = $state('');
	/* svelte-ignore state_referenced_locally */
	let attendance = $state<'yes' | 'no' | null>(guest?.response?.attendance ?? null);
	/* svelte-ignore state_referenced_locally */
	let plusOneName = $state(guest?.response?.plusOneName ?? guest?.plusOneName ?? '');
	/* svelte-ignore state_referenced_locally */
	let children = $state(guest?.response?.children ?? '');
	/* svelte-ignore state_referenced_locally */
	let drinks = $state<string[]>(guest?.response?.drinks ?? []);
	/* svelte-ignore state_referenced_locally */
	let food = $state(guest?.response?.food ?? '');
	/* svelte-ignore state_referenced_locally */
	let song = $state(guest?.response?.song ?? '');
	/* svelte-ignore state_referenced_locally */
	let comment = $state(guest?.response?.comment ?? '');

	let submitting = $state(false);
	/* svelte-ignore state_referenced_locally */
	let submitted = $state(initiallySubmitted || (guest ? guest.response !== null : false));
	let serverToken = $state<string | null>(null);
	let showAttendanceError = $state(false);
	let showNameError = $state(false);

	const isYes = $derived(attendance === 'yes');
	const allowsPlusOne = $derived(isOpen || Boolean(guest?.plusOneAllowed));
	const allowsChildren = $derived(isOpen || Boolean(guest?.childrenAllowed));
	const resolvedToken = $derived(guest?.token ?? token ?? serverToken);

	function isNoneOption(optId: string): boolean {
		if (optId === 'none') return true;
		const opt = drinkOptions.find((o) => o.id === optId);
		if (!opt) return false;
		return !opt.alcohol && pick(opt.label).toLowerCase().includes('не пью');
	}

	function toggleDrink(id: string) {
		if (isNoneOption(id)) {
			if (drinks.includes(id)) {
				drinks = drinks.filter((d) => d !== id);
			} else {
				// При выборе «Не пью алкоголь» снимаем алкогольные напитки
				drinks = drinks.filter((d) => !drinkOptions.find((o) => o.id === d)?.alcohol);
				drinks = [...drinks, id];
			}
		} else {
			const opt = drinkOptions.find((o) => o.id === id);
			if (opt?.alcohol) {
				// При выборе алкогольного напитка снимаем отметку «Не пью алкоголь»
				drinks = drinks.filter((d) => !isNoneOption(d));
			}
			drinks = drinks.includes(id) ? drinks.filter((d) => d !== id) : [...drinks, id];
		}
	}

	function submit() {
		let valid = true;
		if (isOpen && !name.trim()) {
			showNameError = true;
			valid = false;
		} else {
			showNameError = false;
		}

		if (!attendance) {
			showAttendanceError = true;
			valid = false;
		} else {
			showAttendanceError = false;
		}

		return valid;
	}
</script>

{#if submitted}
	<div class="rsvp-form__success">
		<Ornament variant="flower" class="rsvp-form__success-flower" />
		<h3 class="display rsvp-form__success-title">{pick(rsvpForm.successTitle)}</h3>
		<p class="rsvp-form__success-text">
			{attendance === 'no' ? pick(rsvpForm.successNo) : pick(rsvpForm.successText)}
		</p>
		{#if resolvedToken && attendance === 'yes'}
			<div class="rsvp-form__extra-box">
				<p class="tiny muted">{pick(rsvpForm.detailsKicker)}</p>
				<p class="rsvp-form__extra-desc">{pick(rsvpForm.detailsDesc)}</p>
				<a class="btn btn--outline rsvp-form__extra-link" href="/invite/{resolvedToken}">
					{pick(rsvpForm.detailsLink)}
				</a>
			</div>
		{/if}
		<div class="rsvp-form__success-actions">
			<button class="link-line rsvp-form__edit" type="button" onclick={() => (submitted = false)}>
				<span>{pick(rsvpForm.edit)}</span>
			</button>
			{#if isOpen}
				<a class="btn btn--outline rsvp-form__home-btn" href="/">
					{pick(rsvpForm.homeBtn)}
				</a>
			{/if}
		</div>
	</div>
{:else}
	<form
		method="POST"
		class="rsvp-form"
		use:enhance={() => {
			if (!submit()) {
				return async ({ update }) => {
					await update({ reset: false });
				};
			}
			submitting = true;
			return async ({ result, update }) => {
				await update({ reset: false });
				submitting = false;
				if (result.type === 'success' && (result.data as any)?.token) {
					serverToken = (result.data as any).token;
				}
				submitted = true;
			};
		}}
	>
		{#if isOpen}
			<!-- name -->
			<div class="field">
				<label class="field-label" for="guestName">
					{pick(rsvpForm.name)} <span class="field-req">*</span>
				</label>
				<input
					class="input"
					id="guestName"
					name="name"
					bind:value={name}
					placeholder={pick(rsvpForm.namePlaceholder)}
					autocomplete="name"
					required
				/>
				<p class="form-hint">{pick(rsvpForm.nameHint)}</p>
				{#if showNameError}
					<p class="form-error">{pick(rsvpForm.nameRequired)}</p>
				{/if}
			</div>
		{/if}

		<!-- attendance -->
		<fieldset class="rsvp-form__group">
			<legend class="field-label rsvp-form__legend rsvp-form__legend--attendance">{pick(rsvpForm.attendance)}</legend>
			<div class="attendance">
				<label class="attendance__card">
					<input type="radio" name="attendance" value="yes" bind:group={attendance} />
					<strong>{pick(rsvpForm.yes)}</strong>
					<span>{pick(rsvpForm.yesHint)}</span>
				</label>
				<label class="attendance__card">
					<input type="radio" name="attendance" value="no" bind:group={attendance} />
					<strong>{pick(rsvpForm.no)}</strong>
					<span>{pick(rsvpForm.noHint)}</span>
				</label>
			</div>
			{#if showAttendanceError}
				<p class="form-error">{pick(rsvpForm.attendanceRequired)}</p>
			{/if}
		</fieldset>

		{#if attendance !== null}
			<div class="rsvp-form__rest" transition:slide={{ duration: 260 }}>
				{#if isYes}
					<!-- drinks -->
					<fieldset class="rsvp-form__group">
						<legend class="field-label rsvp-form__legend">{pick(rsvpForm.drinks)}</legend>
						<p class="form-hint rsvp-form__hint">{pick(rsvpForm.drinksHint)}</p>
						<div class="rsvp-form__chips">
							{#each drinkOptions as option (option.id)}
								<label class="choice">
									<input
										type="checkbox"
										name="drinks"
										value={option.id}
										checked={drinks.includes(option.id)}
										onchange={() => toggleDrink(option.id)}
									/>
									<span class="choice__mark" aria-hidden="true"></span>
									<span>{pick(option.label)}</span>
								</label>
							{/each}
						</div>
					</fieldset>

					<div class="field-grid">
						<!-- plus one -->
						{#if allowsPlusOne}
							<div class="field">
								<label class="field-label" for="plusOneName">{pick(rsvpForm.plusOneName)}</label>
								<input
									class="input"
									id="plusOneName"
									name="plusOneName"
									bind:value={plusOneName}
									placeholder={pick(rsvpForm.plusOnePlaceholder)}
								/>
							</div>
						{/if}

						<!-- children -->
						{#if allowsChildren}
							<div class="field">
								<label class="field-label" for="children">{pick(rsvpForm.children)}</label>
								<input
									class="input"
									id="children"
									name="children"
									bind:value={children}
									placeholder={pick(rsvpForm.childrenPlaceholder)}
								/>
								<p class="form-hint">{pick(rsvpForm.childrenHint)}</p>
							</div>
						{/if}
					</div>

					<!-- food -->
					<div class="field">
						<label class="field-label" for="food">{pick(rsvpForm.food)}</label>
						<input
							class="input"
							id="food"
							name="food"
							bind:value={food}
							placeholder={pick(rsvpForm.foodPlaceholder)}
						/>
					</div>

					<!-- song -->
					<div class="field">
						<label class="field-label" for="song">{pick(rsvpForm.song)}</label>
						<input
							class="input"
							id="song"
							name="song"
							bind:value={song}
							placeholder={pick(rsvpForm.songPlaceholder)}
						/>
					</div>
				{/if}

				<!-- comment -->
				<div class="field">
					<label class="field-label" for="comment">{pick(rsvpForm.comment)}</label>
					<textarea
						class="textarea"
						id="comment"
						name="comment"
						bind:value={comment}
						placeholder={pick(rsvpForm.commentPlaceholder)}
					></textarea>
				</div>

				<button class="btn rsvp-form__submit" type="submit" disabled={submitting}>
					{submitting ? pick(rsvpForm.submitting) : pick(rsvpForm.submit)}
				</button>

				<p class="rsvp-form__privacy">{pick(rsvpForm.privacy)}</p>
			</div>
		{/if}
	</form>
{/if}

<style>
	.rsvp-form {
		display: flex;
		flex-direction: column;
		gap: 30px;
	}

	.field-req {
		color: var(--rose-deep, #9c4b4b);
		font-weight: 700;
	}

	.rsvp-form__group {
		display: block;
		margin: 0;
		padding: 0;
		border: 0;
	}

	.rsvp-form__legend {
		display: block;
		width: 100%;
		padding: 0 0 8px 0;
		margin: 0;
	}

	.rsvp-form__legend--attendance {
		padding: 0 0 16px 0;
	}

	.rsvp-form__hint {
		margin: 0 0 14px 0;
	}

	.rsvp-form__rest {
		display: flex;
		flex-direction: column;
		gap: 26px;
	}

	.rsvp-form__chips {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.rsvp-form__submit {
		width: 100%;
	}

	.rsvp-form__submit[disabled] {
		opacity: 0.55;
		pointer-events: none;
	}

	.rsvp-form__privacy {
		font-size: 11px;
		line-height: 1.6;
		text-align: center;
		color: var(--ink-faint);
	}

	.rsvp-form__success {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
		padding: 34px 10px;
		text-align: center;
	}

	:global(.rsvp-form__success-flower) {
		width: 30px;
		height: 44px;
		color: var(--sage);
	}

	.rsvp-form__success-title {
		font-size: clamp(38px, 5vw, 56px);
	}

	.rsvp-form__success-text {
		max-width: 38ch;
		font-size: 14px;
		line-height: 1.7;
		color: var(--ink-soft);
	}

	.rsvp-form__extra-box {
		margin-top: 10px;
		padding: 18px 20px;
		background: var(--paper-2);
		border: 1px dashed var(--border-soft);
		border-radius: var(--radius-md);
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		max-width: 440px;
		width: 100%;
	}

	.rsvp-form__extra-desc {
		font-size: 13px;
		line-height: 1.55;
		color: var(--ink-soft);
		margin: 0;
	}

	.rsvp-form__extra-link {
		margin-top: 6px;
		font-size: 13px;
		padding: 10px 22px;
	}

	.rsvp-form__success-actions {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 14px;
		margin-top: 14px;
		width: 100%;
	}

	.rsvp-form__edit {
		color: var(--ink-soft);
	}

	.rsvp-form__home-btn {
		width: 100%;
		max-width: 240px;
		font-size: 13px;
		padding: 10px 20px;
	}
</style>
