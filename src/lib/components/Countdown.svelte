<script lang="ts">
	import { content } from '#lib/content.js';
	import { pick } from '#lib/i18n.svelte.js';

	const target = new Date(content.wedding.dateISO).getTime();

	let now = $state(0);

	$effect(() => {
		now = Date.now();
		const id = window.setInterval(() => {
			now = Date.now();
		}, 1000);
		return () => window.clearInterval(id);
	});

	const remaining = $derived(Math.max(0, target - now));
	const days = $derived(Math.floor(remaining / 86_400_000));
	const hours = $derived(Math.floor((remaining % 86_400_000) / 3_600_000));
	const minutes = $derived(Math.floor((remaining % 3_600_000) / 60_000));
	const seconds = $derived(Math.floor((remaining % 60_000) / 1000));

	const units = $derived([
		{ value: days, label: content.countdown.days },
		{ value: hours, label: content.countdown.hours },
		{ value: minutes, label: content.countdown.minutes },
		{ value: seconds, label: content.countdown.seconds }
	]);

	const pad = (value: number) => String(value).padStart(2, '0');
</script>

<div class="countdown" aria-label="До свадьбы осталось">
	<div class="countdown__kicker">
		<span class="countdown__pulse" aria-hidden="true"></span>
		<span class="countdown__kicker-text">До свадьбы осталось</span>
	</div>

	<div class="countdown__grid">
		{#each units as unit, index (`${index}-${now ? unit.value : 'x'}`)}
			<div class="countdown__tile">
				<span class="countdown__value">
					{now ? pad(unit.value) : '--'}
				</span>
				<span class="countdown__label">{pick(unit.label)}</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.countdown {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.countdown__kicker {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}

	.countdown__pulse {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--pine);
		animation: pulse-ring 2.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
	}

	@keyframes pulse-ring {
		0%,
		100% {
			transform: scale(0.9);
			opacity: 0.7;
		}
		50% {
			transform: scale(1.4);
			opacity: 1;
		}
	}

	.countdown__grid {
		display: flex;
		align-items: center;
		gap: clamp(8px, 1.4vw, 16px);
	}

	.countdown__tile {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-width: clamp(68px, 8vw, 92px);
		padding: clamp(12px, 1.6vw, 18px) clamp(10px, 1.4vw, 16px);
		background: rgba(255, 255, 255, 0.88);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid rgba(25, 30, 27, 0.08);
		border-radius: 16px;
		box-shadow: 0 4px 20px -2px rgba(25, 30, 27, 0.04);
		transition:
			transform 0.35s var(--ease),
			box-shadow 0.35s var(--ease),
			border-color 0.35s var(--ease);
	}

	.countdown__tile:hover {
		transform: translateY(-3px);
		box-shadow: 0 12px 28px -4px rgba(25, 30, 27, 0.09);
		border-color: rgba(27, 48, 37, 0.22);
	}

	.countdown__value {
		display: inline-block;
		font-family: var(--serif);
		font-size: clamp(30px, 3.6vw, 46px);
		font-weight: 400;
		line-height: 0.95;
		letter-spacing: -0.01em;
		color: var(--ink);
		font-variant-numeric: tabular-nums;
		animation: digit-in 0.4s var(--ease);
	}

	@keyframes digit-in {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.countdown__label {
		margin-top: 6px;
		font-size: 8px;
		font-weight: 700;
		letter-spacing: 0.2em;
		line-height: 1.2;
		text-transform: uppercase;
		color: var(--ink-soft);
		white-space: nowrap;
	}

	@media (max-width: 620px) {
		.countdown {
			width: 100%;
		}

		.countdown__grid {
			width: 100%;
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			gap: 6px;
		}

		.countdown__tile {
			min-width: 0;
			padding: 10px 4px;
			border-radius: 12px;
		}

		.countdown__value {
			font-size: 26px;
		}

		.countdown__label {
			font-size: 7px;
			letter-spacing: 0.12em;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.countdown__pulse {
			animation: none;
		}

		.countdown__value {
			animation: none;
		}
	}
</style>
