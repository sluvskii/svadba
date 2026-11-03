<script lang="ts">
	import { content } from '#lib/content.js';
	import { pick } from '#lib/i18n.svelte.js';
	import Ornament from './Ornament.svelte';
	import Reveal from './Reveal.svelte';
</script>

<section class="section section--sand menu" id="menu">
	<div class="shell">
		<div class="menu__head">
			<Reveal>
				<p class="eyebrow">{pick(content.menu.eyebrow)}</p>
				<h2 class="display menu__title">{pick(content.menu.title)}</h2>
			</Reveal>
			<Reveal delay={100}>
				<p class="lead menu__intro">{pick(content.menu.intro)}</p>
			</Reveal>
		</div>

		<div class="menu__courses">
			{#each content.menu.courses as course, index (course.label.ru)}
				<Reveal delay={index * 90} class="menu__course">
					<div class="menu__course-top">
						<span class="menu__num">0{index + 1}</span>
						<span class="menu__label">{pick(course.label)}</span>
					</div>
					<h3 class="menu__name">{pick(course.title)}</h3>
					<p class="menu__text">{pick(course.text)}</p>
				</Reveal>
			{/each}
		</div>

		<Reveal delay={120}>
			<div class="menu__bar">
				<Ornament variant="divider" class="menu__ornament" />
				<p>{pick(content.menu.bar)}</p>
			</div>
		</Reveal>
	</div>
</section>

<style>
	.menu {
		background: var(--paper-3);
	}

	.menu__head {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 0.8fr);
		align-items: end;
		gap: 40px;
		margin-bottom: clamp(42px, 6vw, 70px);
	}

	.menu__title {
		margin-top: 20px;
		font-size: clamp(42px, 5vw, 72px);
	}

	.menu__intro {
		max-width: 40ch;
		padding-bottom: 6px;
	}

	.menu__courses {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0;
		border-top: 1px solid var(--line);
		border-left: 1px solid var(--line);
	}

	:global(.menu__course) {
		padding: clamp(22px, 3vw, 34px);
		border-right: 1px solid var(--line);
		border-bottom: 1px solid var(--line);
	}

	.menu__course-top {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
	}

	.menu__num {
		font-family: var(--serif);
		font-size: 18px;
		color: var(--brass);
	}

	.menu__label {
		font-size: 8px;
		font-weight: 700;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--ink-faint);
	}

	.menu__name {
		margin-top: clamp(28px, 4vw, 48px);
		font-family: var(--serif);
		font-size: clamp(26px, 2.6vw, 36px);
		font-weight: 500;
		line-height: 1.1;
	}

	.menu__text {
		max-width: 28ch;
		margin-top: 10px;
		font-size: 12px;
		line-height: 1.7;
		color: var(--ink-soft);
	}

	.menu__bar {
		display: flex;
		align-items: center;
		gap: clamp(22px, 4vw, 48px);
		margin-top: clamp(34px, 5vw, 52px);
		padding-top: 24px;
		border-top: 1px solid var(--line);
	}

	:global(.menu__ornament) {
		width: 140px;
		flex: 0 0 auto;
		color: var(--brass);
	}

	.menu__bar p {
		max-width: 62ch;
		font-size: 12px;
		line-height: 1.7;
		color: var(--ink-soft);
	}

	@media (max-width: 900px) {
		.menu__head {
			grid-template-columns: minmax(0, 1fr);
			gap: 18px;
			align-items: start;
		}

		.menu__courses {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	@media (max-width: 620px) {
		.menu__bar {
			flex-direction: column;
			align-items: flex-start;
			gap: 18px;
		}

		:global(.menu__ornament) {
			width: 110px;
		}
	}
</style>
