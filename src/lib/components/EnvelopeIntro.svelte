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
	let isOpening = $state(false);
	let isOpened = $state(false);

	onMount(() => {
		const handleOpenEvent = () => {
			visible = true;
			isOpening = false;
			isOpened = false;
			document.body.style.overflow = 'hidden';
		};
		window.addEventListener('open-wedding-envelope', handleOpenEvent);

		// Проверяем sessionStorage
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
		if (isOpening || isOpened) return;
		isOpening = true;

		// 1. Анимация открытия клапана и выезда открытки
		setTimeout(() => {
			isOpened = true;
			sessionStorage.setItem('wedding_envelope_opened', '1');
		}, 850);

		// 2. Плавное исчезновение оверлея
		setTimeout(() => {
			dismiss();
		}, 1900);
	}

	function dismiss() {
		sessionStorage.setItem('wedding_envelope_opened', '1');
		visible = false;
		document.body.style.overflow = '';
		if (onClose) onClose();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!visible) return;
		if (e.key === 'Escape') {
			dismiss();
		} else if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			openEnvelope();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if visible}
	<div
		class="envelope-overlay"
		class:is-opening={isOpening}
		class:is-opened={isOpened}
		role="dialog"
		aria-modal="true"
		aria-label="Пригласительный конверт"
	>
		<!-- Фон с мягким затемнением -->
		<div class="envelope-backdrop" onclick={openEnvelope} aria-hidden="true"></div>

		<!-- Кнопка пропустить в углу -->
		<button class="envelope-skip" type="button" onclick={dismiss} aria-label="Пропустить конверт">
			Пропустить ✕
		</button>

		<div class="envelope-wrap">
			<!-- Сама открытка, которая выглядывает и выезжает -->
			<button
				class="envelope-card"
				type="button"
				onclick={openEnvelope}
				aria-label="Приглашение на свадьбу: открыть"
			>
				<p class="envelope-card__script">Приглашение на свадьбу</p>
				<h2 class="envelope-card__names">{pick(content.footer.names)}</h2>
				<p class="envelope-card__date">17.12.2026</p>
				<div class="envelope-card__ornament">
					<Monogram size={32} />
				</div>
			</button>

			<!-- Конверт -->
			<button
				class="envelope"
				type="button"
				onclick={openEnvelope}
				aria-label="Нажмите, чтобы открыть конверт"
			>
				<!-- Внутренняя подкладка конверта -->
				<div class="envelope__liner"></div>

				<!-- Боковые и нижний клапаны -->
				<div class="envelope__fold-left"></div>
				<div class="envelope__fold-right"></div>
				<div class="envelope__fold-bottom"></div>

				<!-- Верхний открывающийся клапан (с 3D поворотом) -->
				<div class="envelope__flap-top">
					<svg class="envelope__flap-svg" viewBox="0 0 400 210" preserveAspectRatio="none">
						<polygon points="0,0 400,0 200,210" fill="#2d4739" />
						<polygon points="0,0 400,0 200,210" fill="url(#flapGrad)" />
						<defs>
							<linearGradient id="flapGrad" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stop-color="#385747" />
								<stop offset="100%" stop-color="#243b2e" />
							</linearGradient>
						</defs>
					</svg>
				</div>

				<!-- Сургучная печать по центру -->
				<div class="wax-seal" class:is-cracked={isOpening}>
					<div class="wax-seal__outer">
						<div class="wax-seal__inner">
							<span class="wax-seal__monogram">А&К</span>
							<span class="wax-seal__label">НАЖМИТЕ</span>
						</div>
					</div>
				</div>
			</button>

			<p class="envelope-hint">Нажмите на конверт, чтобы открыть приглашение</p>
		</div>
	</div>
{/if}

<style>
	.envelope-overlay {
		position: fixed;
		inset: 0;
		z-index: 9999;
		display: grid;
		place-items: center;
		padding: 20px;
		background: radial-gradient(circle at center, rgba(30, 48, 38, 0.94), rgba(15, 26, 20, 0.98));
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.8s;
		color: var(--ink);
	}

	.envelope-overlay.is-opened {
		opacity: 0;
		pointer-events: none;
	}

	.envelope-backdrop {
		position: absolute;
		inset: 0;
	}

	.envelope-skip {
		position: absolute;
		top: 24px;
		right: 28px;
		z-index: 10;
		appearance: none;
		background: rgba(255, 255, 255, 0.12);
		border: 1px solid rgba(255, 255, 255, 0.2);
		color: #ffffff;
		padding: 8px 16px;
		font-family: var(--sans);
		font-size: 12px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		cursor: pointer;
		border-radius: 0;
		transition: all 0.2s var(--ease);
	}

	.envelope-skip:hover {
		background: rgba(255, 255, 255, 0.25);
		color: #ffffff;
	}

	.envelope-wrap {
		position: relative;
		width: min(92vw, 420px);
		height: 480px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		perspective: 1200px;
		user-select: none;
	}

	/* Карточка-письмо */
	.envelope-card {
		appearance: none;
		position: absolute;
		bottom: 90px;
		width: 86%;
		height: 290px;
		background: #fdfbf7;
		border: 1px solid #e2ddd3;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
		padding: 28px 24px;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		z-index: 1;
		transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
		cursor: pointer;
		outline: none;
		border-radius: 0;
	}

	.envelope-overlay.is-opening .envelope-card {
		transform: translateY(-160px) scale(1.04);
		box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
		z-index: 5;
	}

	.envelope-card__script {
		font-family: 'Marck Script', cursive, var(--serif);
		font-size: clamp(26px, 6vw, 34px);
		color: #3d5a49;
		line-height: 1.1;
		margin: 0;
	}

	.envelope-card__names {
		font-family: var(--serif);
		font-size: clamp(22px, 5vw, 28px);
		color: #1a2a20;
		margin: 12px 0 0;
		font-weight: 400;
		letter-spacing: 0.04em;
	}

	.envelope-card__date {
		font-family: 'Marck Script', cursive, var(--serif);
		font-size: clamp(28px, 6.5vw, 38px);
		color: #3d5a49;
		margin: 8px 0 0;
		line-height: 1;
	}

	.envelope-card__ornament {
		margin-top: auto;
		color: #bfa15f;
		opacity: 0.85;
	}

	/* Сам конверт */
	.envelope {
		appearance: none;
		border: 0;
		padding: 0;
		position: relative;
		width: 100%;
		height: 270px;
		background: #243b2e;
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
		z-index: 2;
		cursor: pointer;
		outline: none;
		border-radius: 0;
	}

	.envelope__liner {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, #1d3025, #284234);
		opacity: 0.9;
	}

	/* Нижний и боковые клапаны конверта */
	.envelope__fold-bottom {
		position: absolute;
		inset: 0;
		clip-path: polygon(0 100%, 50% 45%, 100% 100%);
		background: linear-gradient(0deg, #203429, #2b4537);
		box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.18);
		z-index: 3;
	}

	.envelope__fold-left {
		position: absolute;
		inset: 0;
		clip-path: polygon(0 0, 0 100%, 55% 55%);
		background: linear-gradient(90deg, #253d30, #22372b);
		z-index: 2;
	}

	.envelope__fold-right {
		position: absolute;
		inset: 0;
		clip-path: polygon(100% 0, 100% 100%, 45% 55%);
		background: linear-gradient(270deg, #253d30, #22372b);
		z-index: 2;
	}

	/* Верхний клапан с 3D отгибанием */
	.envelope__flap-top {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 165px;
		transform-origin: top center;
		transform-style: preserve-3d;
		transition: transform 0.75s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: 4;
	}

	.envelope-overlay.is-opening .envelope__flap-top {
		transform: rotateX(180deg);
		z-index: 1;
	}

	.envelope__flap-svg {
		width: 100%;
		height: 100%;
		filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.25));
	}

	/* Сургучная печать */
	.wax-seal {
		position: absolute;
		top: 135px;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 5;
		cursor: pointer;
		transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s;
	}

	.wax-seal:hover {
		transform: translate(-50%, -50%) scale(1.08);
	}

	.envelope-overlay.is-opening .wax-seal {
		transform: translate(-50%, -50%) scale(1.3);
		opacity: 0;
		pointer-events: none;
	}

	.wax-seal__outer {
		width: 76px;
		height: 76px;
		border-radius: 50%;
		background: radial-gradient(circle at 35% 30%, #f4eee2, #ded3bd 55%, #c2b192 100%);
		box-shadow:
			0 8px 24px rgba(0, 0, 0, 0.35),
			inset 0 2px 4px rgba(255, 255, 255, 0.8),
			inset 0 -3px 6px rgba(0, 0, 0, 0.25);
		display: grid;
		place-items: center;
		animation: pulse-glow 2.5s infinite ease-in-out;
	}

	.wax-seal__inner {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		border: 1px dashed rgba(145, 126, 92, 0.5);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: radial-gradient(circle at 40% 40%, #eae1d1, #d2c4ad);
		box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.15);
	}

	.wax-seal__monogram {
		font-family: var(--serif);
		font-size: 15px;
		font-weight: 600;
		letter-spacing: 0.08em;
		color: #615037;
		text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
		line-height: 1;
	}

	.wax-seal__label {
		font-family: var(--sans);
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.22em;
		color: #796850;
		margin-top: 4px;
		text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
	}

	@keyframes pulse-glow {
		0%,
		100% {
			box-shadow:
				0 8px 24px rgba(0, 0, 0, 0.35),
				0 0 0 0 rgba(222, 211, 189, 0.5);
		}
		50% {
			box-shadow:
				0 10px 28px rgba(0, 0, 0, 0.4),
				0 0 0 14px rgba(222, 211, 189, 0);
		}
	}

	.envelope-hint {
		margin-top: 24px;
		font-family: var(--sans);
		font-size: 13px;
		letter-spacing: 0.06em;
		color: rgba(255, 255, 255, 0.75);
		text-align: center;
		text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
		animation: fade-hint 2s infinite ease-in-out alternate;
	}

	@keyframes fade-hint {
		from {
			opacity: 0.6;
		}
		to {
			opacity: 1;
		}
	}

	@media (max-width: 480px) {
		.envelope-wrap {
			height: 420px;
		}

		.envelope {
			height: 240px;
		}

		.envelope-card {
			height: 250px;
			bottom: 80px;
			padding: 22px 18px;
		}

		.envelope__flap-top {
			height: 145px;
		}

		.wax-seal {
			top: 120px;
		}

		.wax-seal__outer {
			width: 68px;
			height: 68px;
		}

		.wax-seal__inner {
			width: 52px;
			height: 52px;
		}
	}
</style>
