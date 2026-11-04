<script lang="ts">
	import { onMount } from 'svelte';
	import { content } from '#lib/content.js';
	import { pick } from '#lib/i18n.svelte.js';
	import Reveal from './Reveal.svelte';
	import TimelineSketch from './TimelineSketch.svelte';
	import { detectTimelineIcon, generateTimelinePath } from '#lib/timeline.js';

	let sectionEl = $state<HTMLElement | null>(null);
	let pathEl = $state<SVGPathElement | null>(null);

	let heartXPercent = $state(50);
	let heartYPercent = $state(2);
	let heartAngle = $state(0);
	let pathLength = $state(0);

	const items = $derived(content.timeline.items);
	const pathD = $derived.by(() => generateTimelinePath(items.length));

	function recalculateLength() {
		if (pathEl) {
			try {
				pathLength = pathEl.getTotalLength();
			} catch {}
		}
	}

	function updateHeartPosition() {
		if (!sectionEl || !pathEl) return;

		if (pathLength === 0) {
			try {
				pathLength = pathEl.getTotalLength();
			} catch {
				return;
			}
		}

		if (pathLength <= 0) return;

		const rect = sectionEl.getBoundingClientRect();
		const viewportH = window.innerHeight;

		// Прогресс скролла: начинается когда секция заходит в экран (75%),
		// и плавно доходит до конца к моменту ухода секции
		const startY = viewportH * 0.75;
		const endY = viewportH * 0.25;
		const totalDistance = rect.height + (startY - endY);
		const currentDistance = startY - rect.top;

		const progress = Math.max(0, Math.min(1, currentDistance / totalDistance));

		try {
			const currentDist = progress * pathLength;
			const point = pathEl.getPointAtLength(currentDist);
			// viewBox="0 0 100 1000" => point.x является процентом от 0 до 100
			heartXPercent = point.x;
			heartYPercent = (point.y / 1000) * 100;

			// Наклон сердечка вдоль направления движения кривой
			const pAhead = pathEl.getPointAtLength(Math.min(pathLength, currentDist + 4));
			const pBehind = pathEl.getPointAtLength(Math.max(0, currentDist - 4));
			const dx = pAhead.x - pBehind.x;
			const dy = (pAhead.y - pBehind.y) * 0.25;
			const rad = Math.atan2(dx, dy);
			heartAngle = Math.max(-20, Math.min(20, (rad * 180) / Math.PI));
		} catch {
			// fallback
		}
	}

	$effect(() => {
		// При изменении количества пунктов или траектории пересчитываем длину и позицию
		pathD;
		items.length;
		recalculateLength();
		updateHeartPosition();
	});

	onMount(() => {
		recalculateLength();
		if (pathEl) {
			try {
				const initialPoint = pathEl.getPointAtLength(0);
				heartXPercent = initialPoint.x;
				heartYPercent = (initialPoint.y / 1000) * 100;
			} catch (e) {
				console.error(e);
			}
		}

		updateHeartPosition();

		let ticking = false;
		const onScroll = () => {
			if (!ticking) {
				requestAnimationFrame(() => {
					updateHeartPosition();
					ticking = false;
				});
				ticking = true;
			}
		};

		const onResize = () => {
			recalculateLength();
			onScroll();
		};

		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onResize, { passive: true });

		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onResize);
		};
	});
</script>

<section class="section section--paper timeline" id="timeline" bind:this={sectionEl}>
	<div class="shell">
		<header class="timeline__head">
			<Reveal>
				<p class="eyebrow">{pick(content.timeline.eyebrow)}</p>
				<h2 class="display timeline__title">{pick(content.timeline.title)}</h2>
			</Reveal>
			<Reveal delay={100}>
				<p class="lead timeline__intro">{pick(content.timeline.intro)}</p>
			</Reveal>
		</header>

		<div class="timeline__flow">
			<!-- Центральная динамическая шелковистая SVG дорожка (адаптируется под любое число событий) -->
			<div class="timeline__track" aria-hidden="true">
				<svg
					class="timeline__svg"
					viewBox="0 0 100 1000"
					preserveAspectRatio="none"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						bind:this={pathEl}
						class="timeline__path"
						d={pathD}
						stroke="#8aa192"
						stroke-width="1.3"
						stroke-linecap="round"
						vector-effect="non-scaling-stroke"
						opacity="0.8"
					/>
				</svg>

				<!-- Несжимаемое HTML сердечко (всегда сохраняет идеальные пропорции 22x22px) -->
				<div
					class="timeline__heart-badge"
					style="left: {heartXPercent}%; top: {heartYPercent}%; transform: translate(-50%, -50%) rotate({heartAngle}deg);"
					aria-hidden="true"
				>
					<svg
						class="timeline__heart-svg"
						viewBox="0 0 24 24"
						width="22"
						height="22"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<!-- Ореол цвета фона, чтобы плавная линия аккуратно прерывалась за сердечком -->
						<path
							d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
							stroke="#ffffff"
							stroke-width="3"
							stroke-linejoin="round"
						/>
						<path
							d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
							fill="#284333"
						/>
					</svg>
				</div>
			</div>

			<!-- Список этапов свадьбы: чередование слева и справа от центральной линии -->
			<div class="timeline__steps">
				{#each items as item, index (item.time + '-' + index)}
					{@const isEven = index % 2 === 0}
					<article
						class="timeline__step"
						class:timeline__step--left={isEven}
						class:timeline__step--right={!isEven}
					>
						<Reveal
							kind={isEven ? 'left' : 'right'}
							delay={index * 100}
							class="timeline__step-content"
						>
							<span class="timeline__script-time">{item.time}</span>
							<h3 class="timeline__step-title">{pick(item.title)}</h3>
							{#if pick(item.text)}
								<p class="timeline__step-desc">{pick(item.text)}</p>
							{/if}

							<!-- Художественная авторская скетч-иллюстрация (автоматический подбор или ручной выбор) -->
							<div class="timeline__sketch" aria-hidden="true">
								<TimelineSketch
									variant={detectTimelineIcon(pick(item.title), pick(item.text), item.icon)}
									class={isEven ? 'sketch--left' : 'sketch--right'}
								/>
							</div>
						</Reveal>
					</article>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.timeline {
		background: var(--paper-2);
		position: relative;
		overflow: hidden;
		padding: clamp(60px, 8vw, 100px) 0;
	}

	.timeline__head {
		text-align: center;
		margin-bottom: clamp(38px, 6vw, 68px);
	}

	.timeline__title {
		font-family: var(--serif);
		font-size: clamp(34px, 4.8vw, 60px);
		line-height: 1.05;
		margin-top: 14px;
		color: var(--ink);
	}

	.timeline__intro {
		max-width: 44ch;
		margin: 14px auto 0;
	}

	.timeline__flow {
		position: relative;
		max-width: 760px;
		margin: 0 auto;
		min-height: 740px;
	}

	/* Центральная извилистая направляющая SVG дорожка */
	.timeline__track {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 2;
	}

	.timeline__svg {
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	/* Перемещающееся сердечко на HTML слое — 100% защита от сплющивания */
	.timeline__heart-badge {
		position: absolute;
		width: 26px;
		height: 26px;
		display: grid;
		place-items: center;
		pointer-events: none;
		z-index: 5;
		filter: drop-shadow(0 2px 6px rgba(27, 48, 37, 0.28));
		transition: transform 0.08s linear;
		will-change: left, top, transform;
	}

	.timeline__heart-svg {
		width: 22px;
		height: 22px;
		display: block;
	}

	/* Список шагов: элегантная сетка из двух колонок */
	.timeline__steps {
		position: relative;
		z-index: 3;
		display: flex;
		flex-direction: column;
		gap: clamp(48px, 7vw, 96px);
	}

	.timeline__step {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: clamp(16px, 3.5vw, 44px);
		align-items: center;
	}

	/* Левый шаг */
	:global(.timeline__step--left .timeline__step-content) {
		grid-column: 1;
		text-align: right;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		padding-right: clamp(8px, 2vw, 22px);
	}

	:global(.timeline__step--left .timeline__sketch) {
		justify-content: flex-end;
	}

	/* Правый шаг */
	:global(.timeline__step--right .timeline__step-content) {
		grid-column: 2;
		text-align: left;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding-left: clamp(8px, 2vw, 22px);
	}

	:global(.timeline__step--right .timeline__sketch) {
		justify-content: flex-start;
	}

	/* Типографика этапа */
	.timeline__script-time {
		font-family: 'Marck Script', cursive, var(--serif);
		font-size: clamp(24px, 3.2vw, 36px);
		color: var(--pine);
		line-height: 1;
		margin-bottom: 4px;
	}

	.timeline__step-title {
		font-family: var(--serif);
		font-size: clamp(17px, 2.3vw, 28px);
		font-weight: 500;
		line-height: 1.18;
		color: var(--ink);
		margin-bottom: 6px;
	}

	.timeline__step-desc {
		font-size: clamp(12px, 1.4vw, 14px);
		line-height: 1.55;
		color: var(--ink-soft);
		max-width: 26ch;
	}

	/* Иллюстрация */
	.timeline__sketch {
		display: flex;
		width: 100%;
		margin-top: 10px;
	}

	/* Адаптив для маленьких мобильных экранов */
	@media (max-width: 480px) {
		.timeline {
			padding: 48px 0;
		}

		.timeline__steps {
			gap: 36px;
		}

		.timeline__step {
			gap: 12px;
		}

		:global(.timeline__step--left .timeline__step-content) {
			padding-right: 4px;
		}

		:global(.timeline__step--right .timeline__step-content) {
			padding-left: 4px;
		}
	}
</style>
