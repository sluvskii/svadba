<script lang="ts">
	import { onMount } from 'svelte';

	type Props = {
		forceShow?: boolean;
		onClose?: () => void;
	};

	let { forceShow = false, onClose }: Props = $props();

	let visible = $state(false);
	let isOpening = $state(false);
	let isLaunching = $state(false);

	onMount(() => {
		const handleOpenEvent = () => {
			visible = true;
			isOpening = false;
			isLaunching = false;
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
		if (isOpening || isLaunching) return;

		// 1. Моментально распахиваем клапан конверта
		isOpening = true;

		// 2. Через 320мс открытка эффектно вылетает и увеличивается на весь экран,
		// а конверт падает вниз, плавно переходя в главную страницу сайта
		setTimeout(() => {
			isLaunching = true;
			sessionStorage.setItem('wedding_envelope_opened', '1');
		}, 320);

		// 3. Полное завершение и передача управления сайту
		setTimeout(() => {
			visible = false;
			document.body.style.overflow = '';
			if (onClose) onClose();
		}, 1200);
	}
</script>

{#if visible}
	<div
		class="envelope-screen"
		class:is-opening={isOpening}
		class:is-launching={isLaunching}
		role="button"
		tabindex="0"
		aria-label="Нажмите, чтобы открыть пригласительный конверт"
		onclick={openEnvelope}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				openEnvelope();
			}
		}}
	>
		<!-- Фоновые изящные нити (как на референсе) -->
		<svg class="bg-art" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
			<path
				d="M -100,260 Q 500,440 1100,180"
				fill="none"
				stroke="#dcd6c9"
				stroke-width="1.2"
				opacity="0.65"
			/>
			<path
				d="M -100,720 Q 500,540 1100,820"
				fill="none"
				stroke="#dcd6c9"
				stroke-width="1.2"
				opacity="0.65"
			/>
			<path
				d="M 500,-100 Q 360,500 500,1100"
				fill="none"
				stroke="#dcd6c9"
				stroke-width="0.8"
				opacity="0.45"
			/>
		</svg>

		<div class="stage">
			<!-- Сама открытка: вылетает из конверта и разворачивается прямо на зрителя -->
			<div class="card">
				<div class="card__inner">
					<p class="card__line-1">Приглашение на</p>
					<p class="card__line-2">свадьбу</p>
					<p class="card__date">17.12.2026</p>
				</div>
			</div>

			<!-- Конверт -->
			<div class="envelope">
				<!-- Задняя стенка конверта -->
				<div class="envelope__back"></div>

				<!-- Передний карман (складки конверта) -->
				<div class="envelope__pocket">
					<div class="envelope__fold-left"></div>
					<div class="envelope__fold-right"></div>
					<div class="envelope__fold-bottom"></div>
				</div>

				<!-- Верхний открывающийся клапан -->
				<div class="envelope__flap">
					<div class="envelope__flap-face envelope__flap-face--front">
						<svg class="flap-svg" viewBox="0 0 400 150" preserveAspectRatio="none">
							<polygon points="0,0 400,0 200,150" fill="#4d6957" />
							<polygon points="0,0 400,0 200,150" fill="url(#flapGradient)" />
							<line x1="0" y1="0" x2="200" y2="150" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />
							<line x1="400" y1="0" x2="200" y2="150" stroke="rgba(0,0,0,0.2)" stroke-width="1.5" />
							<defs>
								<linearGradient id="flapGradient" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stop-color="#5a7a66" />
									<stop offset="100%" stop-color="#405849" />
								</linearGradient>
							</defs>
						</svg>
					</div>
					<div class="envelope__flap-face envelope__flap-face--back">
						<svg class="flap-svg" viewBox="0 0 400 150" preserveAspectRatio="none">
							<polygon points="0,150 400,150 200,0" fill="#354a3d" />
							<polygon points="0,150 400,150 200,0" fill="url(#flapBackGrad)" />
							<defs>
								<linearGradient id="flapBackGrad" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stop-color="#2a3c31" />
									<stop offset="100%" stop-color="#3b5244" />
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
	/* ПОЛНОСТЬЮ НЕПРОЗРАЧНЫЙ ФОН */
	.envelope-screen {
		position: fixed;
		inset: 0;
		z-index: 999999;
		display: grid;
		place-items: center;
		background: #f5f2ea;
		overflow: hidden;
		user-select: none;
		cursor: pointer;
		outline: none;
		transition: opacity 0.5s ease 0.65s;
		will-change: opacity;
	}

	.envelope-screen.is-launching {
		opacity: 0;
		pointer-events: none;
	}

	/* Фоновые нити */
	.bg-art {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		transition: opacity 0.4s ease 0.2s;
	}

	.envelope-screen.is-launching .bg-art {
		opacity: 0;
	}

	/* Главная сцена */
	.stage {
		position: relative;
		width: min(88vw, 390px);
		height: 520px;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
		perspective: 1200px;
		transform-style: preserve-3d;
	}

	/* ─────────────────────────────────────────────────────────────
	   ОТКРЫТКА: ВЫЛЕТАЕТ ИЗ КОНВЕРТА И МАСШТАБИРУЕТСЯ В САЙТ
	   ───────────────────────────────────────────────────────────── */
	.card {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 90%;
		height: 440px;
		background: #fbf9f4;
		border: 1px solid #dfd8cb;
		box-shadow: 0 10px 32px rgba(45, 60, 50, 0.12);
		padding: 14px;
		z-index: 2;
		pointer-events: none;
		transform-origin: center center;
		transition: transform 0.85s cubic-bezier(0.16, 1, 0.3, 1),
			opacity 0.65s ease-in 0.2s,
			box-shadow 0.85s ease;
		will-change: transform, opacity;
	}

	/* ЭФФЕКТ ВЫЛЕТА В ЭКРАН */
	.envelope-screen.is-launching .card {
		transform: translate(-50%, -180px) scale(3.2);
		opacity: 0;
		box-shadow: 0 40px 100px rgba(0, 0, 0, 0.35);
		z-index: 10;
	}

	.card__inner {
		width: 100%;
		height: 100%;
		border: 1px solid #ede7db;
		padding: 32px 18px 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.card__line-1 {
		font-family: 'Marck Script', cursive, var(--serif);
		font-size: clamp(34px, 8.5vw, 44px);
		color: #3b5443;
		line-height: 1.1;
		margin: 0;
		text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
	}

	.card__line-2 {
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
	   КОНВЕРТ: ПРИ ВЫЛЕТЕ ПАДАЕТ ВНИЗ И ИСЧЕЗАЕТ
	   ───────────────────────────────────────────────────────────── */
	.envelope {
		position: relative;
		width: 100%;
		height: 250px;
		z-index: 4;
		box-shadow: 0 24px 50px rgba(35, 52, 42, 0.25);
		perspective: 1200px;
		transition: transform 0.7s cubic-bezier(0.55, 0, 1, 0.45),
			opacity 0.6s ease;
		will-change: transform, opacity;
	}

	.envelope-screen.is-launching .envelope {
		transform: translateY(320px);
		opacity: 0;
	}

	/* Задняя стенка */
	.envelope__back {
		position: absolute;
		inset: 0;
		background: #3a5041;
	}

	/* Складки кармана */
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
		background: linear-gradient(90deg, #486452, #3d5546);
		filter: drop-shadow(4px 0 8px rgba(0, 0, 0, 0.12));
	}

	.envelope__fold-right {
		position: absolute;
		inset: 0;
		clip-path: polygon(100% 0, 100% 100%, 45% 53%);
		background: linear-gradient(270deg, #486452, #3b5243);
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
	   ВЕРХНИЙ КЛАПАН
	   ───────────────────────────────────────────────────────────── */
	.envelope__flap {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 145px;
		transform-origin: top center;
		transform-style: preserve-3d;
		transition: transform 0.45s cubic-bezier(0.25, 1, 0.5, 1);
		z-index: 7;
		pointer-events: none;
	}

	.envelope-screen.is-opening .envelope__flap,
	.envelope-screen.is-launching .envelope__flap {
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
		filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.2));
	}

	/* ─────────────────────────────────────────────────────────────
	   СУРГУЧНАЯ ПЕЧАТЬ «НАЖМИТЕ»
	   ───────────────────────────────────────────────────────────── */
	.seal {
		position: absolute;
		top: 135px;
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
	.envelope-screen.is-launching .seal {
		transform: translate(-50%, -50%) scale(0.6);
		opacity: 0;
	}

	.seal__disc {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background: radial-gradient(circle at 35% 30%, #fefcf8, #ede6d8 55%, #cfc4b0 100%);
		box-shadow:
			0 10px 28px rgba(25, 40, 30, 0.32),
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
		border: 1px dashed rgba(120, 105, 80, 0.4);
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
				0 10px 28px rgba(25, 40, 30, 0.32),
				0 0 0 0 rgba(237, 230, 216, 0.7);
		}
		50% {
			box-shadow:
				0 14px 34px rgba(25, 40, 30, 0.42),
				0 0 0 14px rgba(237, 230, 216, 0);
		}
	}

	@media (max-width: 480px) {
		.stage {
			height: 480px;
			width: 90vw;
		}

		.card {
			height: 400px;
		}

		.card__inner {
			padding: 24px 14px 16px;
		}

		.envelope {
			height: 230px;
		}

		.envelope__flap {
			height: 135px;
		}

		.seal {
			top: 125px;
		}

		.seal__disc {
			width: 72px;
			height: 72px;
		}
	}
</style>
