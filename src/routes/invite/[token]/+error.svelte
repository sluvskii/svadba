<script lang="ts">
	import { page } from '$app/state';
	import { ui } from '#lib/content.js';
	import { pick } from '#lib/i18n.svelte.js';
	import Ornament from '#lib/components/Ornament.svelte';
</script>

<svelte:head>
	<title>{pick(ui.invite.notFoundTitle)}</title>
</svelte:head>

<div class="invite-error">
	<Ornament variant="divider" class="invite-error__ornament" />
	<h1 class="display invite-error__title">{pick(ui.invite.notFoundTitle)}</h1>
	<p class="lead invite-error__text">{pick(ui.invite.notFoundText)}</p>
	<a class="btn" href="/">{pick(ui.invite.backHome)}</a>
	<p class="tiny muted invite-error__code">{page.error?.message ?? '404'}</p>
</div>

<style>
	.invite-error {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 18px;
		min-height: 100svh;
		justify-content: center;
		padding: 40px;
		background: var(--paper);
		text-align: center;
	}

	:global(.invite-error__ornament) {
		width: 180px;
		color: var(--brass);
	}

	.invite-error__title {
		font-size: clamp(36px, 5vw, 60px);
	}

	.invite-error__text {
		max-width: 40ch;
	}

	.invite-error__code {
		margin-top: 12px;
	}
</style>
