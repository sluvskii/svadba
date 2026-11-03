<script lang="ts">
	import { goto } from '$app/navigation';
	import { content } from '#lib/content.js';
	import { i18n, pick, setLang } from '#lib/i18n.svelte.js';
	import Monogram from '#lib/components/Monogram.svelte';
	import Ornament from '#lib/components/Ornament.svelte';

	type Match = { token: string; name: string };

	let query = $state('');
	let results = $state<Match[]>([]);
	let searching = $state(false);
	let searched = $state(false);

	let debounceTimer: ReturnType<typeof setTimeout> | undefined;

	async function search() {
		const q = query.trim();
		if (q.length < 2) {
			results = [];
			searched = false;
			return;
		}
		searching = true;
		try {
			const res = await fetch(`/api/guests-search?q=${encodeURIComponent(q)}`);
			const data = (await res.json()) as { results?: Match[] };
			results = data.results ?? [];
			searched = true;
		} catch {
			results = [];
			searched = true;
		} finally {
			searching = false;
		}
	}

	function onInput() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(search, 300);
	}

	function openInvite(token: string) {
		goto(`/invite/${token}`);
	}
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

			<div class="find__search">
				<input
					class="input find__input"
					type="text"
					bind:value={query}
					oninput={onInput}
					placeholder={pick(content.rsvp.find.placeholder)}
					autocomplete="off"
					aria-label={pick(content.rsvp.find.placeholder)}
				/>
				{#if searching}
					<p class="tiny muted find__status">{pick(content.rsvp.find.searching)}</p>
				{/if}

				{#if results.length > 0}
					<ul class="find__results">
						{#each results as match (match.token)}
							<li>
								<button class="find__match" type="button" onclick={() => openInvite(match.token)}>
									<span>{match.name}</span>
									<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
										<path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" stroke-width="1.1" />
									</svg>
								</button>
							</li>
						{/each}
					</ul>
				{:else if searched && !searching}
					<p class="tiny muted find__notfound">{pick(content.rsvp.find.notFound)}</p>
				{/if}
			</div>

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

	.find__search {
		margin-top: 28px;
	}

	.find__input {
		width: 100%;
		text-align: center;
		font-size: 16px;
	}

	.find__status {
		margin-top: 12px;
	}

	.find__results {
		list-style: none;
		margin: 16px 0 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
		text-align: left;
	}

	.find__match {
		appearance: none;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 14px 18px;
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: 12px;
		font-family: var(--serif);
		font-size: 1.15rem;
		color: var(--ink);
		cursor: pointer;
		transition: border-color 0.2s var(--ease), transform 0.2s var(--ease);
	}

	.find__match:hover {
		border-color: var(--brass);
		transform: translateY(-1px);
	}

	.find__match svg {
		width: 14px;
		height: 14px;
		color: var(--brass);
		flex: 0 0 auto;
	}

	.find__notfound {
		margin-top: 16px;
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
