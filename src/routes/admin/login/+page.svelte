<script lang="ts">
	import { enhance } from '$app/forms';
	import Monogram from '#lib/components/Monogram.svelte';
	import Ornament from '#lib/components/Ornament.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let submitting = $state(false);
	let password = $state('');

	// Фокус на поле пароля без атрибута autofocus (предупреждение a11y).
	const autoFocus = (node: HTMLElement) => {
		node.focus();
	};
</script>

<svelte:head>
	<title>Вход для молодожёнов — Алина & Камиль</title>
</svelte:head>

<div class="login-page">
	<div class="login-card">
		<div class="login-card__head">
			<a href="/" class="login-brand" title="На главную">
				<Monogram size={44} />
			</a>
			<h1 class="display login-title">Панель молодожёнов</h1>
			<p class="login-sub">Алина & Камиль · 17 декабря 2026</p>
			<Ornament variant="divider" class="login-ornament" />
		</div>

		{#if form?.error}
			<div class="login-error" role="alert">
				{form.error}
			</div>
		{/if}

		<form
			method="POST"
			class="login-form"
			use:enhance={() => {
				submitting = true;
				return async ({ update }) => {
					await update();
					submitting = false;
				};
			}}
		>
				<div class="field">
					<label class="field-label" for="password">Пароль или PIN-код</label>
					<input
						class="input"
						id="password"
						name="password"
						type="password"
						bind:value={password}
						placeholder="Введите пароль доступа"
						required
						use:autoFocus
					/>
				</div>

			<button class="btn login-btn" type="submit" disabled={submitting}>
				{submitting ? 'Входим...' : 'Войти в панель'}
			</button>
		</form>

		<div class="login-card__foot">
			<a href="/" class="link-line">
				<span>← Вернуться на свадебный сайт</span>
			</a>
		</div>
	</div>
</div>

<style>
	.login-page {
		min-height: 100svh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24px;
		background: radial-gradient(circle at top, var(--paper-2) 0%, var(--paper) 100%);
	}

	.login-card {
		width: 100%;
		max-width: 440px;
		background: var(--paper);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg, 12px);
		box-shadow: 0 16px 40px -10px rgba(0, 0, 0, 0.08);
		padding: 40px 32px;
	}

	.login-card__head {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		margin-bottom: 24px;
	}

	.login-brand {
		color: var(--pine);
		margin-bottom: 14px;
		transition: opacity 0.2s;
	}

	.login-brand:hover {
		opacity: 0.8;
	}

	.login-title {
		font-size: 2rem;
		margin: 0 0 6px 0;
		color: var(--ink);
	}

	.login-sub {
		color: var(--ink-muted);
		font-size: 0.95rem;
		margin: 0;
	}

	:global(.login-ornament) {
		width: 120px;
		color: var(--brass);
		margin-top: 14px;
	}

	.login-error {
		background: #fdf2f2;
		border: 1px solid #f98080;
		color: #9b1c1c;
		padding: 12px 16px;
		border-radius: 8px;
		font-size: 0.9rem;
		margin-bottom: 20px;
		text-align: center;
	}

	.login-form {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.login-btn {
		width: 100%;
		justify-content: center;
		padding: 14px 20px;
	}

	.login-card__foot {
		margin-top: 28px;
		text-align: center;
	}

	@media (max-width: 480px) {
		.login-page {
			padding: 16px 12px;
		}

		.login-card {
			padding: 28px 18px;
			border-radius: 10px;
		}

		.login-title {
			font-size: 1.55rem;
		}

		.login-sub {
			font-size: 0.85rem;
		}
	}
</style>
