<script lang="ts">
	import { onMount } from 'svelte';
	import { content } from '#lib/content.js';
	import { pick } from '#lib/i18n.svelte.js';
	import Monogram from './Monogram.svelte';

	type Props = {
		forceShow?: boolean;
		onClose?: () => void;
	};

	let { forceShow = false, onClose }: Props = $props();

	let visible = $state(false);
	let step = $state<'idle' | 'opening-flap' | 'sliding-card' | 'revealing-site' | 'done'>('idle');

	onMount(() => {
		const handleOpenEvent = () => {
			visible = true;
			step = 'idle';
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
		if (step !== 'idle') return;

		// Шаг 1: Печать растворяется, верхний клапан откидывается наверх (3D)
		step = 'opening-flap';

		// Шаг 2: Открытка плавно выезжает вверх из открытого конверта
		setTimeout(() => {
			step = 'sliding-card';
		}, 550);

		// Шаг 3: Экран плавно растворяется, открывая сайт
		setTimeout(() => {
			step = 'revealing-site';
			sessionStorage.setItem('wedding_envelope_opened', '1');
		}, 1900);

		// Шаг 4: Завершение и освобождение страницы
		setTimeout(() => {
			step = 'done';
			visible = false;
			document.body.style.overflow = '';
			if (onClose) onClose();
		}, 2600);
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

{#if visible && step !== 'done'}
	<div
		class="envelope-screen"
		class:is-opening={step === 'opening-flap'}
		class:is-sliding={step === 'sliding-card'}
		class:is-revealing={step === 'revealing-site'}
		role="dialog"
		aria-modal="true"
		aria-label="Пригласительный конверт"
	>
		<!-- Изящные фоновые декоративные линии (как на образце) -->
		<svg class="bg-art" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
			<path
				d="M -100,200 Q 500,450 1100,150"
				fill="none"
				stroke="#d8d3c5"
				stroke-width="1.2"
				opacity="0.6"
			/>
			<path
				d="M -100,750 Q 500,550 1100,850"
				fill="none"
				stroke="#d8d3c5"
				stroke-width="1.2"
				opacity="0.6"
			/>
			<path
				d="M 500,-100 Q 300,500 500,1100"
				fill="none"
				stroke="#d8d3c5"
				stroke-width="0.8"
				opacity="0.4"
			/>
		</svg>

		<div class="stage">
			<!-- Сама открытка с текстом -->
			<div
				class="card"
				onclick={openEnvelope}
				role="button"
				tabindex="0"
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') openEnvelope();
				}}
			>
				<div class="card__inner-border">
					<!-- Верхняя видимая часть (видна сразу над карманом конверта) -->
					<div class="card__header">
						<p class="card__script-title">Приглашение на свадьбу</p>
						<p class="card__script-date">17.12.2026</p>
					</div>

					<!-- Скрытая часть (раскрывается при выезде открытки) -->
					<div class="card__body">
						<div class="card__monogram">
							<Monogram size={38} />
						</div>
						<h2 class="card__names">{pick(content.footer.names)}</h2>
						<p class="card__sub">Ждём вас на нашем особенном празднике</p>
						<p class="card__place">Ресторан «Тантана» · Нефтекамск</p>
					</div>
				</div>
			</div>

			<!-- Конверт -->
			<div
				class="envelope"
				onclick={openEnvelope}
				role="button"
				tabindex="0"
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') openEnvelope();
				}}
				aria-label="Нажмите на конверт, чтобы открыть приглашение"
			>
				<!-- Задняя стенка конверта -->
				<div class="envelope__back"></div>

				<!-- Внутреннее пространство кармана (тёмная подкладка) -->
				<div class="envelope__inner-shadow"></div>

				<!-- Передний карман (левый, правый и нижний треугольники) -->
				<div class="envelope__pocket">
					<div class="envelope__left-fold"></div>
					<div class="envelope__right-fold"></div>
					<div class="envelope__bottom-fold"></div>
				</div>

				<!-- Верхний откидной клапан (3D поворот) -->
				<div class="envelope__flap">
					<div class="envelope__flap-front">
						<svg class="flap-svg" viewBox="0 0 400 215" preserveAspectRatio="none">
							<polygon points="0,0 400,0 200,215" fill="#4d6957" />
							<polygon points="0,0 400,0 200,215" fill="url(#flapGradient)" />
							<line x1="0" y1="0" x2="200" y2="215" stroke="rgba(255,255,255,0.14)" stroke-width="1.5" />
							<line x1="400" y1="0" x2="200" y2="215" stroke="rgba(0,0,0,0.16)" stroke-width="1.5" />
							<defs>
								<linearGradient id="flapGradient" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stop-color="#5a7a66" />
									<stop offset="100%" stop-color="#41594a" />
								</linearGradient>
							</defs>
						</svg>
					</div>
					<!-- Внутренняя сторона откинутого клапана -->
					<div class="envelope__flap-back">
						<svg class="flap-svg flap-svg--back" viewBox="0 0 400 215" preserveAspectRatio="none">
							<polygon points="0,215 400,215 200,0" fill="#3a5142" />
						</svg>
					</div>
				</div>

				<!-- Сургучная круглая печать НАЖМИТЕ по центру -->
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
		transition: opacity 0.8s cubic-bezier(0.2, 0.9, 0.3, 1), visibility 0.8s;
	}

	.envelope-screen.is-revealing {
		opacity: 0;
		pointer-events: none;
	}

	/* Фоновые изящные нити/линии */
	.bg-art {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	/* Главная сцена с конвертом */
	.stage {
		position: relative;
		width: min(92vw, 420px);
		height: 580px;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
		perspective: 1400px;
	}

	/* ─────────────────────────────────────────────────────────────
	   ОТКРЫТКА / ПИСЬМО
	   ───────────────────────────────────────────────────────────── */
	.card {
		position: absolute;
		bottom: 50px;
		width: 90%;
		height: 480px;
		background: #fbf9f4;
		border: 1px solid #dfd8cb;
		box-shadow: 0 12px 36px rgba(45, 60, 50, 0.16);
		padding: 16px;
		z-index: 2;
		cursor: pointer;
		outline: none;
		transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1),
			box-shadow 1.2s cubic-bezier(0.22, 1, 0.36, 1);
		will-change: transform;
	}

	.card__inner-border {
		width: 100%;
		height: 100%;
		border: 1px solid #ede7db;
		padding: 24px 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		position: relative;
	}

	/* Видимая шапка открытки */
	.card__header {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}

	.card__script-title {
		font-family: 'Marck Script', cursive, var(--serif);
		font-size: clamp(34px, 8.5vw, 46px);
		color: #3b5443;
		line-height: 1.1;
		margin: 0;
		text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
	}

	.card__script-date {
		font-family: 'Marck Script', cursive, var(--serif);
		font-size: clamp(36px, 9vw, 50px);
		color: #3b5443;
		line-height: 1;
		margin: 4px 0 0;
		text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
	}

	/* Скрытая нижняя часть открытки */
	.card__body {
		margin-top: 36px;
		display: flex;
		flex-direction: column;
		align-items: center;
		opacity: 0.95;
	}

	.card__monogram {
		color: #bfa15f;
		margin-bottom: 12px;
	}

	.card__names {
		font-family: var(--serif);
		font-size: clamp(24px, 5.5vw, 32px);
		font-weight: 400;
		color: #213327;
		letter-spacing: 0.04em;
		margin: 0;
	}

	.card__sub {
		font-family: var(--sans);
		font-size: 13px;
		color: #5c6e61;
		margin: 10px 0 4px;
	}

	.card__place {
		font-family: var(--serif);
		font-style: italic;
		font-size: 14px;
		color: #7d8e82;
		margin: 0;
	}

	/* АНИМАЦИЯ ВЫЕЗДА ОТКРЫТКИ */
	.envelope-screen.is-sliding .card,
	.envelope-screen.is-revealing .card {
		transform: translateY(-200px) scale(1.06);
		z-index: 8;
		box-shadow: 0 28px 70px rgba(25, 40, 30, 0.3);
	}

	/* ─────────────────────────────────────────────────────────────
	   КОНВЕРТ
	   ───────────────────────────────────────────────────────────── */
	.envelope {
		position: relative;
		width: 100%;
		height: 290px;
		z-index: 4;
		cursor: pointer;
		outline: none;
		transition: transform 1s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.8s;
	}

	.envelope-screen.is-sliding .envelope,
	.envelope-screen.is-revealing .envelope {
		transform: translateY(60px);
		opacity: 0.85;
	}

	/* Задняя стенка */
	.envelope__back {
		position: absolute;
		inset: 0;
		background: #3e5646;
		box-shadow: 0 24px 50px rgba(30, 48, 38, 0.3);
	}

	/* Тень внутри кармана */
	.envelope__inner-shadow {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(0, 0, 0, 0.28) 0%, transparent 60%);
		z-index: 1;
	}

	/* Передний карман */
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
		filter: drop-shadow(4px 0 8px rgba(0, 0, 0, 0.12));
	}

	.envelope__right-fold {
		position: absolute;
		inset: 0;
		clip-path: polygon(100% 0, 100% 100%, 45% 53%);
		background: linear-gradient(270deg, #486452, #3b5243);
		filter: drop-shadow(-4px 0 8px rgba(0, 0, 0, 0.12));
	}

	.envelope__bottom-fold {
		position: absolute;
		inset: 0;
		clip-path: polygon(0 100%, 50% 48%, 100% 100%);
		background: linear-gradient(0deg, #384f40, #4c6956);
		filter: drop-shadow(0 -4px 10px rgba(0, 0, 0, 0.15));
	}

	/* ─────────────────────────────────────────────────────────────
	   ВЕРХНИЙ КЛАПАН (ОТКРЫВАЕТСЯ НАВЕРХ)
	   ───────────────────────────────────────────────────────────── */
	.envelope__flap {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 180px;
		transform-origin: top center;
		transform-style: preserve-3d;
		transition: transform 0.75s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: 7;
		pointer-events: none;
	}

	.envelope-screen.is-opening .envelope__flap,
	.envelope-screen.is-sliding .envelope__flap,
	.envelope-screen.is-revealing .envelope__flap {
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
		filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2));
	}

	.flap-svg--back {
		filter: none;
	}

	/* ─────────────────────────────────────────────────────────────
	   СУРГУЧНАЯ ПЕЧАТЬ «НАЖМИТЕ»
	   ───────────────────────────────────────────────────────────── */
	.seal {
		position: absolute;
		top: 154px;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 8;
		pointer-events: auto;
		cursor: pointer;
		transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s ease;
	}

	.seal:hover {
		transform: translate(-50%, -50%) scale(1.08);
	}

	.envelope-screen.is-opening .seal,
	.envelope-screen.is-sliding .seal,
	.envelope-screen.is-revealing .seal {
		transform: translate(-50%, -50%) scale(1.25);
		opacity: 0;
		pointer-events: none;
	}

	.seal__disc {
		width: 82px;
		height: 82px;
		border-radius: 50%;
		background: radial-gradient(circle at 35% 30%, #fefcf8, #ede6d8 55%, #cfc4b0 100%);
		box-shadow:
			0 10px 28px rgba(25, 40, 30, 0.35),
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
				0 10px 28px rgba(25, 40, 30, 0.35),
				0 0 0 0 rgba(237, 230, 216, 0.7);
		}
		50% {
			box-shadow:
				0 14px 34px rgba(25, 40, 30, 0.45),
				0 0 0 16px rgba(237, 230, 216, 0);
		}
	}

	@media (max-width: 480px) {
		.stage {
			height: 520px;
		}

		.envelope {
			height: 250px;
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

		.card {
			height: 420px;
			bottom: 40px;
			padding: 12px;
		}

		.card__inner-border {
			padding: 18px 14px;
		}

		.envelope-screen.is-sliding .card,
		.envelope-screen.is-revealing .card {
			transform: translateY(-160px) scale(1.04);
		}
	}
</style>
