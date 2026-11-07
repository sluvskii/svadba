<script lang="ts">
	import { content } from '#lib/content.js';
	import { pick } from '#lib/i18n.svelte.js';
	import Monogram from './Monogram.svelte';
	import Ornament from './Ornament.svelte';
	import Reveal from './Reveal.svelte';
</script>

<section class="section rsvp" id="rsvp">
	<div class="shell rsvp__grid">
		<div class="rsvp__copy">
			<Reveal>
				<p class="eyebrow">{pick(content.rsvp.eyebrow)}</p>
				<h2 class="display rsvp__title">{pick(content.rsvp.title)}</h2>
			</Reveal>
			<Reveal delay={100}>
				<p class="lead rsvp__intro">{pick(content.rsvp.intro)}</p>
			</Reveal>
		</div>

		<Reveal kind="right" delay={140} class="rsvp__card-wrap">
			<div class="rsvp__card">
				<div class="rsvp__seal">
					<Monogram size={86} />
				</div>

				<h3 class="rsvp__card-title">{pick(content.invitation.eyebrow)}</h3>

				<a class="btn rsvp__button" href="/rsvp">
					{pick(content.rsvp.button)}
				</a>

				<div class="rsvp__card-foot">
					<Ornament variant="divider" class="rsvp__ornament" />
				</div>
			</div>
		</Reveal>
	</div>
</section>

<style>
	.rsvp {
		position: relative;
		background: var(--paper-3);
		overflow: hidden;
	}

	.rsvp::before {
		content: '';
		position: absolute;
		right: -140px;
		top: -160px;
		width: 520px;
		height: 520px;
		border: 1px solid var(--line);
		border-radius: 50%;
		opacity: 0.6;
		pointer-events: none;
	}

	.rsvp__grid {
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
		gap: clamp(44px, 8vw, 110px);
		align-items: center;
		position: relative;
		z-index: 1;
	}

	.rsvp__title {
		max-width: 12ch;
		margin-top: 20px;
		font-size: clamp(44px, 5.8vw, 84px);
		line-height: 1.02;
		color: var(--ink);
	}

	.rsvp__intro {
		max-width: 44ch;
		margin-top: 24px;
		color: var(--ink-soft);
	}

	:global(.rsvp__card-wrap) {
		display: flex;
		justify-content: center;
	}

	.rsvp__card {
		position: relative;
		width: min(100%, 420px);
		padding: 68px 38px 36px;
		border: 1px solid var(--line);
		border-radius: 0;
		background: #ffffff;
		color: var(--ink);
		text-align: center;
		box-shadow: none;
	}

	.rsvp__card::before {
		content: '';
		position: absolute;
		inset: 10px;
		border: 1px solid var(--line);
		border-radius: 0;
		pointer-events: none;
	}

	.rsvp__seal {
		position: absolute;
		top: -46px;
		left: 50%;
		transform: translateX(-50%);
		display: grid;
		place-items: center;
		padding: 10px;
		background: #ffffff;
		border-radius: 50%;
		box-shadow: 0 6px 20px -2px rgba(25, 30, 27, 0.08);
		border: 1px solid var(--line);
	}

	.rsvp__card-title {
		margin-top: 14px;
		font-family: var(--serif);
		font-size: clamp(32px, 3.8vw, 44px);
		font-weight: 400;
		line-height: 1;
		color: var(--ink);
	}

	.rsvp__button {
		margin-top: 28px;
		width: 100%;
	}

	.rsvp__card-foot {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		margin-top: 26px;
		padding-top: 20px;
		border-top: 1px solid var(--line);
	}

	:global(.rsvp__ornament) {
		width: 100px;
		color: var(--brass);
	}

	@media (max-width: 900px) {
		.rsvp__grid {
			grid-template-columns: minmax(0, 1fr);
			gap: 56px;
		}

		:global(.rsvp__card-wrap) {
			justify-content: center;
		}
	}

	@media (max-width: 620px) {
		.rsvp__card {
			width: 100%;
			padding-inline: 24px;
			padding-top: 58px;
		}

		.rsvp__grid {
			gap: 46px;
		}
	}
</style>
