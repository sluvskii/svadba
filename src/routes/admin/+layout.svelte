<script lang="ts">
	import { page } from '$app/state';
	import Monogram from '#lib/components/Monogram.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	const currentPath = $derived(page.url.pathname);
	// Страница входа рендерится без админской навигации — она ещё недоступна гостю.
	const isLoginPage = $derived(currentPath.startsWith('/admin/login'));

	const navItems = [
		{ href: '/admin', label: 'Сводка', shortLabel: 'Сводка', icon: '📊' },
		{ href: '/admin/guests', label: 'Гости и ответы', shortLabel: 'Гости', icon: '👥' },
		{ href: '/admin/seating', label: 'Рассадка', shortLabel: 'Рассадка', icon: '🍽️' },
		{ href: '/admin/content', label: 'Тексты и расписание', shortLabel: 'Тексты', icon: '✏️' },
		{ href: '/admin/settings', label: 'Настройки', shortLabel: 'Настройки', icon: '⚙️' }
	];
</script>

<svelte:head>
	<title>Панель управления свадьбой</title>
</svelte:head>

{#if isLoginPage}
	{@render children()}
{:else}
	<div class="admin-shell">
		<header class="admin-nav">
			<!-- Верхняя строка: логотип/бейдж слева, быстрые действия справа -->
			<div class="admin-nav__top">
				<div class="admin-nav__brand-group">
					<a href="/admin" class="admin-nav__brand" title="Панель управления">
						<Monogram size={24} />
						<span class="admin-nav__title-desktop">Панель управления</span>
						<span class="admin-nav__title-mobile">Админ</span>
					</a>
				</div>

				<!-- Навигация на ПК/планшетах -->
				<nav class="admin-nav__links admin-nav__links--desktop">
					{#each navItems as item}
						{@const active = item.href === '/admin' ? currentPath === '/admin' : currentPath.startsWith(item.href)}
						<a href={item.href} class="admin-nav__item" class:is-active={active}>
							<span class="admin-nav__icon">{item.icon}</span>
							<span>{item.label}</span>
						</a>
					{/each}
				</nav>

				<!-- Правый блок: просмотр сайта и кнопка выхода -->
				<div class="admin-nav__right">
					<a href="/" target="_blank" rel="noreferrer" class="admin-nav__site-btn" title="Открыть приглашение на сайте">
						<span>Сайт</span>
						<span class="admin-nav__arrow">↗</span>
					</a>
					<a href="/admin/logout" class="admin-nav__logout-btn" title="Выйти из системы">
						Выйти
					</a>
				</div>
			</div>

			<!-- Мобильная полоса навигации: компактный аккуратный скроллер табов -->
			<nav class="admin-nav__mobile-bar" aria-label="Разделы панели">
				<div class="admin-nav__mobile-scroller">
					{#each navItems as item}
						{@const active = item.href === '/admin' ? currentPath === '/admin' : currentPath.startsWith(item.href)}
						<a href={item.href} class="admin-nav__mobile-tab" class:is-active={active}>
							<span class="admin-nav__tab-icon">{item.icon}</span>
							<span class="admin-nav__tab-label">{item.shortLabel}</span>
						</a>
					{/each}
				</div>
			</nav>
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
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
	}

	.admin-nav__top {
		max-width: 1240px;
		margin: 0 auto;
		padding: 0 20px;
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	.admin-nav__brand-group {
		display: flex;
		align-items: center;
	}

	.admin-nav__brand {
		display: flex;
		align-items: center;
		gap: 8px;
		text-decoration: none;
		color: var(--pine);
		font-family: var(--font-display);
		font-size: 1.15rem;
		white-space: nowrap;
	}

	.admin-nav__title-desktop {
		display: inline-block;
		font-weight: 600;
		letter-spacing: 0.01em;
	}

	.admin-nav__title-mobile {
		display: none;
		font-size: 0.8rem;
		font-family: var(--sans);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		background: rgba(43, 71, 58, 0.09);
		color: var(--pine);
		padding: 3px 8px;
		border-radius: 6px;
	}

	.admin-nav__links--desktop {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.admin-nav__item {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 7px 12px;
		border-radius: 8px;
		text-decoration: none;
		color: var(--ink-muted);
		font-size: 0.88rem;
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
		background: rgba(43, 71, 58, 0.09);
		font-weight: 600;
	}

	.admin-nav__icon {
		font-size: 0.95rem;
	}

	.admin-nav__right {
		display: flex;
		align-items: center;
		gap: 8px;
		white-space: nowrap;
	}

	.admin-nav__site-btn {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 6px 12px;
		font-size: 0.82rem;
		font-weight: 500;
		text-decoration: none;
		border: 1px solid var(--border);
		background: var(--paper);
		color: var(--ink);
		border-radius: 7px;
		transition: all 0.15s ease;
	}

	.admin-nav__site-btn:hover {
		background: rgba(0, 0, 0, 0.04);
		border-color: var(--ink-soft);
	}

	.admin-nav__arrow {
		font-size: 0.75rem;
		opacity: 0.7;
	}

	.admin-nav__logout-btn {
		font-size: 0.82rem;
		color: var(--ink-muted);
		text-decoration: none;
		padding: 6px 10px;
		border-radius: 6px;
		transition: all 0.15s ease;
	}

	.admin-nav__logout-btn:hover {
		color: #c53030;
		background: #fff5f5;
	}

	/* Мобильная панель навигации (по умолчанию скрыта на ПК) */
	.admin-nav__mobile-bar {
		display: none;
		border-top: 1px solid rgba(0, 0, 0, 0.06);
		background: #ffffff;
		padding: 6px 8px;
	}

	.admin-nav__mobile-scroller {
		display: flex;
		align-items: center;
		gap: 6px;
		overflow-x: auto;
		scrollbar-width: none;
		-webkit-overflow-scrolling: touch;
		padding: 2px 4px;
	}

	.admin-nav__mobile-scroller::-webkit-scrollbar {
		display: none;
	}

	.admin-nav__mobile-tab {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		padding: 6px 11px;
		border-radius: 999px;
		text-decoration: none;
		font-size: 0.82rem;
		font-weight: 500;
		color: var(--ink-muted);
		background: #f4f3ef;
		white-space: nowrap;
		flex-shrink: 0;
		transition: all 0.15s ease;
	}

	.admin-nav__mobile-tab.is-active {
		background: var(--pine);
		color: #ffffff;
		font-weight: 600;
		box-shadow: 0 1px 4px rgba(43, 71, 58, 0.25);
	}

	.admin-nav__tab-icon {
		font-size: 0.9rem;
	}

	.admin-main {
		flex: 1;
		max-width: 1240px;
		width: 100%;
		margin: 0 auto;
		padding: 28px 20px 60px;
	}

	@media (max-width: 768px) {
		.admin-nav__top {
			height: 48px;
			padding: 0 12px;
		}

		.admin-nav__title-desktop {
			display: none;
		}

		.admin-nav__title-mobile {
			display: inline-block;
		}

		.admin-nav__links--desktop {
			display: none;
		}

		.admin-nav__mobile-bar {
			display: block;
		}

		.admin-nav__site-btn {
			padding: 5px 9px;
			font-size: 0.78rem;
		}

		.admin-nav__logout-btn {
			padding: 5px 8px;
			font-size: 0.78rem;
		}

		.admin-main {
			padding: 14px 10px 50px;
		}
	}
</style>
