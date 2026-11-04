<script lang="ts">
	import { content } from '#lib/content.js';
	import { pick } from '#lib/i18n.svelte.js';
	import Monogram from './Monogram.svelte';
	import Ornament from './Ornament.svelte';
</script>

<footer class="footer">
	<div class="footer__watermark" aria-hidden="true">А & К</div>

	<div class="shell footer__inner">
		<Ornament variant="divider" class="footer__ornament" />

		<div class="footer__main">
			<Monogram size={92} light />
			<h2 class="display footer__names">{pick(content.footer.names)}</h2>
			<p class="footer__date">{pick(content.footer.date)}</p>
			<p class="footer__place">{pick(content.footer.place)}</p>
			<p class="footer__note">{pick(content.footer.note)}</p>
		</div>

		<div class="footer__bottom">
			<span>© 2026</span>
			<a href="#top">{pick(content.footer.top)} ↑</a>
		</div>
	</div>
</footer>

<style>
	.footer {
		position: relative;
		overflow: hidden;
		padding-block: clamp(60px, 9vw, 110px) 28px;
		background: var(--pine-deep);
		color: var(--paper);
	}

	.footer__watermark {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		font-family: var(--serif);
		font-size: clamp(280px, 44vw, 640px);
		font-weight: 300;
		line-height: 0.7;
		letter-spacing: -0.05em;
		color: var(--paper);
		opacity: 0.035;
		pointer-events: none;
		user-select: none;
		white-space: nowrap;
	}

	.footer__inner {
		position: relative;
		z-index: 1;
	}

	:global(.footer__ornament) {
		width: 140px;
		color: var(--brass-light);
		margin-inline: auto;
		opacity: 0.7;
	}

	.footer__main {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		margin-top: 36px;
	}

	.footer__names {
		margin-top: 26px;
		font-size: clamp(40px, 6vw, 76px);
		color: var(--paper);
	}

	.footer__date {
		font-family: var(--sans);
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.28em;
		text-transform: uppercase;
		color: var(--brass-light);
		margin-top: 18px;
	}

	.footer__place {
		font-family: var(--serif);
		font-style: italic;
		font-size: 1.15rem;
		color: rgba(247, 242, 233, 0.72);
		margin-top: 6px;
	}

	.footer__note {
		max-width: 44ch;
		margin-top: 32px;
		font-size: 13px;
		line-height: 1.8;
		color: rgba(247, 242, 233, 0.58);
	}

	.footer__bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		margin-top: clamp(48px, 7vw, 90px);
		padding-top: 22px;
		border-top: 1px solid var(--line-light);
		font-size: 7px;
		font-weight: 650;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: rgba(247, 242, 233, 0.42);
	}

	.footer__bottom a {
		transition: color 0.25s var(--ease);
	}

	.footer__bottom a:hover {
		color: var(--paper);
	}

	@media (max-width: 520px) {
		.footer__bottom {
			justify-content: space-between;
		}
	}
</style>
