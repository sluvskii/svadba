<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageProps } from './$types';

	let { data, form }: PageProps & { form: ActionData } = $props();

	let testingTg = $state(false);
	let savingTg = $state(false);
	let changingPass = $state(false);

	/* svelte-ignore state_referenced_locally */
	let botToken = $state(data.telegramBotToken);
	/* svelte-ignore state_referenced_locally */
	let chatId = $state(data.telegramChatId);

	let showTgForm = $state(false);
	const tgConnected = $derived(botToken.trim().length > 0 && chatId.trim().length > 0);
</script>

<div class="settings-page">
	<header class="settings-head">
		<div>
			<h1 class="page-title">Настройки и уведомления</h1>
			<p class="page-subtitle">Подключение Telegram-бота и безопасность панели</p>
		</div>
	</header>

	<div class="settings-grid">
		<!-- Telegram Bot Settings -->
		<section class="card">
			<div class="card__head">
				<div>
					<h2 class="card__title">🤖 Уведомления в Telegram</h2>
					<p class="card__sub">
						{tgConnected
							? 'Ответы гостей будут приходить вам моментально'
							: 'Моментальные уведомления о каждом ответе гостя'}
					</p>
				</div>
				<span class="badge" class:badge--ok={tgConnected}>
					{tgConnected ? 'Подключено' : 'Не подключено'}
				</span>
			</div>

			{#if form?.successTelegram}
				<div class="alert-success">✓ Настройки Telegram успешно сохранены!</div>
			{/if}

			{#if form?.telegramTestOk}
				<div class="alert-success">🎉 Тестовое сообщение успешно отправлено в Telegram! Проверьте чат.</div>
			{/if}

			{#if form?.telegramError}
				<div class="alert-danger">{form.telegramError}</div>
			{/if}

			{#if tgConnected && !showTgForm}
				<div class="btn-row">
					<button class="btn" type="button" onclick={() => (showTgForm = true)}>
						Изменить подключение
					</button>
					<form method="POST" action="?/testTelegram" use:enhance={() => { testingTg = true; return async ({ update }) => { await update(); testingTg = false; }; }}>
						<input type="hidden" name="telegramBotToken" value={botToken} />
						<input type="hidden" name="telegramChatId" value={chatId} />
						<button class="btn btn--outline" type="submit" disabled={testingTg}>
							{testingTg ? 'Отправляем...' : 'Отправить тестовое сообщение'}
						</button>
					</form>
				</div>
			{:else}
				<details class="instruction-box">
					<summary>Как подключить бота — 4 шага</summary>
					<ol class="instruction-list">
						<li>Откройте в Telegram бота <code>@BotFather</code> и отправьте команду <code>/newbot</code>.</li>
						<li>Задайте имя боту и скопируйте полученный <strong>HTTP API Token</strong>.</li>
						<li>Напишите созданному боту любое сообщение (или добавьте его в вашу семейную группу).</li>
						<li>Узнайте ваш <strong>Chat ID</strong> через бота <code>@userinfobot</code> и вставьте оба значения ниже.</li>
					</ol>
				</details>

				<form
					method="POST"
					action="?/saveTelegram"
					use:enhance={() => {
						savingTg = true;
						return async ({ update }) => {
							await update();
							savingTg = false;
							showTgForm = false;
						};
					}}
					class="form-col"
				>
					<div class="field">
						<label class="field-label" for="botToken">Telegram Bot Token</label>
						<input
							class="input"
							id="botToken"
							name="telegramBotToken"
							type="password"
							bind:value={botToken}
							placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
						/>
					</div>

					<div class="field">
						<label class="field-label" for="chatId">Telegram Chat ID</label>
						<input
							class="input"
							id="chatId"
							name="telegramChatId"
							bind:value={chatId}
							placeholder="Например: 123456789 или -100123456789"
						/>
						<p class="form-hint">Можно указать несколько получателей через запятую — например, невесту и жениха.</p>
					</div>

					<div class="btn-row">
						<button class="btn" type="submit" disabled={savingTg}>
							{savingTg ? 'Сохраняем...' : 'Сохранить'}
						</button>

						<button
							class="btn btn--outline"
							type="submit"
							formaction="?/testTelegram"
							disabled={testingTg || !botToken || !chatId}
						>
							{testingTg ? 'Отправляем...' : 'Сохранить и проверить'}
						</button>

						{#if tgConnected}
							<button class="btn btn--ghost" type="button" onclick={() => (showTgForm = false)}>
								Отмена
							</button>
						{/if}
					</div>
				</form>
			{/if}
		</section>

		<!-- Change Password -->
		<section class="card">
			<div class="card__head">
				<div>
					<h2 class="card__title">🔒 Пароль доступа к панели</h2>
					<p class="card__sub">Смените пароль молодожёнов на свой личный</p>
				</div>
			</div>

			{#if form?.passwordSuccess}
				<div class="alert-success">✓ Пароль администратора успешно изменён!</div>
			{/if}

			{#if form?.passwordError}
				<div class="alert-danger">{form.passwordError}</div>
			{/if}

			<form
				method="POST"
				action="?/changePassword"
				use:enhance={() => {
					changingPass = true;
					return async ({ update }) => {
						await update();
						changingPass = false;
					};
				}}
				class="form-col"
			>
				<div class="field">
					<label class="field-label" for="oldPassword">Текущий пароль</label>
					<input class="input" id="oldPassword" name="oldPassword" type="password" required />
				</div>

				<div class="field">
					<label class="field-label" for="newPassword">Новый пароль</label>
					<input class="input" id="newPassword" name="newPassword" type="password" required minlength="4" />
				</div>

				<div class="field">
					<label class="field-label" for="confirmPassword">Повторите новый пароль</label>
					<input class="input" id="confirmPassword" name="confirmPassword" type="password" required />
				</div>

				<button class="btn" type="submit" disabled={changingPass}>
					{changingPass ? 'Обновляем...' : 'Изменить пароль'}
				</button>
			</form>
		</section>
	</div>
</div>

<style>
	.settings-page {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.page-title {
		font-family: var(--font-display);
		font-size: 2.2rem;
		margin: 0 0 4px 0;
		color: var(--ink);
	}

	.page-subtitle {
		color: var(--ink-muted);
		margin: 0;
		font-size: 0.95rem;
	}

	.settings-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
	}

	@media (max-width: 900px) {
		.settings-grid {
			grid-template-columns: 1fr;
		}
	}

	.card {
		background: var(--paper);
		border: 1px solid var(--border);
		border-radius: var(--radius-md, 10px);
		padding: 24px;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.card__title {
		font-family: var(--font-display);
		font-size: 1.3rem;
		margin: 0 0 4px 0;
		color: var(--ink);
	}

	.card__sub {
		color: var(--ink-muted);
		font-size: 0.85rem;
		margin: 0;
	}

	.badge {
		align-self: flex-start;
		padding: 4px 10px;
		border-radius: 999px;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		background: #f3f4f6;
		color: var(--ink-muted);
		border: 1px solid var(--border);
		white-space: nowrap;
	}

	.badge--ok {
		background: #def7ec;
		border-color: #31c48d;
		color: #03543f;
	}

	.instruction-box {
		background: #fbfbfa;
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 12px 16px;
		font-size: 0.85rem;
	}

	.instruction-box summary {
		cursor: pointer;
		font-weight: 650;
		color: var(--ink);
	}

	.instruction-box[open] summary {
		margin-bottom: 8px;
	}

	.instruction-list {
		margin: 8px 0 0 16px;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 4px;
		color: var(--ink-muted);
	}

	.instruction-list code {
		background: #eee;
		padding: 2px 5px;
		border-radius: 4px;
		color: var(--ink);
		font-size: 0.85rem;
	}

	.form-col {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.btn-row {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
		align-items: center;
	}

	.btn--ghost {
		background: none;
		border: none;
		color: var(--ink-muted);
		padding: 10px 14px;
	}

	.btn--ghost:hover {
		color: var(--ink);
	}

	.alert-success {
		background: #def7ec;
		border: 1px solid #31c48d;
		color: #03543f;
		padding: 12px 16px;
		border-radius: 8px;
		font-size: 0.9rem;
	}

	.alert-danger {
		background: #fde8e8;
		border: 1px solid #f98080;
		color: #9b1c1c;
		padding: 12px 16px;
		border-radius: 8px;
		font-size: 0.9rem;
	}
</style>
