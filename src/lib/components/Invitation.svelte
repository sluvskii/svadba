<script lang="ts">
	import { content } from '#lib/content.js';
	import { pick } from '#lib/i18n.svelte.js';
	import Ornament from './Ornament.svelte';
	import Reveal from './Reveal.svelte';
</script>

<section class="section invitation" id="invitation">
	<div class="shell">
		<div class="invitation__top">
			<span class="invitation__index">01</span>
			<Ornament variant="divider" class="invitation__ornament" />
		</div>

		<div class="invitation__grid">
			<div class="invitation__intro">
				<Reveal>
					<p class="eyebrow">{pick(content.invitation.eyebrow)}</p>
					<h2 class="display invitation__title">{pick(content.invitation.title)}</h2>
				</Reveal>
				<Reveal delay={120}>
					<p class="invitation__date">{pick(content.invitation.note)}</p>
				</Reveal>
			</div>

			<div class="invitation__body">
				{#each content.invitation.paragraphs as paragraph, index (index)}
					<Reveal delay={80 + index * 80}>
						<p class="lead">{pick(paragraph)}</p>
					</Reveal>
				{/each}

				<Reveal delay={260}>
					<div class="invitation__signature">
						<Ornament variant="flower" class="invitation__flower" />
						<div>
							<p class="invitation__signature-text">{pick(content.invitation.signature)}</p>
						</div>
					</div>
				</Reveal>
			</div>
		</div>
	</div>
</section>

<style>
	.invitation {
		background: var(--paper-2);
	}

	.invitation__top {
		display: flex;
		align-items: center;
		gap: clamp(16px, 3vw, 36px);
		margin-bottom: clamp(52px, 8vw, 100px);
	}

	.invitation__index {
		font-size: 8px;
		font-weight: 700;
		letter-spacing: 0.24em;
		color: var(--ink-faint);
		white-space: nowrap;
	}

	:global(.invitation__ornament) {
		flex: 1;
		max-width: 260px;
		color: var(--brass);
	}

	.invitation__grid {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
		gap: clamp(40px, 8vw, 130px);
		align-items: start;
	}

	.invitation__title {
		max-width: 13ch;
		margin-top: 24px;
		font-size: clamp(42px, 5.6vw, 78px);
		line-height: 0.98;
	}

	.invitation__date {
		margin-top: 28px;
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.22em;
		line-height: 1.5;
		text-transform: uppercase;
		color: var(--ink-soft);
	}

	.invitation__body {
		display: flex;
		flex-direction: column;
		gap: 24px;
		padding-top: clamp(0px, 4vw, 46px);
	}

	.invitation__body .lead {
		max-width: 54ch;
	}

	.invitation__signature {
		display: flex;
		align-items: center;
		gap: 18px;
		margin-top: 14px;
		padding-top: 24px;
		border-top: 1px solid var(--line);
	}

	:global(.invitation__flower) {
		width: 28px;
		height: 40px;
		color: var(--sage);
		flex: 0 0 auto;
	}

	.invitation__signature-text {
		font-family: var(--serif);
		font-size: clamp(24px, 2.2vw, 31px);
		font-style: italic;
		line-height: 1.2;
	}

	@media (max-width: 900px) {
		.invitation__grid {
			grid-template-columns: minmax(0, 1fr);
			gap: 34px;
		}

		.invitation__title {
			max-width: 16ch;
		}
	}

	@media (max-width: 620px) {
		.invitation__top {
			margin-bottom: 42px;
		}

		:global(.invitation__ornament) {
			max-width: 90px;
		}

		.invitation__index:last-child {
			display: none;
		}
	}
</style>
