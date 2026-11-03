<script lang="ts">
	import { content } from '#lib/content.js';
	import { pick } from '#lib/i18n.svelte.js';
	import Ornament from './Ornament.svelte';
	import Reveal from './Reveal.svelte';

	// Главы истории заполняются в админке; пока их нет — секция не показывается.
	const chapters = $derived(content.story.chapters);
	const cols = $derived(Math.min(Math.max(chapters.length, 1), 4));
	const colsClass = $derived(cols === 1 ? 'story__grid--one' : cols === 2 ? 'story__grid--two' : '');
</script>

{#if chapters.length > 0}
	<section class="section story" id="story">
		<div class="shell">
			<div class="story__head">
				<Reveal>
					<p class="eyebrow">{pick(content.story.eyebrow)}</p>
					<h2 class="display story__title">{pick(content.story.title)}</h2>
				</Reveal>
				<Reveal delay={100}>
					<p class="lead story__intro">{pick(content.story.intro)}</p>
				</Reveal>
			</div>

			<div class="story__grid {colsClass}" style={`--story-cols: ${cols}`}>
				{#each chapters as chapter, index (chapter.numeral)}
					<Reveal delay={index * 90} class="story__card">
						<div class="story__media story__media--{chapter.tone}">
							<span class="story__numeral display">{chapter.numeral}</span>
							{#if chapter.tone === 'pine'}
								<Ornament variant="flower" class="story__flower story__flower--light" />
							{:else}
								<Ornament variant="flower" class="story__flower" />
							{/if}
						</div>
						<div class="story__copy">
							<h3 class="story__name">{pick(chapter.title)}</h3>
							<p class="story__text">{pick(chapter.text)}</p>
						</div>
					</Reveal>
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	.story {
		background: var(--paper);
	}

	.story__head {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 0.75fr);
		align-items: end;
		gap: 40px;
		margin-bottom: clamp(48px, 7vw, 84px);
	}

	.story__title {
		margin-top: 20px;
		font-size: clamp(42px, 5vw, 72px);
	}

	.story__intro {
		max-width: 40ch;
		padding-bottom: 8px;
	}

	.story__grid {
		display: grid;
		grid-template-columns: repeat(var(--story-cols, 4), minmax(0, 1fr));
		gap: clamp(14px, 2.2vw, 28px);
	}

	/* Одна-две главы: не растягиваем карточки на всю ширину */
	.story__grid--one {
		max-width: 440px;
		margin-inline: auto;
	}

	.story__grid--two {
		max-width: 780px;
		margin-inline: auto;
	}

	.story__card {
		display: flex;
		flex-direction: column;
	}

	.story__media {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 0.78;
		overflow: hidden;
		border: 1px solid var(--line);
	}

	.story__media::before {
		content: '';
		position: absolute;
		inset: 10px;
		border: 1px solid currentColor;
		opacity: 0.12;
	}

	.story__media--sage {
		background: #dfe5da;
		color: var(--pine);
	}

	.story__media--sand {
		background: #e9dfcc;
		color: var(--ink);
	}

	.story__media--pine {
		background: var(--pine);
		color: var(--paper);
	}

	.story__media--paper {
		background: #efe7d9;
		color: var(--ink);
	}

	.story__numeral {
		font-size: clamp(54px, 6vw, 84px);
		line-height: 1;
		opacity: 0.85;
	}

	.story__flower {
		position: absolute;
		right: 16px;
		bottom: 14px;
		width: 24px;
		height: 34px;
		opacity: 0.55;
	}

	.story__flower--light {
		color: var(--brass-light);
	}

	.story__copy {
		padding-top: 18px;
	}

	.story__name {
		font-family: var(--serif);
		font-size: clamp(22px, 2.2vw, 29px);
		font-weight: 500;
		line-height: 1.12;
	}

	.story__text {
		margin-top: 8px;
		font-size: 12px;
		line-height: 1.65;
		color: var(--ink-soft);
	}

	@media (max-width: 1000px) {
		.story__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			row-gap: 36px;
		}
	}

	@media (max-width: 800px) {
		.story__head {
			grid-template-columns: minmax(0, 1fr);
			gap: 18px;
			align-items: start;
		}
	}

	@media (max-width: 520px) {
		.story__grid {
			grid-template-columns: minmax(0, 1fr);
		}

		.story__media {
			aspect-ratio: 1.1;
		}
	}
</style>
