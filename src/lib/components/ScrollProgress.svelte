<script lang="ts">
	import { onMount } from 'svelte';

	let barEl = $state<HTMLElement | null>(null);

	onMount(() => {
		// Если браузер поддерживает нативные аппаратные CSS Scroll-Driven Animations (Chrome, Edge, Safari 18+),
		// полоса прогресса анимируется на уровне GPU-композитора без участия JS — 120 FPS и нулевая задержка в обе стороны.
		if (typeof CSS !== 'undefined' && CSS.supports && CSS.supports('animation-timeline', 'scroll()')) {
			return;
		}

		// Fallback для более старых браузеров (Safari 16/17):
		// Мгновенная синхронизация 1:1 без искусственных lerp-задержек, которые вызывали рассинхрон и лаги при обратном скролле.
		let maxScroll = 1;
		let ticking = false;

		function measure() {
			const doc = document.documentElement;
			maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
		}

		function update() {
			if (!barEl) return;
			const scrollY = Math.max(0, window.scrollY || window.pageYOffset || 0);
			const p = Math.max(0, Math.min(1, scrollY / maxScroll));
			barEl.style.transform = `scale3d(${p.toFixed(4)}, 1, 1)`;
			ticking = false;
		}

		function onScroll() {
			if (!ticking) {
				requestAnimationFrame(update);
				ticking = true;
			}
		}

		function onResize() {
			measure();
			update();
		}

		measure();
		update();

		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onResize, { passive: true });
		window.addEventListener('orientationchange', onResize, { passive: true });
		window.addEventListener('load', onResize, { passive: true });

		let ro: ResizeObserver | null = null;
		if (typeof ResizeObserver !== 'undefined') {
			ro = new ResizeObserver(() => {
				measure();
				update();
			});
			ro.observe(document.documentElement);
		}

		return () => {
			ro?.disconnect();
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onResize);
			window.removeEventListener('orientationchange', onResize);
			window.removeEventListener('load', onResize);
		};
	});
</script>

<div
	bind:this={barEl}
	class="scroll-progress"
	aria-hidden="true"
></div>

<style>
	.scroll-progress {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 2.5px;
		background: linear-gradient(90deg, var(--pine), var(--sage), var(--brass));
		transform-origin: 0 50%;
		transform: scale3d(0, 1, 1);
		z-index: 999;
		pointer-events: none;
		will-change: transform;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
	}

	@supports (animation-timeline: scroll()) {
		.scroll-progress {
			animation: scroll-progress-grow auto linear both;
			animation-timeline: scroll();
		}
	}

	@keyframes scroll-progress-grow {
		from {
			transform: scale3d(0, 1, 1);
		}
		to {
			transform: scale3d(1, 1, 1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.scroll-progress {
			display: none;
		}
	}
</style>
