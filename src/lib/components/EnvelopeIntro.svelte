<script lang="ts">
	import { onMount } from 'svelte';

	type Props = {
		forceShow?: boolean;
		onClose?: () => void;
	};

	let { forceShow = false, onClose }: Props = $props();

	let visible = $state(false);
	let isOpening = $state(false);
	let isExpanding = $state(false);

	onMount(() => {
		const handleOpenEvent = () => {
			visible = true;
			isOpening = false;
			isExpanding = false;
			document.body.style.overflow = 'hidden';
		};
		window.addEventListener('open-wedding-envelope', handleOpenEvent);

		const alreadyOpened = sessionStorage.getItem('wedding_envelope_opened');
		if (forceShow || !alreadyOpened) {
			visible = true;
			document.body.style.overflow = 'hidden';
		}

		return () => {
			window.removeEventListener('open-wedding-envelope', handleOpenEvent);
			document.body.style.overflow = '';
		};
	});

	function openEnvelope() {
		if (isOpening || isExpanding) return;

		// 1. Моментальное раскрытие: печать исчезает, верхний клапан распахивается вверх
		isOpening = true;

		// 2. В момент полного раскрытия клапана — открытка стремительно вылетает и разворачивается в экран,
		// конверт падает вниз, плавно открывая сайт
		setTimeout(() => {
			isExpanding = true;
			sessionStorage.setItem('wedding_envelope_opened', '1');
		}, 480);

		// 3. Завершение и передача управления сайту
		setTimeout(() => {
			visible = false;
			document.body.style.overflow = '';
			if (onClose) onClose();
		}, 1300);
	}
</script>

{#if visible}
	<div
		class="envelope-screen"
		class:is-opening={isOpening}
		class:is-expanding={isExpanding}
		role="button"
		tabindex="0"
		aria-label="Нажмите, чтобы открыть приглашение"
		onclick={openEnvelope}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				openEnvelope();
			}
		}}
	>
		<!-- Фоновые изящные дуги (как на референсе) -->
		<svg class="bg-lines" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
			<path
				d="M -100,240 Q 500,420 1100,160"
				fill="none"
				stroke="#dad4c7"
				stroke-width="1.2"
				opacity="0.7"
			/>
			<path
				d="M -100,740 Q 500,560 1100,840"
				fill="none"
				stroke="#dad4c7"
				stroke-width="1.2"
				opacity="0.7"
			/>
			<path
				d="M 500,-100 Q 340,500 500,1100"
				fill="none"
				stroke="#dad4c7"
				stroke-width="0.8"
				opacity="0.5"
			/>
		</svg>

		<div class="stage">
			<!-- Сама открытка с текстом -->
			<div class="card">
				<div class="card__inner">
					<p class="card__title-1">Приглашение на</p>
					<p class="card__title-2">свадьбу</p>
					<p class="card__date">17.12.2026</p>
				</div>
			</div>

			<!-- Конверт -->
			<div class="envelope">
				<!-- Задняя стенка конверта -->
				<div class="envelope__back"></div>

				<!-- Внутреннее затенение кармана -->
				<div class="envelope__shadow"></div>

				<!-- Передний карман (складки) -->
				<div class="envelope__pocket">
					<div class="envelope__fold-left"></div>
					<div class="envelope__fold-right"></div>
					<div class="envelope__fold-bottom"></div>
				</div>

				<!-- Верхний открывающийся клапан (3D поворот наверх) -->
				<div class="envelope__flap">
					<!-- Лицевая сторона клапана (смотрит вниз в закрытом состоянии) -->
					<div class="envelope__flap-face envelope__flap-face--front">
						<svg class="flap-svg" viewBox="0 0 400 160" preserveAspectRatio="none">
							<polygon points="0,0 400,0 200,160" fill="#4a6654" />
							<polygon points="0,0 400,0 200,160" fill="url(#frontGrad)" />
							<line x1="0" y1="0" x2="200" y2="160" stroke="rgba(255,255,255,0.22)" stroke-width="1.2" />
							<line x1="400" y1="0" x2="200" y2="160" stroke="rgba(0,0,0,0.22)" stroke-width="1.2" />
							<defs>
								<linearGradient id="frontGrad" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stop-color="#567963" />
									<stop offset="100%" stop-color="#3d5746" />
								</linearGradient>
							</defs>
						</svg>
					</div>

					<!-- Внутренняя сторона клапана (раскрывается наверх) -->
					<div class="envelope__flap-face envelope__flap-face--back">
						<svg class="flap-svg" viewBox="0 0 400 160" preserveAspectRatio="none">
							<polygon points="0,160 400,160 200,0" fill="#364d3e" />
							<polygon points="0,160 400,160 200,0" fill="url(#backGrad)" />
							<defs>
								<linearGradient id="backGrad" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stop-color="#2a3d31" />
									<stop offset="100%" stop-color="#3b5444" />
								</linearGradient>
							</defs>
						</svg>
					</div>
				</div>

				<!-- Сургучная печать НАЖМИТЕ -->
				<div class="seal">
					<div class="seal__disc">
						<span class="seal__text">НАЖМИТЕ</span>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	/* ПОЛНОСТЬЮ НЕПРОЗРАЧНЫЙ ФОН: сайт позади НЕ ВИДЕН */
	.envelope-screen {
		position: fixed;
		inset: 0;
		z-index: 999999;
		display: grid;
		place-items: center;
		background: #f6f3ea;
		overflow: hidden;
		user-select: none;
		cursor: pointer;
		outline: none;
		transition: opacity 0.6s ease 0.6s;
		will-change: opacity;
	}

	.envelope-screen.is-expanding {
		opacity: 0;
		pointer-events: none;
	}

	/* Фоновые нити */
	.bg-lines {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		transition: opacity 0.4s ease;
	}

	.envelope-screen.is-expanding .bg-lines {
		opacity: 0;
	}

	/* Сцена */
	.stage {
		position: relative;
		width: min(88vw, 380px);
		height: 520px;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
		perspective: 1200px;
		transform-style: preserve-3d;
	}

	/* ─────────────────────────────────────────────────────────────
	   ОТКРЫТКА: ВЫСОКАЯ, ТЕКСТ ПОЛНОСТЬЮ ВИДЕН НАВЕРХУ
	   ───────────────────────────────────────────────────────────── */
	.card {
		position: absolute;
		top: 10px;
		left: 50%;
		transform: translateX(-50%);
		width: 90%;
		height: 420px;
		background: #fbf9f4;
		border: 1px solid #dfd8cb;
		box-shadow: 0 12px 36px rgba(45, 60, 50, 0.14);
		padding: 12px;
		z-index: 2;
		pointer-events: none;
		transform-origin: center center;
		transition: transform 0.85s cubic-bezier(0.16, 1, 0.3, 1),
			opacity 0.6s ease-in 0.2s,
			box-shadow 0.85s ease;
		will-change: transform, opacity;
	}

	/* ЭФФЕКТ ВЫЛЕТА ГЛАВНОЙ СТРАНИЦЫ ИЗ КОНВЕРТА */
	.envelope-screen.is-expanding .card {
		transform: translate(-50%, -160px) scale(3.4);
		opacity: 0;
		box-shadow: 0 40px 100px rgba(0, 0, 0, 0.4);
		z-index: 10;
	}

	.card__inner {
		width: 100%;
		height: 100%;
		border: 1px solid #ede7db;
		padding: 30px 18px 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.card__title-1 {
		font-family: 'Marck Script', cursive, var(--serif);
		font-size: clamp(34px, 8.5vw, 44px);
		color: #3b5443;
		line-height: 1.1;
		margin: 0;
		text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
	}

	.card__title-2 {
		font-family: 'Marck Script', cursive, var(--serif);
		font-size: clamp(38px, 9.5vw, 48px);
		color: #3b5443;
		line-height: 1.1;
		margin: 2px 0 0;
		text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
	}

	.card__date {
		font-family: 'Marck Script', cursive, var(--serif);
		font-size: clamp(40px, 10vw, 52px);
		color: #3b5443;
		line-height: 1;
		margin: 14px 0 0;
		text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
	}

	/* ─────────────────────────────────────────────────────────────
	   КОНВЕРТ: ПРИ РАСКРЫТИИ ПАДАЕТ ВНИЗ И РАСТВОРЯЕТСЯ
	   ───────────────────────────────────────────────────────────── */
	.envelope {
		position: relative;
		width: 100%;
		height: 250px;
		z-index: 4;
		box-shadow: 0 24px 52px rgba(35, 52, 42, 0.25);
		perspective: 1200px;
		transition: transform 0.65s cubic-bezier(0.55, 0, 1, 0.45),
			opacity 0.55s ease;
		will-change: transform, opacity;
	}

	.envelope-screen.is-expanding .envelope {
		transform: translateY(340px);
		opacity: 0;
	}

	/* Задняя стенка */
	.envelope__back {
		position: absolute;
		inset: 0;
		background: #395040;
	}

	.envelope__shadow {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, transparent 60%);
		z-index: 1;
	}

	/* Передний карман со складками */
	.envelope__pocket {
		position: absolute;
		inset: 0;
		z-index: 5;
		pointer-events: none;
	}

	.envelope__fold-left {
		position: absolute;
		inset: 0;
		clip-path: polygon(0 0, 0 100%, 55% 53%);
		background: linear-gradient(90deg, #486553, #3d5546);
		filter: drop-shadow(4px 0 8px rgba(0, 0, 0, 0.12));
	}

	.envelope__fold-right {
		position: absolute;
		inset: 0;
		clip-path: polygon(100% 0, 100% 100%, 45% 53%);
		background: linear-gradient(270deg, #486553, #3b5243);
		filter: drop-shadow(-4px 0 8px rgba(0, 0, 0, 0.12));
	}

	.envelope__fold-bottom {
		position: absolute;
		inset: 0;
		clip-path: polygon(0 100%, 50% 48%, 100% 100%);
		background: linear-gradient(0deg, #374e40, #4c6956);
		filter: drop-shadow(0 -4px 10px rgba(0, 0, 0, 0.15));
	}

	/* ─────────────────────────────────────────────────────────────
	   ВЕРХНИЙ КЛАПАН: ПЛАВНЫЙ И ЧЕСТНЫЙ 3D РАЗВОРОТ
	   (z-index переключается в середине поворота, чтобы клапан не нырял под карман)
	   ───────────────────────────────────────────────────────────── */
	.envelope__flap {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 155px;
		transform-origin: top center;
		transform-style: preserve-3d;
		z-index: 6;
		pointer-events: none;
		transition: transform 0.65s cubic-bezier(0.35, 1.25, 0.55, 1),
			z-index 0s ease 0.3s;
		will-change: transform;
	}

	.envelope-screen.is-opening .envelope__flap,
	.envelope-screen.is-expanding .envelope__flap {
		transform: rotateX(180deg);
		z-index: 1;
	}

	.envelope__flap-face {
		position: absolute;
		inset: 0;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
	}

	.envelope__flap-face--front {
		transform: rotateX(0deg);
	}

	.envelope__flap-face--back {
		transform: rotateX(180deg);
	}

	.flap-svg {
		width: 100%;
		height: 100%;
		filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.22));
	}

	/* ─────────────────────────────────────────────────────────────
	   СУРГУЧНАЯ ПЕЧАТЬ «НАЖМИТЕ»
	   ───────────────────────────────────────────────────────────── */
	.seal {
		position: absolute;
		top: 142px;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 8;
		pointer-events: none;
		transition: transform 0.2s ease, opacity 0.2s ease;
	}

	.envelope-screen:hover .seal {
		transform: translate(-50%, -50%) scale(1.06);
	}

	.envelope-screen.is-opening .seal,
	.envelope-screen.is-expanding .seal {
		transform: translate(-50%, -50%) scale(0.5);
		opacity: 0;
	}

	.seal__disc {
		width: 82px;
		height: 82px;
		border-radius: 50%;
		background: radial-gradient(circle at 35% 30%, #fefcf8, #ede6d8 55%, #cfc4b0 100%);
		box-shadow:
			0 10px 28px rgba(25, 40, 30, 0.34),
			inset 0 2px 4px rgba(255, 255, 255, 0.9),
			inset 0 -3px 6px rgba(0, 0, 0, 0.2);
		display: grid;
		place-items: center;
		animation: seal-pulse 2.4s infinite ease-in-out;
		position: relative;
	}

	.seal__disc::before {
		content: '';
		position: absolute;
		inset: 6px;
		border-radius: 50%;
		border: 1px dashed rgba(120, 105, 80, 0.42);
	}

	.seal__text {
		font-family: var(--sans);
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.22em;
		color: #5d4d38;
		text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
		padding-left: 2px;
	}

	@keyframes seal-pulse {
		0%,
		100% {
			box-shadow:
				0 10px 28px rgba(25, 40, 30, 0.34),
				0 0 0 0 rgba(237, 230, 216, 0.7);
		}
		50% {
			box-shadow:
				0 14px 34px rgba(25, 40, 30, 0.44),
				0 0 0 14px rgba(237, 230, 216, 0);
		}
	}

	@media (max-width: 480px) {
		.stage {
			height: 480px;
			width: 90vw;
		}

		.card {
			height: 390px;
			top: 15px;
		}

		.card__inner {
			padding: 24px 14px 16px;
		}

		.envelope {
			height: 230px;
		}

		.envelope__flap {
			height: 140px;
		}

		.seal {
			top: 128px;
		}

		.seal__disc {
			width: 74px;
			height: 74px;
		}
	}
</style>
