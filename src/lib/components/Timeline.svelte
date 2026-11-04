<script lang="ts">
	import { onMount } from 'svelte';
	import { content } from '#lib/content.js';
	import { pick } from '#lib/i18n.svelte.js';
	import Reveal from './Reveal.svelte';

	let sectionEl = $state<HTMLElement | null>(null);
	let pathEl = $state<SVGPathElement | null>(null);

	let heartX = $state(100);
	let heartY = $state(30);
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

		// Прогресс скролла: начинается когда верх секции на середине экрана,
		// и завершается когда низ секции уходит выше середины экрана
		const startY = viewportH * 0.65;
		const endY = viewportH * 0.35;
		const totalDistance = rect.height + (startY - endY);
		const currentDistance = startY - rect.top;

		const progress = Math.max(0, Math.min(1, currentDistance / totalDistance));

		try {
			const point = pathEl.getPointAtLength(progress * pathLength);
			heartX = point.x;
			heartY = point.y;
		} catch {
			// fallback
		}
	}

	onMount(() => {
		if (pathEl) {
			try {
				pathLength = pathEl.getTotalLength();
				const initialPoint = pathEl.getPointAtLength(0);
				heartX = initialPoint.x;
				heartY = initialPoint.y;
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

		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
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
			<!-- Центральная извилистая SVG линия с бегущим сердечком -->
			<div class="timeline__track" aria-hidden="true">
				<svg
					class="timeline__svg"
					viewBox="0 0 200 900"
					preserveAspectRatio="none"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<!-- Извилистая направляющая дорожка -->
					<path
						bind:this={pathEl}
						class="timeline__path"
						d="M 100,20 C 25,140 25,240 100,320 C 175,400 175,500 100,580 C 25,660 25,760 100,880"
						stroke="#8c9c8e"
						stroke-width="1.8"
						stroke-linecap="round"
						stroke-dasharray="4 4"
						opacity="0.85"
					/>

					<!-- Перемещающееся сердечко на линии -->
					<g
						class="timeline__heart-group"
						transform="translate({heartX}, {heartY})"
					>
						<circle cx="0" cy="0" r="14" fill="#fdfbf7" stroke="#3d5a49" stroke-width="1.2" opacity="0.9" />
						<path
							d="M 0,5 C -0.3,4.7 -5,0.6 -5,-2.5 C -5,-4.4 -3.4,-6 -1.5,-6 C -0.4,-6 0.7,-5.4 1.2,-4.5 C 1.7,-5.4 2.8,-6 3.9,-6 C 5.8,-6 7.4,-4.4 7.4,-2.5 C 7.4,0.6 2.7,4.7 2.4,5 L 1.2,6.2 Z"
							transform="scale(1.1) translate(-1.2, 0)"
							fill="#2d4739"
						/>
					</g>
				</svg>
			</div>

			<!-- Список этапов свадьбы -->
			<div class="timeline__steps">
				{#each content.timeline.items as item, index (item.time)}
					{@const isEven = index % 2 === 0}
					<article
						class="timeline__step"
						class:timeline__step--left={isEven}
						class:timeline__step--right={!isEven}
					>
						<!-- Текстовый блок этапа -->
						<div class="timeline__card">
							<span class="timeline__script-time">{item.time}</span>
							<h3 class="timeline__step-title">{pick(item.title)}</h3>
							<p class="timeline__step-desc">{pick(item.text)}</p>
						</div>

						<!-- Художественная скетч-иллюстрация -->
						<div class="timeline__sketch" aria-hidden="true">
							{#if index === 0}
								<!-- Скетч: Свадебная арка и молодожёны -->
								<svg viewBox="0 0 160 140" fill="none" class="sketch-svg">
									<!-- Арка -->
									<path d="M 40,135 V 70 C 40,30 120,30 120,70 V 135" stroke="#718776" stroke-width="1.2" />
									<path d="M 35,135 H 125" stroke="#718776" stroke-width="1" />
									<!-- Лианы и цветы на арке -->
									<path d="M 32,55 C 38,45 48,32 60,26 C 80,18 100,20 128,48" stroke="#5a7160" stroke-width="1.5" stroke-linecap="round" />
									<path d="M 48,28 C 44,22 46,16 52,18 C 58,20 54,28 48,28 Z" fill="#bfa15f" opacity="0.6" />
									<path d="M 80,18 C 76,12 84,8 88,14 C 92,20 84,22 80,18 Z" fill="#bfa15f" opacity="0.6" />
									<path d="M 112,32 C 118,28 122,34 116,40 C 110,46 106,36 112,32 Z" fill="#bfa15f" opacity="0.6" />
									<!-- Невеста и жених (элегантный контур) -->
									<!-- Жених -->
									<circle cx="70" cy="62" r="5" stroke="#3d5a49" stroke-width="1" />
									<path d="M 64,74 C 64,68 76,68 76,74 V 110 H 64 Z" stroke="#3d5a49" stroke-width="1" />
									<!-- Невеста -->
									<circle cx="88" cy="64" r="4.5" stroke="#3d5a49" stroke-width="1" />
									<path d="M 83,74 C 83,70 93,70 93,74 L 102,110 H 78 Z" stroke="#3d5a49" stroke-width="1" />
									<!-- Букет и фата -->
									<path d="M 85,62 C 96,62 100,75 104,92" stroke="#8c9c8e" stroke-width="0.8" stroke-dasharray="2 2" />
									<circle cx="80" cy="80" r="2.5" fill="#bfa15f" />
								</svg>
							{:else if index === 1}
								<!-- Скетч: Праздничный банкетный стол и бокалы -->
								<svg viewBox="0 0 160 140" fill="none" class="sketch-svg">
									<!-- Стол с драпировкой -->
									<ellipse cx="80" cy="75" rx="46" ry="12" stroke="#718776" stroke-width="1.2" />
									<path d="M 34,75 C 34,95 44,125 44,130 H 116 C 116,125 126,95 126,75" stroke="#718776" stroke-width="1" />
									<path d="M 52,80 V 128 M 80,87 V 130 M 108,80 V 128" stroke="#8c9c8e" stroke-width="0.7" opacity="0.6" />
									<!-- Бокалы с шампанским -->
									<path d="M 62,56 V 68 M 58,68 H 66 M 60,56 C 58,50 66,50 64,56 Z" stroke="#3d5a49" stroke-width="1" />
									<path d="M 72,54 V 68 M 68,68 H 76 M 70,54 C 68,48 76,48 74,54 Z" stroke="#3d5a49" stroke-width="1" />
									<!-- Ярусная ваза / свадебный торт -->
									<rect x="90" y="58" width="18" height="12" rx="1" stroke="#3d5a49" stroke-width="1" />
									<rect x="93" y="48" width="12" height="10" rx="1" stroke="#3d5a49" stroke-width="1" />
									<circle cx="99" cy="44" r="2" fill="#bfa15f" />
									<!-- Цветочная композиция в центре -->
									<path d="M 78,56 C 75,44 85,42 82,34 C 80,42 90,46 82,56" stroke="#5a7160" stroke-width="1.2" />
								</svg>
							{:else}
								<!-- Скетч: Вечерняя арка с гирляндами и звёздами -->
								<svg viewBox="0 0 160 140" fill="none" class="sketch-svg">
									<path d="M 35,135 V 60 C 35,25 125,25 125,60 V 135" stroke="#718776" stroke-width="1.2" />
									<!-- Подвесные гирлянды с огоньками -->
									<path d="M 38,50 Q 80,72 122,50" stroke="#8c9c8e" stroke-width="0.9" />
									<path d="M 44,65 Q 80,88 116,65" stroke="#8c9c8e" stroke-width="0.9" stroke-dasharray="2 3" />
									<!-- Сияющие огоньки / звёздочки -->
									<circle cx="58" cy="58" r="2.5" fill="#bfa15f" />
									<circle cx="80" cy="68" r="3" fill="#bfa15f" />
									<circle cx="102" cy="58" r="2.5" fill="#bfa15f" />
									<!-- Люстра / вечерний свет -->
									<path d="M 80,25 V 42 M 72,42 H 88 L 80,50 Z" stroke="#3d5a49" stroke-width="1" />
									<!-- Танцующая пара силуэтом -->
									<circle cx="76" cy="88" r="4" stroke="#3d5a49" stroke-width="1" />
									<circle cx="86" cy="90" r="3.5" stroke="#3d5a49" stroke-width="1" />
									<path d="M 72,98 C 72,94 80,94 80,98 L 78,124 H 70 Z" stroke="#3d5a49" stroke-width="1" />
									<path d="M 83,98 C 83,95 91,95 91,98 L 97,124 H 80 Z" stroke="#3d5a49" stroke-width="1" />
								</svg>
							{/if}
						</div>
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
		margin-bottom: clamp(40px, 6vw, 70px);
	}

	.timeline__title {
		font-size: clamp(38px, 5.2vw, 68px);
		margin-top: 14px;
	}

	.timeline__intro {
		max-width: 44ch;
		margin: 14px auto 0;
	}

	.timeline__flow {
		position: relative;
		max-width: 820px;
		margin: 0 auto;
		min-height: 820px;
	}

	/* Центральная извилистая SVG дорожка */
	.timeline__track {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 140px;
		height: 100%;
		pointer-events: none;
		z-index: 2;
	}

	.timeline__svg {
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	.timeline__heart-group {
		transition: transform 0.1s linear;
		filter: drop-shadow(0 2px 6px rgba(35, 58, 46, 0.25));
	}

	/* Список шагов */
	.timeline__steps {
		position: relative;
		z-index: 3;
		display: flex;
		flex-direction: column;
		gap: clamp(60px, 9vw, 120px);
	}

	.timeline__step {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: clamp(40px, 8vw, 100px);
		align-items: center;
	}

	/* Чередование лево / право */
	.timeline__step--left .timeline__card {
		order: 1;
		text-align: right;
		padding-right: 20px;
	}

	.timeline__step--left .timeline__sketch {
		order: 2;
		justify-content: flex-start;
		padding-left: 20px;
	}

	.timeline__step--right .timeline__card {
		order: 2;
		text-align: left;
		padding-left: 20px;
	}

	.timeline__step--right .timeline__sketch {
		order: 1;
		justify-content: flex-end;
		padding-right: 20px;
	}

	/* Карточка с временем и названием */
	.timeline__card {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.timeline__script-time {
		font-family: 'Marck Script', cursive, var(--serif);
		font-size: clamp(26px, 3.4vw, 36px);
		color: var(--pine-deep);
		line-height: 1;
		margin-bottom: 6px;
	}

	.timeline__step-title {
		font-family: var(--serif);
		font-size: clamp(22px, 2.6vw, 32px);
		font-weight: 500;
		line-height: 1.15;
		color: var(--ink);
		margin-bottom: 8px;
	}

	.timeline__step-desc {
		font-size: 14px;
		line-height: 1.6;
		color: var(--ink-soft);
		max-width: 32ch;
	}

	.timeline__step--left .timeline__step-desc {
		margin-left: auto;
	}

	.timeline__step--right .timeline__step-desc {
		margin-right: auto;
	}

	/* Блок с иллюстрацией-скетчем */
	.timeline__sketch {
		display: flex;
		align-items: center;
	}

	.sketch-svg {
		width: clamp(120px, 16vw, 160px);
		height: auto;
		opacity: 0.88;
		transition: transform 0.4s var(--ease), opacity 0.4s var(--ease);
	}

	.timeline__step:hover .sketch-svg {
		transform: scale(1.05);
		opacity: 1;
	}

	/* Адаптив для планшетов и мобильных устройств */
	@media (max-width: 680px) {
		.timeline__flow {
			min-height: auto;
		}

		.timeline__track {
			left: 24px;
			transform: none;
			width: 60px;
		}

		.timeline__steps {
			gap: 48px;
		}

		.timeline__step {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			padding-left: 64px;
			gap: 16px;
		}

		.timeline__step--left .timeline__card,
		.timeline__step--right .timeline__card {
			order: 1;
			text-align: left;
			padding: 0;
		}

		.timeline__step--left .timeline__step-desc,
		.timeline__step--right .timeline__step-desc {
			margin-left: 0;
			margin-right: 0;
		}

		.timeline__step--left .timeline__sketch,
		.timeline__step--right .timeline__sketch {
			order: 2;
			padding: 0;
			justify-content: flex-start;
		}

		.sketch-svg {
			width: 110px;
		}
	}
</style>
