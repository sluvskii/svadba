<script lang="ts">
	import { content } from '#lib/content.js';
	import { pick } from '#lib/i18n.svelte.js';
	import Monogram from './Monogram.svelte';
	import Ornament from './Ornament.svelte';
	import Reveal from './Reveal.svelte';
</script>

<section class="section section--pine rsvp" id="rsvp">
	<div class="shell rsvp__grid">
		<div class="rsvp__copy">
			<Reveal>
				<p class="eyebrow">{pick(content.rsvp.eyebrow)}</p>
				<h2 class="display rsvp__title">{pick(content.rsvp.title)}</h2>
			</Reveal>
			<Reveal delay={100}>
				<p class="lead rsvp__intro">{pick(content.rsvp.intro)}</p>
			</Reveal>
			<Reveal delay={180}>
				<p class="rsvp__note">{pick(content.rsvp.note)}</p>
			</Reveal>
		</div>

		<Reveal kind="right" delay={140} class="rsvp__card-wrap">
			<div class="rsvp__card">
				<div class="rsvp__seal">
					<Monogram size={86} />
				</div>

				<p class="rsvp__kicker">A & K · 17.12.26</p>
				<h3 class="rsvp__card-title">{pick(content.invitation.eyebrow)}</h3>
				<p class="rsvp__card-text">
					{pick(content.rsvp.intro)}
				</p>

				<a class="btn rsvp__button" href="/rsvp">
					{pick(content.rsvp.button)}
				</a>

				<div class="rsvp__card-foot">
					<Ornament variant="divider" class="rsvp__ornament" />
					<p class="tiny muted">{pick(content.rsvp.note)}</p>
				</div>
			</div>
		</Reveal>
	</div>
</section>

<style>
	.rsvp {
		overflow: hidden;
	}

	.rsvp::before {
		content: '';
		position: absolute;
		left: -180px;
		bottom: -220px;
		width: 620px;
		height: 620px;
		border: 1px solid var(--line-light);
		border-radius: 50%;
		opacity: 0.35;
		pointer-events: none;
	}

	.rsvp__grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(320px, 0.72fr);
		gap: clamp(44px, 8vw, 120px);
		align-items: center;
	}

	.rsvp__title {
		max-width: 10ch;
		margin-top: 22px;
		font-size: clamp(48px, 6vw, 88px);
	}

	.rsvp__intro {
		max-width: 44ch;
		margin-top: 28px;
	}

	.rsvp__note {
		max-width: 42ch;
		margin-top: 22px;
		padding-top: 20px;
		border-top: 1px solid var(--line-light);
		font-size: 12px;
		line-height: 1.7;
		color: rgba(247, 242, 233, 0.55);
	}

	:global(.rsvp__card-wrap) {
		display: flex;
		justify-content: center;
	}

	.rsvp__card {
		position: relative;
		width: min(100%, 390px);
		padding: 64px 34px 30px;
		border: 1px solid var(--line-light);
		background: var(--paper);
		color: var(--ink);
		text-align: center;
	}

	.rsvp__card::before {
		content: '';
		position: absolute;
		inset: 10px;
		border: 1px solid var(--line);
		pointer-events: none;
	}

	.rsvp__seal {
		position: absolute;
		top: -48px;
		left: 50%;
		transform: translateX(-50%);
		display: grid;
		place-items: center;
		padding: 10px;
		background: var(--paper);
		border-radius: 50%;
	}

	.rsvp__kicker {
		font-size: 8px;
		font-weight: 700;
		letter-spacing: 0.26em;
		color: var(--brass);
	}

	.rsvp__card-title {
		margin-top: 16px;
		font-family: var(--serif);
		font-size: clamp(34px, 4vw, 46px);
		font-weight: 400;
		line-height: 1;
	}

	.rsvp__card-text {
		max-width: 32ch;
		margin: 16px auto 0;
		font-size: 12px;
		line-height: 1.7;
		color: var(--ink-soft);
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

	.rsvp__card-foot .tiny {
		max-width: 26ch;
		letter-spacing: 0.04em;
		text-transform: none;
		line-height: 1.55;
	}

	@media (max-width: 900px) {
		.rsvp__grid {
			grid-template-columns: minmax(0, 1fr);
			gap: 56px;
		}

		:global(.rsvp__card-wrap) {
			justify-content: flex-start;
		}
	}

	@media (max-width: 620px) {
		.rsvp__card {
			width: 100%;
			padding-inline: 24px;
		}

		.rsvp__grid {
			gap: 50px;
		}
	}
</style>
