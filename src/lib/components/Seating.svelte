<script lang="ts">
	import { content, ui, type Table } from '#lib/content.js';
	import { pick } from '#lib/i18n.svelte.js';
	import Monogram from './Monogram.svelte';
	import Ornament from './Ornament.svelte';
	import Reveal from './Reveal.svelte';

	type Props = {
		tables?: Table[];
		visible?: boolean;
	};

	let { tables = content.seating.tables, visible = true }: Props = $props();

	type GuestRow = {
		name: string;
		table: Table;
	};

	const currentTables = $derived(tables && tables.length ? tables : content.seating.tables);

	const allGuests: GuestRow[] = $derived(
		currentTables.flatMap((table) =>
			table.guests.map((name) => ({ name, table }))
		)
	);

	let query = $state('');
	let selectedId = $state<number | null>(null);
	let highlightName = $state('');

	const normalizedQuery = $derived(query.trim().toLowerCase());
	const isSearching = $derived(normalizedQuery.length >= 2);
	const matches = $derived(
		isSearching
			? allGuests.filter((guest) => guest.name.toLowerCase().includes(normalizedQuery))
			: []
	);
	const selectedTable = $derived(
		currentTables.find((table) => table.id === selectedId) ?? null
	);

	function selectTable(id: number) {
		selectedId = id;
		highlightName = '';
		// На мобиле панель с ответом выше схемы — показываем её гостю после клика.
		if (window.innerWidth <= 980) {
			document
				.querySelector('.seating__panel')
				?.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}

	function selectGuest(guest: GuestRow) {
		selectedId = guest.table.id;
		highlightName = guest.name;
	}

	function isHighlighted(name: string): boolean {
		if (!highlightName) return false;
		return name === highlightName;
	}

	function isSearched(name: string): boolean {
		return isSearching && name.toLowerCase().includes(normalizedQuery);
	}
</script>

<section class="section seating" id="seating">
	<div class="shell">
		<div class="seating__head">
			<Reveal>
				<p class="eyebrow">{pick(content.seating.eyebrow)}</p>
				<h2 class="display seating__title">{pick(content.seating.title)}</h2>
			</Reveal>
			<Reveal delay={100}>
				<p class="lead seating__intro">{pick(content.seating.intro)}</p>
			</Reveal>
		</div>

		{#if visible}
			<Reveal delay={80}>
				<div class="seating__search">
					<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" stroke-width="1.2" />
						<path d="M15.5 15.5 21 21" stroke="currentColor" stroke-width="1.2" />
					</svg>
					<input
						type="search"
						value={query}
						oninput={(event) => {
							query = event.currentTarget.value;
							selectedId = null;
							highlightName = '';
						}}
						placeholder={pick(content.seating.searchPlaceholder)}
						aria-label={pick(content.seating.searchPlaceholder)}
						autocomplete="off"
					/>
				</div>
			</Reveal>

			<div class="seating__body">
				<Reveal kind="right" delay={140} class="seating__panel">
					<div class="panel__head">
						<span class="tiny muted">{pick(content.seating.eyebrow)}</span>
						<Ornament variant="divider" class="panel__ornament" />
					</div>

					<div class="panel__body" aria-live="polite">
						{#if isSearching}
							{#if matches.length}
								<p class="panel__label">
									{matches.length === 1
										? pick(content.seating.yourTable)
										: `${pick(content.seating.found)}: ${matches.length}`}
								</p>
								<div class="panel__results">
									{#each matches.slice(0, 8) as guest (guest.name + guest.table.id)}
										<button
											class="result"
											type="button"
											class:is-active={selectedId === guest.table.id}
											onclick={() => selectGuest(guest)}
										>
											<span class="result__name">{guest.name}</span>
											<span class="result__table">
												{pick(content.seating.tableLabel)} {guest.table.id}
											</span>
										</button>
									{/each}
									{#if matches.length > 8}
										<p class="panel__subhint">
											{pick({
												ru: 'Показаны первые 8 совпадений — уточните имя.',
												tt: 'Беренче 8 туры күрсәтелде — исемне төгәлләштерегез.'
											})}
										</p>
									{/if}
								</div>
							{:else}
								<p class="panel__hint">{pick(content.seating.notFound)}</p>
							{/if}
						{:else if !selectedTable}
							<p class="panel__hint">{pick(content.seating.searchHint)}</p>
						{/if}

						{#if selectedTable}
							<div class="panel__table">
								<div class="panel__table-head">
									<div>
										<p class="panel__label">{pick(content.seating.tableLabel)}</p>
										<h3 class="panel__table-name">{selectedTable.id}</h3>
									</div>
									<span class="panel__count">
										{selectedTable.guests.length} / {selectedTable.capacity}
										· {pick(content.seating.guestsLabel)}
									</span>
								</div>
								<div class="panel__guests">
									{#each selectedTable.guests as guest (guest)}
										<span
											class="guest-chip"
											class:is-hl={isHighlighted(guest) || isSearched(guest)}
										>
											{guest}
										</span>
									{:else}
										<span class="guest-chip guest-chip--empty">{pick(content.seating.empty)}</span>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</Reveal>

				<Reveal kind="left" delay={100} class="seating__plan-wrap">
					<div class="plan" aria-label={pick(content.seating.planLabel)}>
						<div class="plan__topline">
							<span class="tiny muted">{pick(content.details.venue)}</span>
							<span class="tiny muted">{pick(content.seating.eyebrow)}</span>
						</div>

						<div class="plan__stage">{pick(content.seating.stage)}</div>

						<div class="plan__couple">
							<Monogram size={28} />
							<span>{pick(content.seating.coupleTable)}</span>
						</div>

						<div class="plan__dance">
							<span>{pick(content.seating.danceFloor)}</span>
						</div>

						{#each currentTables as table (table.id)}
							{@const chairs = Math.min(Math.max(table.capacity || 8, table.guests.length), 12)}
							{@const taken = Math.min(table.guests.length, chairs)}
							<button
								type="button"
								class="plan__table"
								class:is-active={selectedId === table.id}
								class:is-found={isSearching && table.guests.some((g) => g.toLowerCase().includes(normalizedQuery))}
								class:is-empty={table.guests.length === 0}
								style={`left: ${table.x}%; top: ${table.y}%;`}
								onclick={() => selectTable(table.id)}
								aria-label={`${pick(table.name)} — ${table.guests.length} ${pick(content.seating.guestsLabel)}`}
								aria-pressed={selectedId === table.id}
							>
								<svg class="plan__table-svg" viewBox="0 0 100 100" aria-hidden="true">
									{#each Array(chairs) as _, si}
										{@const ang = ((si / chairs) * 360 - 90) * (Math.PI / 180)}
										<circle
											class="plan__seat"
											class:is-taken={si < taken}
											cx={50 + 36 * Math.cos(ang)}
											cy={50 + 36 * Math.sin(ang)}
											r={chairs > 9 ? 6.5 : 8}
										/>
									{/each}
									<circle class="plan__disc" cx="50" cy="50" r="24" />
									<text class="plan__table-num" x="50" y="51" dominant-baseline="central" text-anchor="middle">
										{table.id}
									</text>
								</svg>
							</button>
						{/each}

						<div class="plan__entrance">
							<span class="plan__entrance-line"></span>
							<span>{pick(content.seating.entrance)}</span>
						</div>
					</div>
				</Reveal>
			</div>
		{:else}
			<Reveal delay={80}>
				<div class="seating__soon">
					<Ornament variant="divider" class="seating__soon-ornament" />
					<p class="lead seating__soon-text">{pick(content.seating.comingSoon)}</p>
					<p class="tiny muted seating__soon-sub">{pick(ui.invite.seatNote)}</p>
				</div>
			</Reveal>
		{/if}
	</div>
</section>

<style>
	.seating {
		background: var(--paper-2);
	}

	.seating__head {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 0.8fr);
		align-items: end;
		gap: 40px;
		margin-bottom: clamp(34px, 5vw, 54px);
	}

	.seating__title {
		max-width: 15ch;
		margin-top: 20px;
		font-size: clamp(42px, 5vw, 72px);
	}

	.seating__intro {
		max-width: 40ch;
		padding-bottom: 6px;
	}

	.seating__search {
		display: flex;
		align-items: center;
		gap: 14px;
		max-width: 560px;
		min-height: 58px;
		padding: 0 18px;
		border: 1px solid var(--line-strong);
		background: var(--paper);
		transition: border-color 0.25s var(--ease);
	}

	.seating__search:focus-within {
		border-color: var(--pine);
	}

	.seating__search svg {
		width: 19px;
		height: 19px;
		color: var(--ink-faint);
		flex: 0 0 auto;
	}

	.seating__search input {
		width: 100%;
		min-width: 0;
		border: 0;
		background: transparent;
		font-size: 15px;
	}

	.seating__search input:focus {
		outline: none;
	}

	.seating__search input::placeholder {
		color: var(--ink-faint);
	}

	.seating__body {
		display: grid;
		/* Панель первая в DOM — на мобиле она сверху; на десктопе схема справа широкая */
		grid-template-columns: minmax(280px, 0.58fr) minmax(0, 1.42fr);
		gap: clamp(20px, 3vw, 38px);
		align-items: stretch;
		margin-top: 28px;
	}

	:global(.seating__panel) {
		min-width: 0;
	}

	:global(.seating__plan-wrap) {
		min-width: 0;
	}

	.plan {
		position: relative;
		width: 100%;
		aspect-ratio: 1.36;
		min-height: 430px;
		border: 1px solid var(--line);
		background: var(--paper);
		overflow: hidden;
	}

	.plan::before {
		content: '';
		position: absolute;
		inset: 12px;
		border: 1px solid var(--line);
		opacity: 0.55;
		pointer-events: none;
	}

	.plan__topline {
		position: absolute;
		top: 22px;
		left: 26px;
		right: 26px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	.plan__stage {
		position: absolute;
		top: 9%;
		left: 50%;
		transform: translateX(-50%);
		display: grid;
		place-items: center;
		width: 22%;
		height: 5.5%;
		border: 1px solid var(--line);
		font-size: 7px;
		font-weight: 700;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}

	.plan__couple {
		position: absolute;
		top: 18%;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 16px;
		border: 1px solid var(--brass);
		background: var(--paper-2);
		color: var(--pine);
		font-size: 8px;
		font-weight: 650;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.plan__dance {
		position: absolute;
		top: 53%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: grid;
		place-items: center;
		width: 30%;
		aspect-ratio: 1;
		border: 1px dashed var(--line-strong);
		border-radius: 50%;
		color: var(--ink-faint);
	}

	.plan__dance span {
		font-size: 7px;
		font-weight: 700;
		letter-spacing: 0.2em;
		text-transform: uppercase;
	}

	/* Стол «вид сверху»: диск с номером + стулья по кругу.
		Занятые стулья заполнены, свободные — контурные. */
	.plan__table {
		position: absolute;
		width: clamp(78px, 11.5vw, 108px);
		border: 0;
		background: transparent;
		padding: 0;
		border-radius: 50%;
		transform: translate(-50%, -50%);
		cursor: pointer;
		transition: transform 0.3s var(--ease);
	}

	.plan__table:hover {
		transform: translate(-50%, -50%) scale(1.07);
		z-index: 2;
	}

	.plan__table-svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}

	.plan__seat {
		fill: transparent;
		stroke: var(--ink-faint);
		stroke-width: 1.6;
		transition:
			fill 0.3s var(--ease),
			stroke 0.3s var(--ease);
	}

	.plan__seat.is-taken {
		fill: var(--sage);
		stroke: var(--pine);
	}

	.plan__disc {
		fill: var(--paper);
		stroke: var(--line-strong);
		stroke-width: 2.5;
		transition:
			fill 0.3s var(--ease),
			stroke 0.3s var(--ease);
	}

	.plan__table.is-empty .plan__disc {
		stroke-dasharray: 5 4;
	}

	.plan__table:hover .plan__disc {
		stroke: var(--pine);
	}

	.plan__table.is-active .plan__disc {
		fill: var(--pine);
		stroke: var(--brass);
		stroke-width: 3.5;
	}

	.plan__table.is-active .plan__seat.is-taken {
		fill: var(--brass-light);
		stroke: var(--brass-light);
	}

	.plan__table.is-active .plan__seat {
		stroke: rgba(247, 242, 233, 0.5);
	}

	.plan__table-num {
		font-family: var(--sans);
		font-size: 22px;
		font-weight: 600;
		fill: var(--ink);
		transition: fill 0.3s var(--ease);
	}

	.plan__table.is-active .plan__table-num {
		fill: var(--paper);
	}

	/* Стол, где нашёлся искомый гость — латунный пульс */
	.plan__table.is-found {
		border-radius: 50%;
		animation: found-pulse 2.2s ease-in-out infinite;
	}

	.plan__table.is-found .plan__disc {
		stroke: var(--brass);
		stroke-width: 3.5;
	}

	@keyframes found-pulse {
		0%,
		100% {
			box-shadow: 0 0 0 0 rgba(180, 154, 99, 0.4);
		}
		50% {
			box-shadow: 0 0 0 12px rgba(180, 154, 99, 0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.plan__table.is-found {
			animation: none;
		}
	}

	.plan__entrance {
		position: absolute;
		left: 50%;
		bottom: 2.6%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 7px;
		font-weight: 700;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--ink-faint);
	}

	.plan__entrance-line {
		width: 26px;
		height: 1px;
		background: var(--line-strong);
	}

	:global(.seating__panel) {
		display: flex;
		flex-direction: column;
		padding: 22px;
		border: 1px solid var(--line);
		background: var(--paper);
	}

	.panel__head {
		display: flex;
		align-items: center;
		gap: 16px;
		padding-bottom: 18px;
		border-bottom: 1px solid var(--line);
	}

	:global(.panel__ornament) {
		width: 80px;
		color: var(--brass);
	}

	.panel__body {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding-top: 20px;
		flex: 1;
	}

	.panel__label {
		font-size: 8px;
		font-weight: 700;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--pine);
	}

	.panel__hint {
		font-family: var(--serif);
		font-size: 22px;
		line-height: 1.25;
		color: var(--ink);
	}

	.panel__subhint {
		font-size: 12px;
		line-height: 1.65;
		color: var(--ink-soft);
	}

	.panel__results {
		display: flex;
		flex-direction: column;
		border-top: 1px solid var(--line);
	}

	.result {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 13px 2px;
		border-bottom: 1px solid var(--line);
		text-align: left;
		transition: color 0.25s var(--ease);
	}

	.result:hover,
	.result.is-active {
		color: var(--pine);
	}

	.result__name {
		font-size: 15px;
		font-weight: 600;
	}

	.result__table {
		font-size: 8px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-faint);
		white-space: nowrap;
	}

	.panel__table {
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin-top: auto;
		padding-top: 20px;
		border-top: 1px solid var(--line);
	}

	.panel__table-head {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 16px;
	}

	.panel__table-name {
		font-family: var(--serif);
		font-size: 54px;
		font-weight: 400;
		line-height: 0.9;
		color: var(--pine);
	}

	.panel__count {
		font-size: 9px;
		font-weight: 650;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink-soft);
		white-space: nowrap;
	}

	.panel__guests {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.guest-chip {
		padding: 5px 9px;
		border: 1px solid var(--line);
		font-size: 11px;
		line-height: 1.4;
		color: var(--ink-soft);
		transition:
			background-color 0.25s var(--ease),
			border-color 0.25s var(--ease),
			color 0.25s var(--ease);
	}

	/* Найденный гость подсвечен латунью */
	.guest-chip.is-hl {
		background: rgba(180, 154, 99, 0.14);
		border-color: var(--brass);
		color: var(--pine-deep);
		font-weight: 650;
	}

	.guest-chip--empty {
		border-style: dashed;
		color: var(--ink-faint);
	}

	@media (max-width: 980px) {
		.seating__body {
			grid-template-columns: minmax(0, 1fr);
		}

		:global(.seating__panel) {
			min-height: 200px;
		}
	}

	@media (max-width: 800px) {
		.seating__head {
			grid-template-columns: minmax(0, 1fr);
			gap: 18px;
			align-items: start;
		}
	}

	@media (max-width: 620px) {
		.plan {
			aspect-ratio: 0.96;
			min-height: 390px;
		}

		.plan__table {
			width: 76px;
		}

		.plan__topline {
			top: 18px;
			left: 18px;
			right: 18px;
		}

		.plan__couple {
			top: 17%;
			padding: 6px 10px;
			font-size: 7px;
		}

		.plan__couple :global(.monogram) {
			display: none;
		}

		.plan__dance {
			width: 27%;
		}

		.plan__stage {
			width: 30%;
		}

		:global(.seating__panel) {
			padding: 18px;
		}

		.result {
			padding: 15px 2px;
		}

		.result__name {
			font-size: 16px;
		}

		.guest-chip {
			font-size: 12px;
			padding: 7px 11px;
		}
	}

	.seating__soon {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 50px 24px;
		background: var(--paper);
		border: 1px solid var(--border);
		border-radius: 0;
		max-width: 600px;
		margin: 20px auto 0;
	}

	:global(.seating__soon-ornament) {
		width: 140px;
		color: var(--sage);
		margin-bottom: 16px;
	}

	.seating__soon-text {
		color: var(--ink);
		font-size: 1.15rem;
		margin: 0 0 10px 0;
	}

	.seating__soon-sub {
		color: var(--ink-muted);
		margin: 0;
	}
</style>
