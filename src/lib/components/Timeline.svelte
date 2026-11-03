<script lang="ts">
	import { content } from '#lib/content.js';
	import { pick } from '#lib/i18n.svelte.js';
	import Reveal from './Reveal.svelte';
</script>

<section class="section section--paper timeline" id="timeline">
	<div class="shell">
		<div class="timeline__head">
			<Reveal>
				<p class="eyebrow">{pick(content.timeline.eyebrow)}</p>
				<h2 class="display timeline__title">{pick(content.timeline.title)}</h2>
			</Reveal>
			<Reveal delay={100}>
				<p class="lead timeline__intro">{pick(content.timeline.intro)}</p>
			</Reveal>
		</div>

		<ol class="timeline__list">
			{#each content.timeline.items as item, index (item.time)}
				<Reveal delay={index * 60} class="timeline__reveal">
					<li class="timeline__item">
						<span class="timeline__time">{item.time}</span>
						<span class="timeline__dot" aria-hidden="true"></span>
						<div class="timeline__content">
							<h3 class="timeline__name">{pick(item.title)}</h3>
							<p class="timeline__text">{pick(item.text)}</p>
						</div>
					</li>
				</Reveal>
			{/each}
		</ol>
	</div>
</section>

<style>
	.timeline {
		background: var(--paper-2);
	}

	.timeline__head {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 0.72fr);
		align-items: end;
		gap: 40px;
		margin-bottom: clamp(42px, 6vw, 70px);
	}

	.timeline__title {
		max-width: 14ch;
		margin-top: 20px;
		font-size: clamp(42px, 5vw, 72px);
	}

	.timeline__intro {
		max-width: 38ch;
		padding-bottom: 6px;
	}

	.timeline__list {
		position: relative;
		border-top: 1px solid var(--line);
	}

	.timeline__list::before {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: clamp(78px, 12vw, 150px);
		width: 1px;
		background: var(--line);
	}

	:global(.timeline__reveal) {
		position: relative;
		z-index: 1;
	}

	.timeline__item {
		display: grid;
		grid-template-columns: clamp(78px, 12vw, 150px) 1fr;
		gap: clamp(28px, 5vw, 64px);
		padding: clamp(24px, 3.4vw, 38px) 0;
		border-bottom: 1px solid var(--line);
		transition: background-color 0.35s var(--ease);
	}

	.timeline__item:hover {
		background: rgba(255, 255, 255, 0.3);
	}

	.timeline__time {
		font-family: var(--serif);
		font-size: clamp(30px, 3.2vw, 42px);
		line-height: 1;
		color: var(--pine);
		font-variant-numeric: tabular-nums;
	}

	.timeline__dot {
		position: absolute;
		left: clamp(78px, 12vw, 150px);
		top: clamp(34px, 4.4vw, 48px);
		width: 9px;
		height: 9px;
		border: 1px solid var(--brass);
		background: var(--paper-2);
		border-radius: 50%;
		transform: translate(-50%, -50%);
		transition:
			background-color 0.3s var(--ease),
			transform 0.3s var(--ease);
	}

	.timeline__item:hover .timeline__dot {
		background: var(--brass);
		transform: translate(-50%, -50%) scale(1.25);
	}

	.timeline__content {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding-right: 8%;
	}

	.timeline__name {
		font-family: var(--serif);
		font-size: clamp(26px, 2.8vw, 38px);
		font-weight: 500;
		line-height: 1.1;
	}

	.timeline__text {
		max-width: 56ch;
		font-size: 13px;
		line-height: 1.7;
		color: var(--ink-soft);
	}

	@media (max-width: 800px) {
		.timeline__head {
			grid-template-columns: minmax(0, 1fr);
			gap: 18px;
			align-items: start;
		}

		.timeline__list::before {
			display: none;
		}

		.timeline__item {
			grid-template-columns: minmax(0, 1fr);
			gap: 8px;
			padding: 24px 0;
		}

		.timeline__dot {
			display: none;
		}

		.timeline__content {
			padding-right: 0;
		}
	}
</style>
