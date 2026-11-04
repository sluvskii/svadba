<script lang="ts">
	import { onMount } from 'svelte';

	type Flake = {
		left: number;
		size: number;
		delay: number;
		duration: number;
		opacity: number;
		sway: number;
	};

	let flakes = $state<Flake[]>([]);
	let enabled = $state(false);

	onMount(() => {
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced) return;

		const count = window.innerWidth < 640 ? 26 : 44;
		flakes = Array.from({ length: count }, () => ({
			left: Math.random() * 100,
			size: 2 + Math.random() * 3.5,
			delay: -Math.random() * 18,
			duration: 9 + Math.random() * 14,
			opacity: 0.12 + Math.random() * 0.3,
			sway: 14 + Math.random() * 30
		}));
		enabled = true;
	});
</script>

{#if enabled}
	<div class="snow" aria-hidden="true">
		{#each flakes as flake, i (i)}
			<span
				class="snow__flake"
				style={`left:${flake.left}%;
					width:${flake.size}px;
					height:${flake.size}px;
					animation-delay:${flake.delay}s;
					animation-duration:${flake.duration}s;
					--snow-opacity:${flake.opacity};
					--snow-sway:${flake.sway}px;`}
			></span>
		{/each}
	</div>
{/if}

<style>
	.snow {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		z-index: 0;
	}

	.snow__flake {
		position: absolute;
		top: -8px;
		border-radius: 50%;
		background: radial-gradient(circle, #ffffff 0%, rgba(255, 255, 255, 0.4) 70%);
		opacity: var(--snow-opacity, 0.2);
		animation: snow-fall linear infinite;
	}

	@keyframes snow-fall {
		0% {
			transform: translate(0, -10px);
		}
		50% {
			transform: translate(var(--snow-sway, 20px), calc(50vh));
		}
		100% {
			transform: translate(0, calc(100vh + 10px));
		}
	}
</style>
