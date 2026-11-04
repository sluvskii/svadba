<script lang="ts">
	import { onMount } from 'svelte';

	let barEl = $state<HTMLElement | null>(null);

	onMount(() => {
		let currentProgress = 0;
		let targetProgress = 0;
		let maxScroll = 1;
		let rafId: number | null = null;
		let lastTimestamp = 0;

		function measure() {
			const doc = document.documentElement;
			maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
		}

		function render(p: number) {
			if (!barEl) return;
			barEl.style.transform = `scale3d(${p.toFixed(4)}, 1, 1)`;
		}

		function tick(timestamp: number) {
			if (!lastTimestamp) lastTimestamp = timestamp;
			const dt = Math.min(48, Math.max(1, timestamp - lastTimestamp));
			lastTimestamp = timestamp;

			const diff = targetProgress - currentProgress;

			if (Math.abs(diff) < 0.0003) {
				currentProgress = targetProgress;
				render(currentProgress);
				rafId = null;
				lastTimestamp = 0;
				return;
			}

			// Адаптивное затухание (lambda = 24):
			// Превращает дерганую полоску в плавный, «жидкий» индикатор без микрорывков
			const factor = 1 - Math.exp((-24 * dt) / 1000);
			currentProgress += diff * factor;

			render(currentProgress);
			rafId = requestAnimationFrame(tick);
		}

		function startGlide() {
			if (rafId === null) {
				lastTimestamp = performance.now();
				rafId = requestAnimationFrame(tick);
			}
		}

		function updateTarget() {
			const scrollY = window.scrollY || window.pageYOffset || 0;
			targetProgress = Math.max(0, Math.min(1, scrollY / maxScroll));
			startGlide();
		}

		measure();
		const initialScrollY = window.scrollY || window.pageYOffset || 0;
		targetProgress = Math.max(0, Math.min(1, initialScrollY / maxScroll));
		currentProgress = targetProgress;
		render(currentProgress);

		// Повторный замер после загрузки шрифтов и изображений
		requestAnimationFrame(() => {
			measure();
			updateTarget();
		});

		const onScroll = () => {
			updateTarget();
		};

		const onResize = () => {
			measure();
			updateTarget();
		};

		let ro: ResizeObserver | null = null;
		if (typeof ResizeObserver !== 'undefined') {
			ro = new ResizeObserver(() => {
				measure();
				updateTarget();
			});
			ro.observe(document.documentElement);
		}

		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onResize, { passive: true });
		window.addEventListener('orientationchange', onResize, { passive: true });

		return () => {
			if (rafId !== null) {
				cancelAnimationFrame(rafId);
				rafId = null;
			}
			ro?.disconnect();
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onResize);
			window.removeEventListener('orientationchange', onResize);
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

	@media (prefers-reduced-motion: reduce) {
		.scroll-progress {
			display: none;
		}
	}
</style>
