<script lang="ts">
	import { onMount } from 'svelte';
	import { content } from '#lib/content.js';
	import { pick } from '#lib/i18n.svelte.js';
	import Reveal from './Reveal.svelte';
	import TimelineSketch from './TimelineSketch.svelte';
	import { detectTimelineIcon, generateTimelinePath } from '#lib/timeline.js';

	let sectionEl = $state<HTMLElement | null>(null);
	let trackEl = $state<HTMLElement | null>(null);
	let pathEl = $state<SVGPathElement | null>(null);
	let heartBadgeEl = $state<HTMLElement | null>(null);

	const items = $derived(content.timeline.items);
	const pathD = $derived.by(() => generateTimelinePath(items.length));

	type CachePoint = { normX: number; normY: number; angle: number };
	let cachedPoints: CachePoint[] = [];
	let trackWidth = 0;
	let trackHeight = 0;

	// Сглаженное кинематографичное перемещение сердечка (Smooth Glide / Inertial Lerp)
	// Исключает телепортацию при быстром скролле или резких свайпах: сердечко непрерывно
	// пролетает по изгибам кривой на высокой скорости, сохраняя физику скольжения.
	let currentProgress = 0;
	let targetProgress = 0;
	let isInitialized = false;
	let rafId: number | null = null;
	let lastTimestamp = 0;

	// Предварительный расчет ключевых точек траектории (Lookup Table).
	// Выполняется строго 1 раз при монтировании или смене пунктов расписания.
	function buildPathCache() {
		if (!pathEl) return;

		try {
			const pathLen = pathEl.getTotalLength();
			if (pathLen > 0) {
				const samples = 150;
				const points: CachePoint[] = [];
				for (let i = 0; i <= samples; i++) {
					const dist = (i / samples) * pathLen;
					const pt = pathEl.getPointAtLength(dist);
					const pAhead = pathEl.getPointAtLength(Math.min(pathLen, dist + 4));
					const pBehind = pathEl.getPointAtLength(Math.max(0, dist - 4));
					const dx = pAhead.x - pBehind.x;
					const dy = (pAhead.y - pBehind.y) * 0.25;
					const rad = Math.atan2(dx, dy);
					const angle = Math.max(-20, Math.min(20, (rad * 180) / Math.PI));

					points.push({
						normX: pt.x / 100, // viewBox 0..100
						normY: pt.y / 1000, // viewBox 0..1000
						angle
					});
				}
				cachedPoints = points;
			}
		} catch {
			// fallback
		}
	}

	function updateTrackDimensions() {
		if (!trackEl) return;
		trackWidth = trackEl.clientWidth;
		trackHeight = trackEl.clientHeight;
	}

	// Отрисовка положения сердечка по нормализованному прогрессу (0..1)
	function renderHeart(p: number) {
		if (!heartBadgeEl || cachedPoints.length === 0 || trackWidth === 0 || trackHeight === 0) return;

		const samples = cachedPoints.length - 1;
		const exactIndex = p * samples;
		const i0 = Math.floor(exactIndex);
		const i1 = Math.min(samples, i0 + 1);
		const t = exactIndex - i0;

		const p0 = cachedPoints[i0];
		const p1 = cachedPoints[i1];

		const normX = p0.normX + (p1.normX - p0.normX) * t;
		const normY = p0.normY + (p1.normY - p0.normY) * t;
		const angle = p0.angle + (p1.angle - p0.angle) * t;

		const px = normX * trackWidth;
		const py = normY * trackHeight;

		heartBadgeEl.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0) translate(-50%, -50%) rotate(${angle.toFixed(1)}deg)`;
	}

	// Плавная интерполяция к целевой позиции с адаптацией под частоту экрана (60Hz / 120Hz ProMotion)
	function tick(timestamp: number) {
		if (!lastTimestamp) lastTimestamp = timestamp;
		const dt = Math.min(48, Math.max(1, timestamp - lastTimestamp));
		lastTimestamp = timestamp;

		const diff = targetProgress - currentProgress;

		// Когда расстояние меньше 0.0005, мгновенно причаливаем и выключаем анимацию
		if (Math.abs(diff) < 0.0005) {
			currentProgress = targetProgress;
			renderHeart(currentProgress);
			rafId = null;
			lastTimestamp = 0;
			return;
		}

		// Экспоненциальное затухание (lambda = 20):
		// - при медленном скролле: неотрывно следует за пальцем без видимого отставания
		// - при быстром скролле/свайпе: сердечко быстро и грациозно скользит по изгибам кривой вместо телепортации
		const factor = 1 - Math.exp((-20 * dt) / 1000);
		currentProgress += diff * factor;

		renderHeart(currentProgress);

		rafId = requestAnimationFrame(tick);
	}

	function startGlide() {
		if (rafId === null) {
			lastTimestamp = performance.now();
			rafId = requestAnimationFrame(tick);
		}
	}

	// Расчёт целевой позиции сердечка от текущего скролла
	function updateTarget() {
		if (!sectionEl) return;
		const rect = sectionEl.getBoundingClientRect();
		const vh = window.innerHeight;

		// Сердечко начинает движение, когда верх секции входит в нижнюю четверть экрана
		const start = vh * 0.75;
		// Завершает путь, когда нижняя часть секции приближается к центру экрана
		const end = -(rect.height - vh * 0.5);
		const travel = start - end;
		const current = start - rect.top;

		const newTarget = Math.max(0, Math.min(1, current / Math.max(1, travel)));

		// При первом запуске сразу позиционируем сердечко без задержек
		if (!isInitialized) {
			targetProgress = newTarget;
			currentProgress = newTarget;
			isInitialized = true;
			renderHeart(currentProgress);
			return;
		}

		// Если позиция за пределами секции (0 или 1) и не менялась, и анимация не идёт — ничего не делаем
		if (newTarget === targetProgress && rafId === null) {
			return;
		}

		targetProgress = newTarget;
		startGlide();
	}

	$effect(() => {
		// При изменении количества пунктов или траектории перестраиваем кэш
		pathD;
		items.length;
		requestAnimationFrame(() => {
			buildPathCache();
			updateTrackDimensions();
			renderHeart(currentProgress);
		});
	});

	onMount(() => {
		buildPathCache();
		updateTrackDimensions();
		updateTarget();

		// Повторный замер после стабилизации шрифтов и сетки
		requestAnimationFrame(() => {
			buildPathCache();
			updateTrackDimensions();
			updateTarget();
		});

		const onScroll = () => {
			updateTarget();
		};

		const onResize = () => {
			updateTrackDimensions();
			renderHeart(currentProgress);
		};

		// ResizeObserver отслеживает ТОЛЬКО размеры трека без тяжелых расчетов SVG
		let ro: ResizeObserver | null = null;
		if (typeof ResizeObserver !== 'undefined' && trackEl) {
			ro = new ResizeObserver(() => {
				updateTrackDimensions();
				renderHeart(currentProgress);
			});
			ro.observe(trackEl);
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
			<!-- Центральная динамическая SVG дорожка -->
			<div class="timeline__track" bind:this={trackEl} aria-hidden="true">
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

				<!-- Аппаратно-ускоренное HTML сердечко (GPU 60/120fps на iOS Safari без задержек) -->
				<div
					bind:this={heartBadgeEl}
					class="timeline__heart-badge"
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
						<!-- Мягкая векторная тень без тяжелых CSS-фильтров (работает на 120 FPS без просадок) -->
						<path
							d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
							fill="#1b3025"
							opacity="0.18"
							transform="translate(0, 1.5)"
						/>
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

							<!-- Художественная авторская скетч-иллюстрация -->
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

	/* Перемещающееся сердечко на HTML слое — аппаратное GPU-ускорение без лагов на iPhone */
	.timeline__heart-badge {
		position: absolute;
		top: 0;
		left: 0;
		width: 26px;
		height: 26px;
		display: grid;
		place-items: center;
		pointer-events: none;
		z-index: 5;
		will-change: transform;
		transform: translate3d(50px, 20px, 0) translate(-50%, -50%);
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
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
