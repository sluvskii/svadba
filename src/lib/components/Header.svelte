<script lang="ts">
	import { browser } from '$app/env';
	import { fade } from 'svelte/transition';
	import { content, ui } from '#lib/content.js';
	import { i18n, pick, setLang } from '#lib/i18n.svelte.js';
	import Monogram from './Monogram.svelte';
	import Ornament from './Ornament.svelte';

	type Props = {
		inviteHref?: string;
	};

	let { inviteHref = '#rsvp' }: Props = $props();

	let scrolled = $state(false);

	$effect(() => {
		if (!browser) return;
		const onScroll = () => {
			scrolled = window.scrollY > 24;
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	$effect(() => {
		if (!browser) return;
		document.body.classList.toggle('is-locked', i18n.menuOpen);
		return () => document.body.classList.remove('is-locked');
	});

	function closeMenu() {
		i18n.menuOpen = false;
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') closeMenu();
	}
</script>

<svelte:window onkeydown={onKeydown} />

<header class="header" class:header--stuck={scrolled}>
	<div class="header__inner shell">
		<a class="brand" href="/" onclick={closeMenu} aria-label="Алина и Камиль — на главную">
			<Monogram size={38} />
			<span class="brand__text">
				<span class="brand__names">Алина & Камиль</span>
				<span class="brand__date">17 · 12 · 2026</span>
			</span>
		</a>

		<nav class="nav" aria-label="Основная навигация">
			{#each content.nav as item (item.href)}
				<a class="nav__link" href={item.href}>{pick(item.label)}</a>
			{/each}
		</nav>

		<div class="header__actions">
			<div class="lang" aria-label="Язык сайта">
				<button
					class="lang__btn"
					class:is-active={i18n.lang === 'ru'}
					type="button"
					onclick={() => setLang('ru')}
					aria-pressed={i18n.lang === 'ru'}>РУС</button
				>
				<span class="lang__sep" aria-hidden="true">/</span>
				<button
					class="lang__btn"
					class:is-active={i18n.lang === 'tt'}
					type="button"
					onclick={() => setLang('tt')}
					aria-pressed={i18n.lang === 'tt'}>ТАТ</button
				>
			</div>

			<a class="header__cta" href={inviteHref}>{pick(ui.rsvp)}</a>

			<button
				class="burger"
				type="button"
				aria-label={pick(ui.menu)}
				aria-expanded={i18n.menuOpen}
				onclick={() => (i18n.menuOpen = !i18n.menuOpen)}
			>
				<span></span>
				<span></span>
			</button>
		</div>
	</div>
</header>

{#if i18n.menuOpen}
	<div class="mobile-menu" transition:fade={{ duration: 220 }}>
		<div class="mobile-menu__top shell">
			<Monogram size={52} />
			<button class="mobile-menu__close" type="button" onclick={closeMenu}>
				<span>{pick(ui.close)}</span>
				<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
					<path d="M3 3l14 14M17 3L3 17" stroke="currentColor" stroke-width="1.2" />
				</svg>
			</button>
		</div>

		<nav class="mobile-menu__nav shell" aria-label="Мобильная навигация">
			{#each content.nav as item, index (item.href)}
				<a
					class="mobile-menu__link"
					href={item.href}
					onclick={closeMenu}
					transition:fade={{ duration: 300, delay: 60 + index * 45 }}
				>
					<span class="mobile-menu__num">0{index + 1}</span>
					<span>{pick(item.label)}</span>
				</a>
			{/each}
		</nav>

		<div class="mobile-menu__bottom shell">
			<Ornament variant="divider" class="mobile-menu__ornament" />
			<div class="mobile-menu__meta">
				<span>17.12.2026</span>
				<span>Нефтекамск</span>
			</div>
			<a class="btn" href={inviteHref} onclick={closeMenu}>{pick(ui.rsvp)}</a>
			<div class="mobile-menu__lang">
				<button
					class="lang__btn"
					class:is-active={i18n.lang === 'ru'}
					type="button"
					onclick={() => setLang('ru')}>РУС</button
				>
				<span class="lang__sep">/</span>
				<button
					class="lang__btn"
					class:is-active={i18n.lang === 'tt'}
					type="button"
					onclick={() => setLang('tt')}>ТАТ</button
				>
			</div>
		</div>
	</div>
{/if}

<style>
	.header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 50;
		border-bottom: 1px solid transparent;
		transition:
			background-color 0.35s var(--ease),
			border-color 0.35s var(--ease);
	}

	.header--stuck {
		background: rgba(247, 242, 233, 0.96);
		border-bottom-color: var(--line);
		backdrop-filter: blur(6px);
	}

	.header__inner {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 24px;
		min-height: 82px;
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		flex: 0 0 auto;
	}

	.brand__text {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	.brand__names {
		font-family: var(--serif);
		font-size: 17px;
		line-height: 1.1;
		letter-spacing: 0.01em;
	}

	.brand__date {
		font-size: 7px;
		font-weight: 650;
		letter-spacing: 0.24em;
		color: var(--ink-soft);
	}

	.nav {
		display: flex;
		justify-content: center;
		gap: clamp(16px, 2.4vw, 34px);
	}

	.nav__link {
		position: relative;
		padding: 6px 0;
		font-size: 9px;
		font-weight: 650;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-soft);
		transition: color 0.25s var(--ease);
	}

	.nav__link::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 1px;
		background: var(--pine);
		transform: scaleX(0);
		transform-origin: right;
		transition: transform 0.35s var(--ease);
	}

	.nav__link:hover {
		color: var(--ink);
	}

	.nav__link:hover::after {
		transform: scaleX(1);
		transform-origin: left;
	}

	.header__actions {
		display: flex;
		align-items: center;
		gap: 18px;
	}

	.lang {
		display: inline-flex;
		align-items: center;
		gap: 5px;
	}

	.lang__btn {
		padding: 4px 0;
		font-size: 8px;
		font-weight: 700;
		letter-spacing: 0.16em;
		color: var(--ink-faint);
		transition: color 0.2s var(--ease);
	}

	.lang__btn.is-active {
		color: var(--ink);
	}

	.lang__sep {
		font-size: 8px;
		color: var(--line-strong);
	}

	.header__cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 40px;
		padding: 0 20px;
		border: 1px solid var(--pine);
		background: var(--pine);
		color: var(--paper);
		font-size: 8px;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		transition:
			background-color 0.3s var(--ease),
			border-color 0.3s var(--ease);
	}

	.header__cta:hover {
		background: var(--ink);
		border-color: var(--ink);
	}

	.burger {
		display: none;
		flex-direction: column;
		justify-content: center;
		gap: 6px;
		width: 40px;
		height: 40px;
		align-items: flex-end;
	}

	.burger span {
		display: block;
		width: 24px;
		height: 1px;
		background: var(--ink);
		transition: width 0.3s var(--ease);
	}

	.burger span:last-child {
		width: 16px;
	}

	.burger:hover span:last-child {
		width: 24px;
	}

	.mobile-menu {
		position: fixed;
		inset: 0;
		z-index: 100;
		display: flex;
		flex-direction: column;
		background: var(--paper);
	}

	.mobile-menu__top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-block: 20px;
		border-bottom: 1px solid var(--line);
	}

	.mobile-menu__close {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 9px;
		font-weight: 650;
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}

	.mobile-menu__nav {
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 1;
		padding-block: 32px;
	}

	.mobile-menu__link {
		display: flex;
		align-items: baseline;
		gap: 18px;
		padding-block: clamp(10px, 2vh, 20px);
		border-bottom: 1px solid var(--line);
		font-family: var(--serif);
		font-size: clamp(34px, 9vw, 52px);
		line-height: 1;
	}

	.mobile-menu__num {
		font-family: var(--sans);
		font-size: 8px;
		font-weight: 650;
		letter-spacing: 0.2em;
		color: var(--brass);
	}

	.mobile-menu__bottom {
		display: flex;
		flex-direction: column;
		gap: 18px;
		padding-block: 24px 32px;
	}

	:global(.mobile-menu__ornament) {
		width: 120px;
		color: var(--brass);
	}

	.mobile-menu__meta {
		display: flex;
		justify-content: space-between;
		font-size: 9px;
		font-weight: 650;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}

	.mobile-menu__lang {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	@media (max-width: 1080px) {
		.nav {
			display: none;
		}

		.header__inner {
			grid-template-columns: 1fr auto;
		}

		.burger {
			display: flex;
		}
	}

	@media (max-width: 620px) {
		.header__inner {
			min-height: 68px;
		}

		.brand__text {
			display: none;
		}

		.header__cta {
			display: none;
		}

		.header__actions {
			gap: 14px;
		}
	}
</style>
