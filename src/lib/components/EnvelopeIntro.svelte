<script lang="ts">
	import { onMount } from 'svelte';

	type Props = {
		forceShow?: boolean;
		onClose?: () => void;
	};

	let { forceShow = false, onClose }: Props = $props();

	let visible = $state(false);
	let isOpening = $state(false);
	let isFading = $state(false);

	onMount(() => {
		const handleOpenEvent = () => {
			visible = true;
			isOpening = false;
			isFading = false;
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
		if (isOpening || isFading) return;

		// 1. Раскрытие верхнего клапана конверта
		isOpening = true;

		// 2. Плавный переход к главной странице сайта (без лишних вылетов карточки)
		setTimeout(() => {
			isFading = true;
			sessionStorage.setItem('wedding_envelope_opened', '1');
		}, 420);

		// 3. Завершение и освобождение скролла сайта
		setTimeout(() => {
			visible = false;
			document.body.style.overflow = '';
			if (onClose) onClose();
		}, 1150);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!visible) return;
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			openEnvelope();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if visible}
	<div
		class="envelope-screen"
		class:is-opening={isOpening}
		class:is-fading={isFading}
		role="dialog"
		tabindex="0"
		aria-modal="true"
		aria-label="Пригласительный конверт"
		onclick={openEnvelope}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				openEnvelope();
			}
		}}
	>
		<!-- Фоновые изящные нити (как на образце) -->
		<svg class="bg-art" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
			<path
				d="M -100,220 Q 500,420 1100,160"
				fill="none"
				stroke="#dbd5c7"
				stroke-width="1.2"
				opacity="0.6"
			/>
			<path
				d="M -100,740 Q 500,560 1100,830"
				fill="none"
				stroke="#dbd5c7"
				stroke-width="1.2"
				opacity="0.6"
			/>
			<path
				d="M 500,-100 Q 340,500 500,1100"
				fill="none"
				stroke="#dbd5c7"
				stroke-width="0.8"
				opacity="0.4"
			/>
		</svg>

		<div class="stage">
			<!-- Сама открытка (находится внутри конверта, статично, без вылетов) -->
			<div class="card">
				<div class="card__inner">
					<p class="card__script-title">Приглашение на свадьбу</p>
					<p class="card__script-date">17.12.2026</p>
				</div>
			</div>

			<!-- Конверт -->
			<div class="envelope">
				<!-- Задняя стенка конверта -->
				<div class="envelope__back"></div>

				<!-- Передний карман (складки конверта) -->
				<div class="envelope__pocket">
					<div class="envelope__left-fold"></div>
					<div class="envelope__right-fold"></div>
					<div class="envelope__bottom-fold"></div>
				</div>

				<!-- Верхний открывающийся клапан -->
				<div class="envelope__flap">
					<div class="envelope__flap-front">
						<svg class="flap-svg" viewBox="0 0 400 215" preserveAspectRatio="none">
							<polygon points="0,0 400,0 200,215" fill="#4d6957" />
							<polygon points="0,0 400,0 200,215" fill="url(#flapGrad)" />
							<line x1="0" y1="0" x2="200" y2="215" stroke="rgba(255,255,255,0.18)" stroke-width="1.2" />
							<line x1="400" y1="0" x2="200" y2="215" stroke="rgba(0,0,0,0.18)" stroke-width="1.2" />
							<defs>
								<linearGradient id="flapGrad" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stop-color="#5a7a66" />
									<stop offset="100%" stop-color="#41594a" />
								</linearGradient>
							</defs>
						</svg>
					</div>
					<div class="envelope__flap-back">
						<svg class="flap-svg" viewBox="0 0 400 215" preserveAspectRatio="none">
							<polygon points="0,215 400,215 200,0" fill="#3a5142" />
						</svg>
					</div>
				</div>

				<!-- Сургучная круглая печать НАЖМИТЕ -->
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
		background: #f5f2ea;
		overflow: hidden;
		user-select: none;
		cursor: pointer;
		outline: none;
		transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1),
			transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
		will-change: opacity, transform;
	}

	.envelope-screen.is-fading {
		opacity: 0;
		transform: scale(1.03);
		pointer-events: none;
	}

	/* Фоновые нити */
	.bg-art {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	/* Сцена */
	.stage {
		position: relative;
		width: min(92vw, 420px);
		height: 520px;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
		perspective: 1200px;
		transition: transform 0.6s cubic-bezier(0.2, 0.9, 0.3, 1);
	}

	.envelope-screen.is-fading .stage {
		transform: translateY(20px);
	}

	/* Открытка (статично находится в конверте, как на скриншоте) */
	.card {
		position: absolute;
		bottom: 80px;
		width: 88%;
		height: 380px;
		background: #fbf9f4;
		border: 1px solid #dfd8cb;
		box-shadow: 0 10px 30px rgba(45, 60, 50, 0.12);
		padding: 14px;
		z-index: 2;
		pointer-events: none;
	}

	.card__inner {
		width: 100%;
		height: 100%;
		border: 1px solid #ede7db;
		padding: 24px 18px;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.card__script-title {
		font-family: 'Marck Script', cursive, var(--serif);
		font-size: clamp(34px, 8.5vw, 46px);
		color: #3b5443;
		line-height: 1.15;
		margin: 0;
		text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
	}

	.card__script-date {
		font-family: 'Marck Script', cursive, var(--serif);
		font-size: clamp(38px, 9.5vw, 52px);
		color: #3b5443;
		line-height: 1.05;
		margin: 10px 0 0;
		text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
	}

	/* Конверт */
	.envelope {
		position: relative;
		width: 100%;
		height: 280px;
		z-index: 4;
		box-shadow: 0 20px 48px rgba(35, 52, 42, 0.22);
	}

	/* Задняя стенка конверта */
	.envelope__back {
		position: absolute;
		inset: 0;
		background: #3e5646;
	}

	/* Передний карман (складки) */
	.envelope__pocket {
		position: absolute;
		inset: 0;
		z-index: 5;
		pointer-events: none;
	}

	.envelope__left-fold {
		position: absolute;
		inset: 0;
		clip-path: polygon(0 0, 0 100%, 55% 53%);
		background: linear-gradient(90deg, #486452, #3d5546);
		filter: drop-shadow(3px 0 6px rgba(0, 0, 0, 0.1));
	}

	.envelope__right-fold {
		position: absolute;
		inset: 0;
		clip-path: polygon(100% 0, 100% 100%, 45% 53%);
		background: linear-gradient(270deg, #486452, #3b5243);
		filter: drop-shadow(-3px 0 6px rgba(0, 0, 0, 0.1));
	}

	.envelope__bottom-fold {
		position: absolute;
		inset: 0;
		clip-path: polygon(0 100%, 50% 48%, 100% 100%);
		background: linear-gradient(0deg, #384f40, #4c6956);
		filter: drop-shadow(0 -4px 8px rgba(0, 0, 0, 0.12));
	}

	/* Верхний клапан с 3D отгибанием */
	.envelope__flap {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 175px;
		transform-origin: top center;
		transform-style: preserve-3d;
		transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: 7;
		pointer-events: none;
	}

	.envelope-screen.is-opening .envelope__flap {
		transform: rotateX(180deg);
		z-index: 1;
	}

	.envelope__flap-front,
	.envelope__flap-back {
		position: absolute;
		inset: 0;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
	}

	.envelope__flap-front {
		transform: rotateX(0deg);
	}

	.envelope__flap-back {
		transform: rotateX(180deg);
	}

	.flap-svg {
		width: 100%;
		height: 100%;
		filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.18));
	}

	/* Печать НАЖМИТЕ */
	.seal {
		position: absolute;
		top: 150px;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 8;
		pointer-events: none;
		transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
	}

	.envelope-screen:hover .seal {
		transform: translate(-50%, -50%) scale(1.06);
	}

	.envelope-screen.is-opening .seal {
		transform: translate(-50%, -50%) scale(1.2);
		opacity: 0;
	}

	.seal__disc {
		width: 82px;
		height: 82px;
		border-radius: 50%;
		background: radial-gradient(circle at 35% 30%, #fefcf8, #ede6d8 55%, #cfc4b0 100%);
		box-shadow:
			0 8px 24px rgba(25, 40, 30, 0.3),
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
				0 8px 24px rgba(25, 40, 30, 0.3),
				0 0 0 0 rgba(237, 230, 216, 0.7);
		}
		50% {
			box-shadow:
				0 12px 30px rgba(25, 40, 30, 0.4),
				0 0 0 14px rgba(237, 230, 216, 0);
		}
	}

	@media (max-width: 480px) {
		.stage {
			height: 480px;
		}

		.envelope {
			height: 250px;
		}

		.card {
			height: 340px;
			bottom: 70px;
			padding: 10px;
		}

		.card__inner {
			padding: 18px 12px;
		}

		.envelope__flap {
			height: 155px;
		}

		.seal {
			top: 132px;
		}

		.seal__disc {
			width: 74px;
			height: 74px;
		}
	}
</style>
