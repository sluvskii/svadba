<script lang="ts">
	import { content } from '#lib/content.js';
	import { pick } from '#lib/i18n.svelte.js';
	import Ornament from './Ornament.svelte';
	import Reveal from './Reveal.svelte';
</script>

<section class="section dress" id="dresscode">
	<div class="shell">
		<div class="dress__grid">
			<div class="dress__copy">
				<Reveal>
					<p class="eyebrow">{pick(content.dressCode.eyebrow)}</p>
					<h2 class="display dress__title">{pick(content.dressCode.title)}</h2>
				</Reveal>

				<Reveal delay={100}>
					<p class="lead dress__text">{pick(content.dressCode.text)}</p>
				</Reveal>

				{#if pick(content.dressCode.note)}
					<Reveal delay={180}>
						<div class="dress__note">
							<Ornament variant="flower" class="dress__flower" />
							<p>{pick(content.dressCode.note)}</p>
						</div>
					</Reveal>
				{/if}
			</div>

			<Reveal kind="right" delay={120} class="dress__palette-wrap">
				<div class="dress__palette-head">
					<span class="tiny muted">{pick(content.dressCode.eyebrow)}</span>
				</div>

				<div class="dress__palette">
					{#each content.dressCode.palette as color (color.hex)}
						<div class="dress__swatch">
							<div class="dress__color" style={`background: ${color.hex}`}></div>
							<div class="dress__swatch-label">
								<span>{pick(color.name)}</span>
								<span class="dress__hex">{color.hex}</span>
							</div>
						</div>
					{/each}
				</div>
			</Reveal>
		</div>
	</div>
</section>

<style>
	.dress {
		background: var(--paper);
	}

	.dress__grid {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
		gap: clamp(44px, 8vw, 120px);
		align-items: center;
	}

	.dress__title {
		max-width: 13ch;
		margin-top: 20px;
		font-size: clamp(42px, 5vw, 72px);
	}

	.dress__text {
		max-width: 44ch;
		margin-top: 26px;
	}

	.dress__note {
		display: flex;
		align-items: flex-start;
		gap: 14px;
		max-width: 46ch;
		margin-top: 30px;
		padding-top: 22px;
		border-top: 1px solid var(--line);
		font-size: 12px;
		line-height: 1.7;
		color: var(--ink-soft);
	}

	:global(.dress__flower) {
		width: 22px;
		height: 32px;
		color: var(--brass);
		flex: 0 0 auto;
		margin-top: 2px;
	}

	:global(.dress__palette-wrap) {
		padding: 26px;
		border: 1px solid var(--line);
		background: var(--paper-2);
	}

	.dress__palette-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 18px;
		padding-bottom: 18px;
		border-bottom: 1px solid var(--line);
	}

	.dress__palette {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 10px 14px;
		padding-block: 18px;
	}

	.dress__swatch {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.dress__color {
		width: 100%;
		aspect-ratio: 0.58;
		border: 1px solid rgba(32, 36, 31, 0.08);
		transition: transform 0.5s var(--ease);
		transform-origin: bottom;
	}

	.dress__swatch:hover .dress__color {
		transform: scaleY(1.04);
	}

	.dress__swatch-label {
		display: flex;
		flex-direction: column;
		gap: 2px;
		font-size: 9px;
		font-weight: 650;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		line-height: 1.4;
	}

	.dress__hex {
		font-size: 7px;
		font-weight: 500;
		letter-spacing: 0.12em;
		color: var(--ink-faint);
	}


	@media (max-width: 900px) {
		.dress__grid {
			grid-template-columns: minmax(0, 1fr);
			gap: 40px;
		}

		:global(.dress__palette-wrap) {
			max-width: 620px;
		}
	}

	@media (max-width: 620px) {
		:global(.dress__palette-wrap) {
			padding: 16px;
		}

		.dress__palette {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 12px 10px;
			padding-block: 14px;
		}

		.dress__swatch {
			gap: 8px;
		}

		.dress__color {
			aspect-ratio: 0.68;
		}
	}
</style>
