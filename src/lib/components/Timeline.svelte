<script lang="ts">
	import { onMount } from 'svelte';
	import { content } from '#lib/content.js';
	import { pick } from '#lib/i18n.svelte.js';
	import Reveal from './Reveal.svelte';

	let sectionEl = $state<HTMLElement | null>(null);
	let pathEl = $state<SVGPathElement | null>(null);

	let heartXPercent = $state(50);
	let heartYPercent = $state(2);
	let heartAngle = $state(0);
	let pathLength = $state(0);

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

		// Прогресс скролла: начинается когда секция начинает заходить в экран (75%),
		// и плавно доходит до 100% к моменту ухода секции
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

	onMount(() => {
		if (pathEl) {
			try {
				pathLength = pathEl.getTotalLength();
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
			if (pathEl) {
				try {
					pathLength = pathEl.getTotalLength();
				} catch {}
			}
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
			<!-- Центральная извилистая SVG дорожка -->
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
						d="M 50,20 C 76,120 76,230 50,350 C 24,470 24,580 50,700 C 76,820 76,910 50,980"
						stroke="#788f80"
						stroke-width="1.6"
						stroke-linecap="round"
						stroke-dasharray="4 5"
						opacity="0.8"
					/>
				</svg>

				<!-- Несжимаемое HTML сердечко (всегда сохраняет идеальные пропорции) -->
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
						<!-- Ореол цвета фона, чтобы пунктирная линия аккуратно прерывалась за сердечком -->
						<path
							d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
							stroke="#ffffff"
							stroke-width="3"
							stroke-linejoin="round"
						/>
						<path
							d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
							fill="#2b4334"
						/>
					</svg>
				</div>
			</div>

			<!-- Список этапов свадьбы: чередование слева и справа от центральной линии -->
			<div class="timeline__steps">
				{#each content.timeline.items as item, index (item.time)}
					{@const isEven = index % 2 === 0}
					<article
						class="timeline__step"
						class:timeline__step--left={isEven}
						class:timeline__step--right={!isEven}
					>
						<Reveal
							kind={isEven ? 'left' : 'right'}
							delay={index * 120}
							class="timeline__step-content"
						>
							<span class="timeline__script-time">{item.time}</span>
							<h3 class="timeline__step-title">{pick(item.title)}</h3>
							<p class="timeline__step-desc">{pick(item.text)}</p>

							<!-- Художественная скетч-иллюстрация -->
							<div class="timeline__sketch" aria-hidden="true">
								{#if index === 0}
									<!-- Скетч: Свадебная арка и молодожёны -->
									<svg viewBox="0 0 160 140" fill="none" class="sketch-svg">
										<path d="M 40,135 V 70 C 40,30 120,30 120,70 V 135" stroke="#718776" stroke-width="1.2" />
										<path d="M 35,135 H 125" stroke="#718776" stroke-width="1" />
										<path d="M 32,55 C 38,45 48,32 60,26 C 80,18 100,20 128,48" stroke="#5a7160" stroke-width="1.5" stroke-linecap="round" />
										<path d="M 48,28 C 44,22 46,16 52,18 C 58,20 54,28 48,28 Z" fill="#bfa15f" opacity="0.6" />
										<path d="M 80,18 C 76,12 84,8 88,14 C 92,20 84,22 80,18 Z" fill="#bfa15f" opacity="0.6" />
										<path d="M 112,32 C 118,28 122,34 116,40 C 110,46 106,36 112,32 Z" fill="#bfa15f" opacity="0.6" />
										<circle cx="70" cy="62" r="5" stroke="#3d5a49" stroke-width="1" />
										<path d="M 64,74 C 64,68 76,68 76,74 V 110 H 64 Z" stroke="#3d5a49" stroke-width="1" />
										<circle cx="88" cy="64" r="4.5" stroke="#3d5a49" stroke-width="1" />
										<path d="M 83,74 C 83,70 93,70 93,74 L 102,110 H 78 Z" stroke="#3d5a49" stroke-width="1" />
										<path d="M 85,62 C 96,62 100,75 104,92" stroke="#8c9c8e" stroke-width="0.8" stroke-dasharray="2 2" />
										<circle cx="80" cy="80" r="2.5" fill="#bfa15f" />
									</svg>
								{:else if index === 1}
									<!-- Скетч: Праздничный банкетный стол и бокалы -->
									<svg viewBox="0 0 160 140" fill="none" class="sketch-svg">
										<ellipse cx="80" cy="75" rx="46" ry="12" stroke="#718776" stroke-width="1.2" />
										<path d="M 34,75 C 34,95 44,125 44,130 H 116 C 116,125 126,95 126,75" stroke="#718776" stroke-width="1" />
										<path d="M 52,80 V 128 M 80,87 V 130 M 108,80 V 128" stroke="#8c9c8e" stroke-width="0.7" opacity="0.6" />
										<path d="M 62,56 V 68 M 58,68 H 66 M 60,56 C 58,50 66,50 64,56 Z" stroke="#3d5a49" stroke-width="1" />
										<path d="M 72,54 V 68 M 68,68 H 76 M 70,54 C 68,48 76,48 74,54 Z" stroke="#3d5a49" stroke-width="1" />
										<rect x="90" y="58" width="18" height="12" rx="1" stroke="#3d5a49" stroke-width="1" />
										<rect x="93" y="48" width="12" height="10" rx="1" stroke="#3d5a49" stroke-width="1" />
										<circle cx="99" cy="44" r="2" fill="#bfa15f" />
										<path d="M 78,56 C 75,44 85,42 82,34 C 80,42 90,46 82,56" stroke="#5a7160" stroke-width="1.2" />
									</svg>
								{:else}
									<!-- Скетч: Вечерняя арка с гирляндами и звёздами -->
									<svg viewBox="0 0 160 140" fill="none" class="sketch-svg">
										<path d="M 35,135 V 60 C 35,25 125,25 125,60 V 135" stroke="#718776" stroke-width="1.2" />
										<path d="M 38,50 Q 80,72 122,50" stroke="#8c9c8e" stroke-width="0.9" />
										<path d="M 44,65 Q 80,88 116,65" stroke="#8c9c8e" stroke-width="0.9" stroke-dasharray="2 3" />
										<circle cx="58" cy="58" r="2.5" fill="#bfa15f" />
										<circle cx="80" cy="68" r="3" fill="#bfa15f" />
										<circle cx="102" cy="58" r="2.5" fill="#bfa15f" />
										<path d="M 80,25 V 42 M 72,42 H 88 L 80,50 Z" stroke="#3d5a49" stroke-width="1" />
										<circle cx="76" cy="88" r="4" stroke="#3d5a49" stroke-width="1" />
										<circle cx="86" cy="90" r="3.5" stroke="#3d5a49" stroke-width="1" />
										<path d="M 72,98 C 72,94 80,94 80,98 L 78,124 H 70 Z" stroke="#3d5a49" stroke-width="1" />
										<path d="M 83,98 C 83,95 91,95 91,98 L 97,124 H 80 Z" stroke="#3d5a49" stroke-width="1" />
									</svg>
								{/if}
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

	.sketch-svg {
		width: clamp(88px, 18vw, 150px);
		height: auto;
		opacity: 0.9;
		transition: transform 0.4s var(--ease), opacity 0.4s var(--ease);
	}

	.timeline__step:hover .sketch-svg {
		transform: scale(1.05);
		opacity: 1;
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

		.sketch-svg {
			width: clamp(78px, 24vw, 105px);
		}
	}
</style>
