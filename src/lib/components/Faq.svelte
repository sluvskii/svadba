<script lang="ts">
	import { content } from '#lib/content.js';
	import { pick } from '#lib/i18n.svelte.js';
	import Ornament from './Ornament.svelte';
	import Reveal from './Reveal.svelte';
</script>

<section class="section faq" id="faq">
	<div class="shell">
		<div class="faq__head">
			<Reveal>
				<p class="eyebrow">{pick(content.faq.eyebrow)}</p>
				<h2 class="display faq__title">{pick(content.faq.title)}</h2>
			</Reveal>
			<Reveal delay={100}>
				<Ornament variant="divider" class="faq__ornament" />
			</Reveal>
		</div>

		<div class="faq__list">
			{#each content.faq.items as item, index (item.q.ru)}
				<Reveal delay={index * 55}>
					<details class="faq__item" name="wedding-faq">
						<summary>
							<span class="faq__question">{pick(item.q)}</span>
							<span class="faq__icon" aria-hidden="true"></span>
						</summary>
						<p class="faq__answer">{pick(item.a)}</p>
					</details>
				</Reveal>
			{/each}
		</div>
	</div>
</section>

<style>
	.faq {
		background: var(--paper);
	}

	.faq__head {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 32px;
		margin-bottom: clamp(38px, 5vw, 58px);
	}

	.faq__title {
		max-width: 14ch;
		margin-top: 20px;
		font-size: clamp(42px, 5vw, 72px);
	}

	:global(.faq__ornament) {
		width: 180px;
		color: var(--brass);
		margin-bottom: 10px;
	}

	.faq__list {
		border-top: 1px solid var(--line);
	}

	.faq__item {
		border-bottom: 1px solid var(--line);
	}

	.faq__item summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		padding: clamp(20px, 3vw, 28px) 0;
		cursor: pointer;
		list-style: none;
	}

	.faq__item summary::-webkit-details-marker {
		display: none;
	}

	.faq__question {
		font-family: var(--serif);
		font-size: clamp(23px, 2.5vw, 32px);
		font-weight: 500;
		line-height: 1.2;
	}

	.faq__icon {
		position: relative;
		width: 22px;
		height: 22px;
		flex: 0 0 auto;
		border: 1px solid var(--line-strong);
		border-radius: 50%;
	}

	.faq__icon::before,
	.faq__icon::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 8px;
		height: 1px;
		background: var(--ink);
		transform: translate(-50%, -50%);
		transition: transform 0.3s var(--ease);
	}

	.faq__icon::after {
		transform: translate(-50%, -50%) rotate(90deg);
	}

	.faq__item[open] .faq__icon::after {
		transform: translate(-50%, -50%) rotate(0deg);
	}

	.faq__answer {
		max-width: 70ch;
		padding: 0 48px 28px 0;
		font-size: 14px;
		line-height: 1.75;
		color: var(--ink-soft);
	}

	@media (max-width: 700px) {
		.faq__head {
			flex-direction: column;
			align-items: flex-start;
			gap: 20px;
		}

		:global(.faq__ornament) {
			width: 120px;
			margin-bottom: 0;
		}

		.faq__answer {
			padding-right: 0;
			padding-bottom: 22px;
		}
	}
</style>
