<script lang="ts">
	import { onMount } from 'svelte';

	let progress = $state(0);

	onMount(() => {
		const update = () => {
			const doc = document.documentElement;
			const max = doc.scrollHeight - window.innerHeight;
			progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
		};
		update();
		window.addEventListener('scroll', update, { passive: true });
		window.addEventListener('resize', update);
		return () => {
			window.removeEventListener('scroll', update);
			window.removeEventListener('resize', update);
		};
	});
</script>

<div
	class="scroll-progress"
	style={`transform: scaleX(${progress})`}
	aria-hidden="true"
></div>

<style>
	.scroll-progress {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(90deg, var(--pine), var(--sage));
		transform-origin: left;
		transform: scaleX(0);
		z-index: 90;
		pointer-events: none;
	}
</style>
