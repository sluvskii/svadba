<script lang="ts">
	import { onMount } from 'svelte';
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
	{#each units as unit, index (index)}
		<div class="countdown__unit">
			<span class="countdown__value">{now ? pad(unit.value) : '--'}</span>
			<span class="countdown__label">{pick(unit.label)}</span>
		</div>
	{/each}
</div>

<style>
	.countdown {
		display: flex;
		align-items: flex-start;
		gap: clamp(18px, 3.8vw, 46px);
	}

	.countdown__unit {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 6px;
		min-width: 42px;
	}

	.countdown__unit + .countdown__unit {
		padding-left: clamp(18px, 3.8vw, 46px);
	}

	.countdown__unit + .countdown__unit::before {
		content: '';
		position: absolute;
		left: 0;
		top: 2px;
		bottom: 2px;
		width: 1px;
		background: var(--line);
	}

	.countdown__value {
		font-family: var(--serif);
		font-size: clamp(28px, 3.2vw, 42px);
		font-weight: 400;
		line-height: 0.9;
		letter-spacing: 0.02em;
		font-variant-numeric: tabular-nums;
	}

	.countdown__label {
		font-size: 8px;
		font-weight: 650;
		letter-spacing: 0.2em;
		line-height: 1.4;
		text-transform: uppercase;
		color: var(--ink-soft);
		white-space: nowrap;
	}

	@media (max-width: 620px) {
		.countdown {
			gap: 16px;
			width: 100%;
			justify-content: space-between;
		}

		.countdown__unit + .countdown__unit {
			padding-left: 16px;
		}

		.countdown__value {
			font-size: 30px;
		}
	}
</style>
