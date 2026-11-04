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
			<!-- Центральная извилистая шелковистая SVG дорожка (ровная, непрерывная, без искажённого пунктира) -->
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
						stroke="#8aa192"
						stroke-width="1.3"
						stroke-linecap="round"
						vector-effect="non-scaling-stroke"
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

							<!-- Художественная авторская скетч-иллюстрация -->
							<div class="timeline__sketch" aria-hidden="true">
								{#if index === 0}
									<!-- 1. ЦЕРЕМОНИЯ: Свадебная арка с драпировкой, эвкалиптом и обручальными кольцами -->
									<svg viewBox="0 0 160 150" fill="none" class="sketch-svg" xmlns="http://www.w3.org/2000/svg">
										<!-- Линия подиума -->
										<path d="M 24,142 H 136" stroke="#718776" stroke-width="1" stroke-linecap="round" opacity="0.6" />
										<path d="M 32,145 H 128" stroke="#718776" stroke-width="0.7" stroke-linecap="round" opacity="0.35" />

										<!-- Классическая арка -->
										<path d="M 38,142 V 58 C 38,24 122,24 122,58 V 142" stroke="#4d6756" stroke-width="1.3" stroke-linecap="round" />
										<path d="M 44,142 V 60 C 44,32 116,32 116,60 V 142" stroke="#718776" stroke-width="0.8" opacity="0.45" />

										<!-- Капители и базы колонн -->
										<rect x="34" y="138" width="8" height="4" rx="0.5" stroke="#4d6756" stroke-width="1" fill="#fcfbf8" />
										<rect x="118" y="138" width="8" height="4" rx="0.5" stroke="#4d6756" stroke-width="1" fill="#fcfbf8" />
										<rect x="34" y="56" width="8" height="3" rx="0.5" stroke="#4d6756" stroke-width="0.9" fill="#fcfbf8" />
										<rect x="118" y="56" width="8" height="3" rx="0.5" stroke="#4d6756" stroke-width="0.9" fill="#fcfbf8" />

										<!-- Шифоновая драпировка ткани -->
										<path d="M 38,58 Q 80,78 122,58" stroke="#688373" stroke-width="1.1" stroke-linecap="round" />
										<path d="M 40,65 Q 80,85 120,65" stroke="#8fa699" stroke-width="0.8" stroke-dasharray="2 3" opacity="0.7" />
										<path d="M 38,58 C 34,75 32,100 34,138" stroke="#688373" stroke-width="0.9" stroke-linecap="round" />
										<path d="M 122,58 C 126,75 128,100 126,138" stroke="#688373" stroke-width="0.9" stroke-linecap="round" />

										<!-- Ботаническая гирлянда эвкалипта -->
										<path d="M 28,68 C 32,44 46,26 68,20 C 90,14 114,22 130,46" stroke="#415949" stroke-width="1.4" stroke-linecap="round" />
										<!-- Листья эвкалипта -->
										<path d="M 34,54 C 27,51 25,43 30,38 C 35,43 36,50 34,54 Z" fill="#607b6a" opacity="0.75" />
										<path d="M 44,40 C 38,36 38,28 44,24 C 49,29 48,37 44,40 Z" fill="#607b6a" opacity="0.75" />
										<path d="M 58,26 C 54,20 56,12 63,11 C 66,18 63,24 58,26 Z" fill="#607b6a" opacity="0.75" />
										<path d="M 76,18 C 74,11 79,5 86,6 C 87,13 82,18 76,18 Z" fill="#607b6a" opacity="0.75" />
										<path d="M 96,18 C 96,11 103,7 108,10 C 107,17 101,20 96,18 Z" fill="#607b6a" opacity="0.75" />
										<path d="M 116,28 C 119,22 126,21 129,26 C 126,32 120,32 116,28 Z" fill="#607b6a" opacity="0.75" />
										<path d="M 126,44 C 132,40 137,44 135,50 C 129,52 126,47 126,44 Z" fill="#607b6a" opacity="0.75" />

										<!-- Золотые бутоны цветов -->
										<circle cx="50" cy="30" r="3.2" fill="#bfa15f" opacity="0.85" />
										<circle cx="50" cy="30" r="1.8" fill="#ffffff" opacity="0.6" />
										<circle cx="88" cy="18" r="3.5" fill="#bfa15f" opacity="0.85" />
										<circle cx="88" cy="18" r="2" fill="#ffffff" opacity="0.6" />
										<circle cx="120" cy="36" r="3" fill="#bfa15f" opacity="0.85" />
										<circle cx="120" cy="36" r="1.6" fill="#ffffff" opacity="0.6" />
										<circle cx="34" cy="62" r="2.5" fill="#bfa15f" opacity="0.75" />

										<!-- Пьедестал для колец -->
										<path d="M 72,142 H 88" stroke="#4d6756" stroke-width="1.2" stroke-linecap="round" />
										<path d="M 78,142 V 104 H 82 V 142" stroke="#718776" stroke-width="0.9" fill="#fcfbf8" />
										<ellipse cx="80" cy="104" rx="14" ry="3.5" stroke="#4d6756" stroke-width="1.1" fill="#ffffff" />

										<!-- Двойные переплетённые свадебные кольца с сиянием -->
										<circle cx="77" cy="94" r="5.5" stroke="#bfa15f" stroke-width="1.3" fill="none" />
										<circle cx="83" cy="94" r="5.5" stroke="#bfa15f" stroke-width="1.3" fill="none" />
										<path d="M 77,85 V 91 M 74,88 H 80" stroke="#bfa15f" stroke-width="1" stroke-linecap="round" />
										<circle cx="77" cy="88" r="1" fill="#ffffff" />
									</svg>
								{:else if index === 1}
									<!-- 2. БАНКЕТ: Свадебный торт, звон хрустальных бокалов и золотые искры -->
									<svg viewBox="0 0 160 150" fill="none" class="sketch-svg" xmlns="http://www.w3.org/2000/svg">
										<path d="M 20,142 H 140" stroke="#718776" stroke-width="1" stroke-linecap="round" opacity="0.6" />

										<!-- Трёхъярусный торт на хрустальной подставке -->
										<path d="M 34,142 H 58" stroke="#4d6756" stroke-width="1.2" stroke-linecap="round" />
										<path d="M 44,142 V 132 H 48 V 142" stroke="#718776" stroke-width="0.9" fill="#fcfbf8" />
										<ellipse cx="46" cy="132" rx="20" ry="3.5" stroke="#4d6756" stroke-width="1.1" fill="#ffffff" />

										<!-- Ярусы торта -->
										<rect x="30" y="110" width="32" height="20" rx="1.5" stroke="#4d6756" stroke-width="1.2" fill="#ffffff" />
										<path d="M 30,122 H 62" stroke="#8fa699" stroke-width="0.7" stroke-dasharray="2 2" />
										<rect x="35" y="92" width="22" height="18" rx="1.5" stroke="#4d6756" stroke-width="1.2" fill="#ffffff" />
										<path d="M 35,102 H 57" stroke="#8fa699" stroke-width="0.7" stroke-dasharray="2 2" />
										<rect x="40" y="78" width="12" height="14" rx="1" stroke="#4d6756" stroke-width="1.2" fill="#ffffff" />

										<!-- Цветочный каскад на торте -->
										<path d="M 34,128 Q 44,116 38,104 Q 46,96 42,86" stroke="#415949" stroke-width="1.1" stroke-linecap="round" />
										<circle cx="35" cy="126" r="2.2" fill="#bfa15f" />
										<circle cx="44" cy="112" r="2.2" fill="#bfa15f" />
										<circle cx="39" cy="98" r="2" fill="#bfa15f" />
										<circle cx="46" cy="76" r="2.5" fill="#bfa15f" />
										<!-- Топпер сердечко -->
										<path d="M 46,74 C 44,71 42,72 42,74 C 42,76 46,78 46,78 C 46,78 50,76 50,74 C 50,72 48,71 46,74 Z" fill="#bfa15f" />

										<!-- Пара бокалов шампанского в тосте -->
										<!-- Левый бокал -->
										<g transform="translate(94, 60) rotate(10)">
											<path d="M -6,-28 C -6,-6 0,0 0,0 C 0,0 6,-6 6,-28 Z" stroke="#415949" stroke-width="1.2" fill="#ffffff" />
											<path d="M -5,-16 Q 0,-14 5,-16" stroke="#bfa15f" stroke-width="0.9" opacity="0.85" />
											<path d="M 0,0 V 38" stroke="#415949" stroke-width="1.1" />
											<ellipse cx="0" cy="38" rx="9" ry="2.5" stroke="#415949" stroke-width="1" fill="#fcfbf8" />
										</g>

										<!-- Правый бокал -->
										<g transform="translate(122, 60) rotate(-10)">
											<path d="M -6,-28 C -6,-6 0,0 0,0 C 0,0 6,-6 6,-28 Z" stroke="#415949" stroke-width="1.2" fill="#ffffff" />
											<path d="M -5,-16 Q 0,-14 5,-16" stroke="#bfa15f" stroke-width="0.9" opacity="0.85" />
											<path d="M 0,0 V 38" stroke="#415949" stroke-width="1.1" />
											<ellipse cx="0" cy="38" rx="9" ry="2.5" stroke="#415949" stroke-width="1" fill="#fcfbf8" />
										</g>

										<!-- Искорки звона бокалов -->
										<path d="M 108,24 V 16 M 104,20 H 112" stroke="#bfa15f" stroke-width="1.2" stroke-linecap="round" />
										<path d="M 102,14 L 105,17 M 114,14 L 111,17" stroke="#bfa15f" stroke-width="1" stroke-linecap="round" />
										<circle cx="108" cy="20" r="1.5" fill="#ffffff" stroke="#bfa15f" stroke-width="0.8" />

										<!-- Пузырьки шампанского -->
										<circle cx="106" cy="32" r="1.4" fill="#bfa15f" opacity="0.85" />
										<circle cx="112" cy="28" r="1.2" fill="#bfa15f" opacity="0.75" />
										<circle cx="100" cy="38" r="1.6" fill="#bfa15f" opacity="0.65" />
										<circle cx="116" cy="36" r="1.3" fill="#bfa15f" opacity="0.8" />
										<circle cx="108" cy="44" r="1.5" fill="#bfa15f" opacity="0.7" />

										<!-- Эвкалиптовая веточка -->
										<path d="M 80,140 C 95,136 115,138 135,132" stroke="#415949" stroke-width="1.1" stroke-linecap="round" />
										<path d="M 94,137 C 90,132 94,126 100,128 C 100,134 96,137 94,137 Z" fill="#607b6a" opacity="0.7" />
										<path d="M 112,136 C 110,129 116,124 122,126 C 121,133 115,136 112,136 Z" fill="#607b6a" opacity="0.7" />
										<circle cx="128" cy="132" r="2" fill="#bfa15f" opacity="0.85" />
									</svg>
								{:else}
									<!-- 3. ФИНАЛ ВЕЧЕРА: Уютный стеклянный фонарь со свечой, бенгальские огни, полумесяц и звёзды -->
									<svg viewBox="0 0 160 150" fill="none" class="sketch-svg" xmlns="http://www.w3.org/2000/svg">
										<path d="M 24,142 H 136" stroke="#718776" stroke-width="1" stroke-linecap="round" opacity="0.6" />

										<!-- Старинный фонарь -->
										<rect x="66" y="136" width="28" height="6" rx="1" stroke="#4d6756" stroke-width="1.2" fill="#fcfbf8" />
										<path d="M 69,136 L 73,86 H 87 L 91,136 Z" stroke="#4d6756" stroke-width="1.2" fill="#ffffff" />
										<path d="M 80,86 V 136" stroke="#718776" stroke-width="0.8" opacity="0.6" />
										<path d="M 71,86 L 80,72 L 89,86 Z" stroke="#4d6756" stroke-width="1.2" fill="#fcfbf8" />
										<circle cx="80" cy="68" r="4" stroke="#4d6756" stroke-width="1.1" fill="none" />

										<!-- Свеча внутри фонаря -->
										<rect x="76" y="108" width="8" height="24" rx="1" stroke="#718776" stroke-width="0.9" fill="#fcfbf8" />
										<path d="M 80,108 V 104" stroke="#415949" stroke-width="1" />
										<path d="M 80,104 C 78,101 78,97 80,94 C 82,97 82,101 80,104 Z" fill="#bfa15f" />
										<circle cx="80" cy="99" r="8" stroke="#bfa15f" stroke-width="0.6" stroke-dasharray="1 2" opacity="0.6" />

										<!-- Левый бенгальский огонь с искрами -->
										<path d="M 38,138 L 48,94" stroke="#4d6756" stroke-width="1.2" stroke-linecap="round" />
										<path d="M 48,84 V 74 M 48,104 V 114 M 38,94 H 28 M 58,94 H 68" stroke="#bfa15f" stroke-width="1.1" stroke-linecap="round" />
										<path d="M 41,87 L 34,80 M 55,101 L 62,108 M 41,101 L 34,108 M 55,87 L 62,80" stroke="#bfa15f" stroke-width="0.9" stroke-linecap="round" />
										<circle cx="48" cy="94" r="2.5" fill="#ffffff" stroke="#bfa15f" stroke-width="1" />

										<!-- Правый бенгальский огонь с искрами -->
										<path d="M 122,138 L 112,94" stroke="#4d6756" stroke-width="1.2" stroke-linecap="round" />
										<path d="M 112,84 V 74 M 112,104 V 114 M 102,94 H 92 M 122,94 H 132" stroke="#bfa15f" stroke-width="1.1" stroke-linecap="round" />
										<path d="M 105,87 L 98,80 M 119,101 L 126,108 M 105,101 L 98,108 M 119,87 L 126,80" stroke="#bfa15f" stroke-width="0.9" stroke-linecap="round" />
										<circle cx="112" cy="94" r="2.5" fill="#ffffff" stroke="#bfa15f" stroke-width="1" />

										<!-- Полумесяц -->
										<path d="M 124,20 C 117,23 114,31 116,38 C 118,44 124,49 131,48 C 122,48 116,38 120,28 C 122,24 124,20 124,20 Z" fill="#bfa15f" opacity="0.9" />

										<!-- Сияющие звёзды -->
										<g transform="translate(42, 28)">
											<path d="M 0,-6 V 6 M -6,0 H 6" stroke="#bfa15f" stroke-width="1" stroke-linecap="round" />
											<circle cx="0" cy="0" r="1.2" fill="#ffffff" />
										</g>
										<g transform="translate(78, 22)">
											<path d="M 0,-8 V 8 M -8,0 H 8" stroke="#bfa15f" stroke-width="1.1" stroke-linecap="round" />
											<circle cx="0" cy="0" r="1.5" fill="#ffffff" />
										</g>
										<g transform="translate(98, 42)">
											<path d="M 0,-5 V 5 M -5,0 H 5" stroke="#bfa15f" stroke-width="0.9" stroke-linecap="round" />
											<circle cx="0" cy="0" r="1" fill="#ffffff" />
										</g>

										<!-- Хвойные ветви у основания -->
										<path d="M 30,140 C 44,135 56,139 66,141" stroke="#415949" stroke-width="1" stroke-linecap="round" />
										<path d="M 94,141 C 104,139 116,135 130,140" stroke="#415949" stroke-width="1" stroke-linecap="round" />
										<circle cx="36" cy="136" r="1.6" fill="#bfa15f" />
										<circle cx="124" cy="136" r="1.6" fill="#bfa15f" />
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
		width: clamp(92px, 18vw, 145px);
		height: auto;
		opacity: 0.92;
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
			width: clamp(82px, 24vw, 110px);
		}
	}
</style>
