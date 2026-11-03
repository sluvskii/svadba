<script lang="ts">
	import { page } from '$app/state';
	import Monogram from '#lib/components/Monogram.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	const currentPath = $derived(page.url.pathname);
	// Страница входа рендерится без админской навигации — она ещё недоступна гостю.
	const isLoginPage = $derived(currentPath.startsWith('/admin/login'));

	const navItems = [
		{ href: '/admin', label: 'Сводка', icon: '📊' },
		{ href: '/admin/guests', label: 'Гости и ответы', icon: '👥' },
		{ href: '/admin/seating', label: 'Рассадка', icon: '🍽️' },
		{ href: '/admin/content', label: 'Тексты', icon: '✏️' },
		{ href: '/admin/settings', label: 'Настройки', icon: '⚙️' }
	];
</script>

<svelte:head>
	<title>Управление свадьбой — Алина & Камиль</title>
</svelte:head>

{#if isLoginPage}
	{@render children()}
{:else}
	<div class="admin-shell">
	<header class="admin-nav">
		<div class="admin-nav__inner">
			<div class="admin-nav__left">
				<a href="/admin" class="admin-nav__brand">
					<Monogram size={26} />
					<span class="admin-nav__title">Алина & Камиль</span>
				</a>

				<nav class="admin-nav__links">
					{#each navItems as item}
						{@const active = item.href === '/admin' ? currentPath === '/admin' : currentPath.startsWith(item.href)}
						<a href={item.href} class="admin-nav__item" class:is-active={active}>
							<span class="admin-nav__icon">{item.icon}</span>
							<span>{item.label}</span>
						</a>
					{/each}
				</nav>
			</div>

			<div class="admin-nav__right">
				<a href="/" target="_blank" rel="noreferrer" class="btn btn--outline admin-nav__site-btn">
					<span>Сайт ↗</span>
				</a>
				<a href="/admin/logout" class="admin-nav__logout" title="Выйти из панели">
					Выйти
				</a>
			</div>
		</div>
	</header>

	<main class="admin-main">
		{@render children()}
	</main>
</div>
{/if}

<style>
	.admin-shell {
		min-height: 100svh;
		background: #f7f6f2;
		color: var(--ink);
		display: flex;
		flex-direction: column;
	}

	.admin-nav {
		background: var(--paper);
		border-bottom: 1px solid var(--border);
		position: sticky;
		top: 0;
		z-index: 50;
	}

	.admin-nav__inner {
		max-width: 1240px;
		margin: 0 auto;
		padding: 0 20px;
		height: 64px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
	}

	.admin-nav__left {
		display: flex;
		align-items: center;
		gap: 28px;
		overflow-x: auto;
		scrollbar-width: none;
	}

	.admin-nav__left::-webkit-scrollbar {
		display: none;
	}

	.admin-nav__brand {
		display: flex;
		align-items: center;
		gap: 10px;
		text-decoration: none;
		color: var(--pine);
		font-family: var(--font-display);
		font-size: 1.25rem;
		white-space: nowrap;
	}

	.admin-nav__title {
		letter-spacing: 0.02em;
	}

	.admin-nav__links {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.admin-nav__item {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 7px 14px;
		border-radius: 8px;
		text-decoration: none;
		color: var(--ink-muted);
		font-size: 0.9rem;
		font-weight: 500;
		transition: all 0.15s ease;
		white-space: nowrap;
	}

	.admin-nav__item:hover {
		color: var(--ink);
		background: rgba(0, 0, 0, 0.04);
	}

	.admin-nav__item.is-active {
		color: var(--pine);
		background: rgba(43, 71, 58, 0.08);
		font-weight: 600;
	}

	.admin-nav__icon {
		font-size: 0.95rem;
	}

	.admin-nav__right {
		display: flex;
		align-items: center;
		gap: 14px;
		white-space: nowrap;
	}

	.admin-nav__site-btn {
		padding: 6px 14px;
		font-size: 0.85rem;
	}

	.admin-nav__logout {
		font-size: 0.85rem;
		color: var(--ink-muted);
		text-decoration: none;
		padding: 6px 10px;
		border-radius: 6px;
	}

	.admin-nav__logout:hover {
		color: #c53030;
		background: #fff5f5;
	}

	.admin-main {
		flex: 1;
		max-width: 1240px;
		width: 100%;
		margin: 0 auto;
		padding: 32px 20px 60px;
	}

	@media (max-width: 768px) {
		.admin-nav__inner {
			height: auto;
			padding: 12px 16px;
			flex-direction: column;
			align-items: stretch;
			gap: 12px;
		}

		.admin-nav__right {
			justify-content: flex-end;
		}
	}
</style>
