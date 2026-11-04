<script lang="ts">
	import { content } from '#lib/content.js';
	import { pick } from '#lib/i18n.svelte.js';
	import Countdown from './Countdown.svelte';
	import Header from './Header.svelte';
	import Monogram from './Monogram.svelte';
	import Ornament from './Ornament.svelte';
	import Reveal from './Reveal.svelte';
	import Snow from './Snow.svelte';

	type Props = {
		inviteHref?: string;
	};

	let { inviteHref = '#rsvp' }: Props = $props();
</script>

<section class="hero" id="top">
	<Header {inviteHref} />

	<div class="hero__frame" aria-hidden="true"></div>
	<div class="hero__watermark" aria-hidden="true">17</div>
	<Snow />

	<div class="hero__inner shell">
		<div class="hero__copy">
			<Reveal>
				<p class="eyebrow">{pick(content.hero.eyebrow)}</p>
			</Reveal>

			<Reveal delay={100}>
				<h1 class="hero__names display">
					<span class="hero__name">{pick(content.hero.names[0])}</span>
					<span class="hero__amp">{content.hero.ampersand}</span>
					<span class="hero__name">{pick(content.hero.names[1])}</span>
				</h1>
			</Reveal>

			<Reveal delay={180}>
				<div class="hero__meta">
					<span>{pick(content.hero.date)}</span>
					<span class="hero__meta-dot" aria-hidden="true"></span>
					<span>{pick(content.hero.city)}</span>
				</div>
			</Reveal>

			<Reveal delay={240}>
				<p class="hero__note hero__note--script">{pick(content.hero.note)}</p>
			</Reveal>

			<Reveal delay={300}>
				<div class="hero__actions">
					<a class="btn" href="#details">{pick(content.hero.cta)}</a>
					<a class="link-line hero__link" href="#invitation">
						<span>{pick(content.invitation.eyebrow)}</span>
						<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
							<path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" stroke-width="1.1" />
						</svg>
					</a>
				</div>
			</Reveal>
		</div>

		<Reveal kind="right" delay={180} class="hero__visual">
			<div class="hero__arch">
				<div class="hero__arch-line" aria-hidden="true"></div>
				<div class="hero__photo">
					<Ornament variant="sprig" class="hero__sprig" />
					<span class="hero__photo-caption">{pick(content.hero.photoCaption)}</span>
				</div>
				<div class="hero__seal">
					<Monogram size={92} />
				</div>
			</div>
		</Reveal>
	</div>

	<div class="hero__bottom shell">
		<Countdown />
		<a class="hero__scroll" href="#invitation">
			<span>{pick(content.hero.scroll)}</span>
			<svg viewBox="0 0 18 28" fill="none" aria-hidden="true">
				<path d="M9 1v24M2 18l7 8 7-8" stroke="currentColor" stroke-width="1.2" />
			</svg>
		</a>
	</div>
</section>

<style>
	.hero {
		position: relative;
		display: flex;
		flex-direction: column;
		min-height: 100svh;
		padding-top: 110px;
		overflow: hidden;
		background: var(--paper);
	}

	.hero__frame {
		position: absolute;
		inset: 18px;
		border: 1px solid var(--line);
		pointer-events: none;
	}

	.hero__watermark {
		position: absolute;
		right: 3%;
		top: 36%;
		transform: translateY(-50%);
		font-family: var(--serif);
		font-size: clamp(260px, 38vw, 620px);
		font-weight: 300;
		line-height: 0.7;
		letter-spacing: -0.06em;
		color: var(--ink);
		opacity: 0.022;
		pointer-events: none;
		user-select: none;
		z-index: 0;
	}

	.hero__inner {
		position: relative;
		z-index: 1;
		display: grid;
		grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
		align-items: center;
		gap: clamp(32px, 7vw, 110px);
		flex: 1;
		padding-block: clamp(34px, 5vh, 68px);
	}

	.hero__copy {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.hero__names {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		margin-top: clamp(18px, 3vh, 32px);
		font-size: clamp(66px, 10vw, 138px);
		line-height: 0.78;
		letter-spacing: -0.025em;
	}

	.hero__name {
		display: block;
	}

	.hero__amp {
		display: block;
		margin-left: 0.42em;
		margin-block: 0.08em 0.12em;
		font-size: 0.38em;
		font-style: italic;
		font-weight: 300;
		line-height: 0.8;
		color: var(--brass);
	}

	.hero__meta {
		display: flex;
		align-items: center;
		gap: 14px;
		margin-top: clamp(24px, 4vh, 42px);
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.22em;
		line-height: 1.4;
		text-transform: uppercase;
		color: var(--ink-soft);
	}

	.hero__meta-dot {
		width: 3px;
		height: 3px;
		background: var(--brass);
		border-radius: 50%;
	}

	.hero__note {
		max-width: 36ch;
		margin-top: 20px;
		font-size: clamp(15px, 1.2vw, 17px);
		line-height: 1.72;
		color: var(--ink-soft);
	}

	/* Тёплая рукописная строка поверх типографики */
	.hero__note--script {
		max-width: 24ch;
		font-family: var(--font-script);
		font-size: clamp(22px, 2.2vw, 30px);
		line-height: 1.35;
		color: var(--pine);
	}

	.hero__actions {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 24px;
		margin-top: clamp(28px, 4vh, 40px);
	}

	.hero__link {
		color: var(--ink-soft);
	}

	:global(.hero__visual) {
		display: flex;
		justify-content: flex-end;
	}

	.hero__arch {
		position: relative;
		width: min(100%, 430px);
	}

	.hero__arch-line {
		position: absolute;
		inset: -15px -15px 0;
		border: 1px solid var(--brass);
		border-bottom: 0;
		border-radius: 999px 999px 0 0;
		opacity: 0.42;
		pointer-events: none;
	}

	.hero__photo {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 0.72;
		max-height: 570px;
		overflow: hidden;
		border: 1px solid var(--line);
		border-radius: 999px 999px 0 0;
		background: #e8e9df;
	}

	.hero__photo::before {
		content: '';
		position: absolute;
		inset: 12px;
		border: 1px solid rgba(43, 71, 58, 0.16);
		border-radius: 999px 999px 0 0;
	}

	:global(.hero__sprig) {
		width: clamp(120px, 16vw, 190px);
		height: auto;
		color: var(--pine);
		opacity: 0.42;
		transform: translateY(-4%);
	}

	.hero__photo-caption {
		position: absolute;
		bottom: 26px;
		left: 50%;
		transform: translateX(-50%);
		font-size: 8px;
		font-weight: 700;
		letter-spacing: 0.26em;
		text-transform: uppercase;
		color: var(--ink-soft);
		white-space: nowrap;
	}

	.hero__seal {
		position: absolute;
		left: -34px;
		bottom: 54px;
		display: grid;
		place-items: center;
		padding: 10px;
		background: var(--paper);
		border-radius: 50%;
	}

	.hero__bottom {
		position: relative;
		z-index: 2;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 24px;
		padding-block: 28px 36px;
		border-top: 1px solid var(--line);
	}

	.hero__scroll {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		padding: 10px 18px;
		border-radius: 0;
		background: transparent;
		border: 1px solid var(--line);
		font-size: 8px;
		font-weight: 700;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: var(--ink-soft);
		transition:
			color 0.3s var(--ease),
			border-color 0.3s var(--ease),
			background-color 0.3s var(--ease);
	}

	.hero__scroll:hover {
		color: var(--ink);
		background: #ffffff;
		border-color: var(--line-strong);
	}

	.hero__scroll svg {
		width: 12px;
		height: 18px;
		color: var(--pine);
		animation: scroll-bob 2.2s ease-in-out infinite;
	}

	@keyframes scroll-bob {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(4px);
		}
	}

	@media (max-width: 1080px) {
		.hero {
			min-height: auto;
			padding-top: 92px;
		}

		.hero__inner {
			grid-template-columns: minmax(0, 1fr);
			gap: 56px;
			padding-block: 48px 56px;
		}

		:global(.hero__visual) {
			justify-content: center;
		}

		.hero__arch {
			width: min(100%, 400px);
		}

		.hero__bottom {
			margin-top: 0;
		}
	}

	@media (max-width: 620px) {
		.hero {
			padding-top: 78px;
		}

		.hero__frame {
			inset: 9px;
		}

		.hero__inner {
			padding-block: 38px 48px;
		}

		.hero__names {
			font-size: clamp(64px, 20vw, 92px);
		}

		.hero__meta {
			flex-wrap: wrap;
			gap: 8px 10px;
		}

		.hero__actions {
			gap: 20px;
			width: 100%;
		}

		.hero__arch {
			width: min(86%, 330px);
		}

		.hero__seal {
			left: -22px;
			bottom: 34px;
			padding: 8px;
		}

		.hero__photo {
			max-height: 420px;
		}

		.hero__bottom {
			flex-direction: column;
			align-items: flex-start;
			gap: 22px;
			padding-block: 22px 28px;
		}

		.hero__scroll {
			align-self: flex-end;
		}
	}
</style>
