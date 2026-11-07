<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let searchQuery = $state('');
	let sideFilter = $state<'all' | 'bride' | 'groom' | 'both'>('all');
	let statusFilter = $state<'all' | 'yes' | 'no' | 'pending'>('all');

	// Modals state
	let showCreateModal = $state(false);
	let createMode = $state<'single' | 'batch'>('single');
	let editingGuest = $state<any | null>(null);

	// Toast state
	let toastMessage = $state<string | null>(null);
	let toastTimer: any = null;

	function showToast(msg: string) {
		toastMessage = msg;
		if (toastTimer) clearTimeout(toastTimer);
		toastTimer = setTimeout(() => {
			toastMessage = null;
		}, 3000);
	}

	const DRINK_NAMES: Record<string, string> = {
		'red-wine': 'Красное вино',
		'white-wine': 'Белое вино',
		champagne: 'Шампанское',
		vodka: 'Водка',
		soft: 'Безалкогольное',
		none: 'Не пьет'
	};

	const filteredGuests = $derived(
		data.guests.filter((g) => {
			if (searchQuery.trim()) {
				const q = searchQuery.toLowerCase().trim();
				const matchName = g.name.toLowerCase().includes(q);
				const matchPlusOne = g.rsvp?.plus_one_name?.toLowerCase().includes(q);
				if (!matchName && !matchPlusOne) return false;
			}

			if (sideFilter !== 'all' && g.side !== sideFilter) {
				return false;
			}

			if (statusFilter !== 'all') {
				if (statusFilter === 'pending' && g.rsvp !== null) return false;
				if (statusFilter === 'yes' && g.rsvp?.attending !== 'yes') return false;
				if (statusFilter === 'no' && g.rsvp?.attending !== 'no') return false;
			}

			return true;
		})
	);

	function getInviteUrl(token: string) {
		if (typeof window === 'undefined') return `/invite/${token}`;
		return `${window.location.origin}/invite/${token}`;
	}

	async function copyLink(token: string) {
		const url = getInviteUrl(token);
		await navigator.clipboard.writeText(url);
		showToast('Ссылка на приглашение скопирована!');
	}

	async function copyMessage(guest: any) {
		const url = getInviteUrl(guest.token);
		const text = `Дорогой(ая) ${guest.name}! ❤️\nМы с огромной радостью приглашаем вас на нашу свадьбу, которая состоится 17 декабря 2026 года в Нефтекамске (ресторан «Тантана»).\n\nПожалуйста, перейдите по вашей личной ссылке, чтобы узнать подробности и подтвердить присутствие:\n${url}\n\nС любовью, Алина и Камиль ✨`;
		await navigator.clipboard.writeText(text);
		showToast(`Текст сообщения для ${guest.name} скопирован!`);
	}

	function exportCsv() {
		// Защита от CSV-инъекции: нейтрализуем ячейки, начинающиеся с формульных символов.
		const safeCell = (v: string) => {
			const cleaned = (v ?? '').replace(/"/g, '""');
			return /^[=+\-@\t\r]/.test(cleaned) ? `'${cleaned}` : cleaned;
		};
		const headers = [
			'Имя',
			'Сторона',
			'Статус',
			'Спутник (+1)',
			'Дети',
			'Стол',
			'Напитки',
			'Особенности питания',
			'Песня',
			'Пожелание',
			'Ссылка на приглашение'
		];

		const rows = data.guests.map((g) => {
			let status = 'Ожидает ответа';
			if (g.rsvp?.attending === 'yes') status = 'Будет';
			if (g.rsvp?.attending === 'no') status = 'Не сможет';

			let drinks = '';
			if (g.rsvp?.drinks) {
				try {
					const arr: string[] = JSON.parse(g.rsvp.drinks);
					drinks = arr.map((d) => DRINK_NAMES[d] || d).join(', ');
				} catch {
					drinks = '';
				}
			}

			const sideLabel =
				g.side === 'bride' ? 'Невеста' : g.side === 'groom' ? 'Жених' : 'Общие';

			return [
				`"${safeCell(g.name)}"`,
				`"${sideLabel}"`,
				`"${status}"`,
				`"${safeCell(g.rsvp?.plus_one_name || '')}"`,
				`"${safeCell(g.rsvp?.children_names || '')}"`,
				`"${safeCell(g.table_name || '')}"`,
				`"${safeCell(drinks)}"`,
				`"${safeCell(g.rsvp?.food_notes || '')}"`,
				`"${safeCell(g.rsvp?.song_request || '')}"`,
				`"${safeCell(g.rsvp?.comment || '')}"`,
				`"${getInviteUrl(g.token)}"`
			].join(';');
		});

		// UTF-8 BOM для корректного открытия в русском Excel
		const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `spisok_gostey_alina_kamil_${new Date().toISOString().slice(0, 10)}.csv`;
		a.click();
		URL.revokeObjectURL(url);
		showToast('Таблица гостей успешно выгружена в CSV!');
	}
</script>

{#if toastMessage}
	<div class="toast" role="status">
		{toastMessage}
	</div>
{/if}

<div class="guests-page">
	<!-- Page Header -->
	<header class="guests-header">
		<div>
			<h1 class="page-title">Список гостей и ответы</h1>
			<p class="page-subtitle">Всего гостей: {data.guests.length} · Показано: {filteredGuests.length}</p>
		</div>
		<div class="header-actions">
			<button class="btn btn--outline" type="button" onclick={exportCsv} disabled={data.guests.length === 0}>
				<span>📥 Экспорт в CSV</span>
			</button>
			<button class="btn" type="button" onclick={() => (showCreateModal = true)}>
				<span>+ Добавить гостя</span>
			</button>
		</div>
	</header>

	<!-- Filters & Search Toolbar -->
	<div class="toolbar">
		<div class="toolbar__search">
			<svg viewBox="0 0 20 20" fill="none" width="16" height="16" aria-hidden="true">
				<circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" stroke-width="1.5" />
				<path d="M12.5 12.5L17 17" stroke="currentColor" stroke-width="1.5" />
			</svg>
			<input
				type="search"
				class="toolbar__search-input"
				placeholder="Поиск по имени или спутнику..."
				bind:value={searchQuery}
			/>
		</div>

		<div class="toolbar__filters">
			<div class="btn-group">
				<button
					type="button"
					class="btn-group__btn"
					class:is-active={sideFilter === 'all'}
					onclick={() => (sideFilter = 'all')}
				>Все</button>
				<button
					type="button"
					class="btn-group__btn"
					class:is-active={sideFilter === 'bride'}
					onclick={() => (sideFilter = 'bride')}
				>Невеста</button>
				<button
					type="button"
					class="btn-group__btn"
					class:is-active={sideFilter === 'groom'}
					onclick={() => (sideFilter = 'groom')}
				>Жених</button>
			</div>

			<div class="btn-group">
				<button
					type="button"
					class="btn-group__btn"
					class:is-active={statusFilter === 'all'}
					onclick={() => (statusFilter = 'all')}
				>Все статусы</button>
				<button
					type="button"
					class="btn-group__btn"
					class:is-active={statusFilter === 'yes'}
					onclick={() => (statusFilter = 'yes')}
				>Будут</button>
				<button
					type="button"
					class="btn-group__btn"
					class:is-active={statusFilter === 'no'}
					onclick={() => (statusFilter = 'no')}
				>Не смогут</button>
				<button
					type="button"
					class="btn-group__btn"
					class:is-active={statusFilter === 'pending'}
					onclick={() => (statusFilter = 'pending')}
				>Ожидают</button>
			</div>
		</div>
	</div>

	<!-- Guests Table -->
	<div class="card table-card">
		{#if filteredGuests.length > 0}
			<div class="table-wrap">
				<table class="table">
					<thead>
						<tr>
							<th>Имя гостя</th>
							<th>Сторона</th>
							<th>Статус RSVP</th>
							<th>Спутник / Дети</th>
							<th>Стол</th>
							<th>Напитки</th>
							<th style="text-align: right;">Приглашение и действия</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredGuests as guest (guest.id)}
							{@const attending = guest.rsvp?.attending}
							<tr>
								<!-- Name & Note -->
								<td>
									<div class="guest-name-cell">
										<strong class="guest-name">{guest.name}</strong>
										{#if guest.note}
											<span class="guest-note" title={guest.note}>«{guest.note}»</span>
										{/if}
									</div>
								</td>

								<!-- Side -->
								<td>
									{#if guest.side === 'bride'}
										<span class="badge badge--pink">Невеста</span>
									{:else if guest.side === 'groom'}
										<span class="badge badge--blue">Жених</span>
									{:else}
										<span class="badge">Общие</span>
									{/if}
								</td>

								<!-- RSVP Status -->
								<td>
									{#if attending === 'yes'}
										<span class="badge badge--green">✅ Придет</span>
									{:else if attending === 'no'}
										<span class="badge badge--red">❌ Не сможет</span>
									{:else}
										<span class="badge badge--gray">⏳ Ожидает</span>
									{/if}
								</td>

								<!-- Plus One & Children -->
								<td>
									<div class="guest-companions">
										{#if guest.plus_one_allowed}
											{#if guest.rsvp?.plus_one_name}
												<span class="companion-tag">👥 +1: {guest.rsvp.plus_one_name}</span>
											{:else}
												<span class="muted tiny">С парой (без имени)</span>
											{/if}
										{/if}
										{#if guest.children_allowed && guest.rsvp?.children_names}
											<span class="companion-tag">👶 {guest.rsvp.children_names}</span>
										{/if}
										{#if !guest.plus_one_allowed && !guest.rsvp?.plus_one_name && !guest.rsvp?.children_names}
											<span class="muted tiny">—</span>
										{/if}
									</div>
								</td>

								<!-- Table Assignment Form -->
								<td>
									<form method="POST" action="?/assignSeat" use:enhance class="table-select-form">
										<input type="hidden" name="guestId" value={guest.id} />
										<select
											name="tableId"
											class="table-select"
											onchange={(e) => e.currentTarget.form?.requestSubmit()}
										>
											<option value="">Без стола</option>
											{#each data.tables as t}
												<option value={t.id} selected={guest.table_id === t.id}>
													{t.name}
												</option>
											{/each}
										</select>
									</form>
								</td>

								<!-- Drinks -->
								<td>
									{#if guest.rsvp?.drinks}
										{@const parsedDrinks = (() => {
											try { return JSON.parse(guest.rsvp.drinks); } catch { return []; }
										})()}
										{#if parsedDrinks.length > 0}
											<div class="drinks-chips">
												{#each parsedDrinks as d}
													<span class="drink-chip">{DRINK_NAMES[d] || d}</span>
												{/each}
											</div>
										{:else}
											<span class="muted tiny">—</span>
										{/if}
									{:else}
										<span class="muted tiny">—</span>
									{/if}
								</td>

								<!-- Actions -->
								<td style="text-align: right;">
									<div class="actions-cell">
										<button
											type="button"
											class="action-btn"
											title="Скопировать ссылку на приглашение"
											onclick={() => copyLink(guest.token)}
										>
											🔗
										</button>
										<button
											type="button"
											class="action-btn"
											title="Скопировать готовое сообщение для мессенджера"
											onclick={() => copyMessage(guest)}
										>
											💬
										</button>
										<a
											href={`/invite/${guest.token}`}
											target="_blank"
											rel="noreferrer"
											class="action-btn"
											title="Открыть приглашение в новой вкладке"
										>
											👁️
										</a>
										<button
											type="button"
											class="action-btn"
											title="Редактировать гостя"
											onclick={() => (editingGuest = guest)}
										>
											✏️
										</button>
										<form
											method="POST"
											action="?/delete"
											use:enhance
											onsubmit={(e) => {
												if (!confirm(`Удалить гостя «${guest.name}»? Все его ответы также будут удалены.`)) {
													e.preventDefault();
												}
											}}
											style="display: inline;"
										>
											<input type="hidden" name="id" value={guest.id} />
											<button type="submit" class="action-btn action-btn--danger" title="Удалить">
												🗑️
											</button>
										</form>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="empty-state">
				<p class="empty-state__title">Гости не найдены</p>
				<p class="empty-state__sub">
					{data.guests.length === 0
						? 'Список гостей пуст. Добавьте первого гостя или вставьте список имён!'
						: 'Ни один гость не соответствует выбранным фильтрам.'}
				</p>
				{#if data.guests.length === 0}
					<button class="btn" type="button" onclick={() => (showCreateModal = true)}>
						<span>+ Добавить первого гостя</span>
					</button>
				{/if}
			</div>
		{/if}
	</div>
</div>

<!-- Modal: Create Guest -->
{#if showCreateModal}
	<div
		class="modal-backdrop"
		onclick={() => (showCreateModal = false)}
		onkeydown={(e) => {
			if (e.key === 'Escape') showCreateModal = false;
		}}
		role="presentation"
	>
		<div
			class="modal"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => {
				if (e.key === 'Escape') showCreateModal = false;
			}}
			role="dialog"
			aria-modal="true"
			tabindex="-1"
		>
			<div class="modal__head">
				<h2 class="modal__title">Добавление гостей</h2>
				<button class="modal__close" type="button" onclick={() => (showCreateModal = false)}>✕</button>
			</div>

			<!-- Switch between single and batch -->
			<div class="modal-tabs">
				<button
					type="button"
					class="modal-tab"
					class:is-active={createMode === 'single'}
					onclick={() => (createMode = 'single')}
				>
					Один гость
				</button>
				<button
					type="button"
					class="modal-tab"
					class:is-active={createMode === 'batch'}
					onclick={() => (createMode = 'batch')}
				>
					Список имён (пакетно)
				</button>
			</div>

			<form
				method="POST"
				action="?/create"
				use:enhance={() => {
					return async ({ update }) => {
						await update();
						showCreateModal = false;
						showToast('Гость(и) успешно добавлены!');
					};
				}}
				class="modal__form"
			>
				<input type="hidden" name="mode" value={createMode} />

				{#if createMode === 'single'}
					<div class="field">
						<label class="field-label" for="guest-name">Имя и фамилия гостя *</label>
						<input
							class="input"
							id="guest-name"
							name="name"
							required
							placeholder="Например: Айгуль Сафина или Семья Гараевых"
						/>
					</div>

					<div class="field">
						<label class="field-label" for="guest-side">Сторона</label>
						<select class="input" id="guest-side" name="side">
							<option value="both">Общие друзья / близкие</option>
							<option value="bride">Сторона невесты (Алина)</option>
							<option value="groom">Сторона жениха (Камиль)</option>
						</select>
					</div>

					<div class="field-row">
						<label class="checkbox-label">
							<input type="checkbox" name="plusOne" checked />
							<span>Разрешить спутника (+1)</span>
						</label>

						<label class="checkbox-label">
							<input type="checkbox" name="children" checked />
							<span>Можно с детьми</span>
						</label>
					</div>

					<div class="field">
						<label class="field-label" for="guest-note">Персональная тёплая заметка</label>
						<textarea
							class="textarea"
							id="guest-note"
							name="note"
							placeholder="Индивидуальное обращение в начале приглашения (необязательно)"
							rows="2"
						></textarea>
					</div>
				{:else}
					<div class="field">
						<label class="field-label" for="batch-text">Вставьте имена (каждое с новой строки) *</label>
						<textarea
							class="textarea"
							id="batch-text"
							name="batchText"
							rows="8"
							required
							placeholder="Ильдар Хайруллин&#10;Гульнара Валеева&#10;Руслан и Динара&#10;Айдар Сафин"
						></textarea>
						<p class="form-hint">Для каждого имени будет автоматически создана персональная ссылка.</p>
					</div>

					<div class="field">
						<label class="field-label" for="batch-side">Сторона по умолчанию</label>
						<select class="input" id="batch-side" name="side">
							<option value="both">Общие</option>
							<option value="bride">Сторона невесты</option>
							<option value="groom">Сторона жениха</option>
						</select>
					</div>

					<div class="field-row">
						<label class="checkbox-label">
							<input type="checkbox" name="plusOne" checked />
							<span>Разрешить +1</span>
						</label>
						<label class="checkbox-label">
							<input type="checkbox" name="children" checked />
							<span>Можно с детьми</span>
						</label>
					</div>
				{/if}

				<div class="modal__foot">
					<button class="btn btn--outline" type="button" onclick={() => (showCreateModal = false)}>
						Отмена
					</button>
					<button class="btn" type="submit">
						Создать
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Modal: Edit Guest -->
{#if editingGuest}
	<div
		class="modal-backdrop"
		onclick={() => (editingGuest = null)}
		onkeydown={(e) => {
			if (e.key === 'Escape') editingGuest = null;
		}}
		role="presentation"
	>
		<div
			class="modal"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => {
				if (e.key === 'Escape') editingGuest = null;
			}}
			role="dialog"
			aria-modal="true"
			tabindex="-1"
		>
			<div class="modal__head">
				<h2 class="modal__title">Редактирование гостя</h2>
				<button class="modal__close" type="button" onclick={() => (editingGuest = null)}>✕</button>
			</div>

			<form
				method="POST"
				action="?/update"
				use:enhance={() => {
					return async ({ update }) => {
						await update();
						editingGuest = null;
						showToast('Данные гостя сохранены!');
					};
				}}
				class="modal__form"
			>
				<input type="hidden" name="id" value={editingGuest.id} />

				<div class="field">
					<label class="field-label" for="edit-name">Имя гостя *</label>
					<input class="input" id="edit-name" name="name" value={editingGuest.name} required />
				</div>

				<div class="field">
					<label class="field-label" for="edit-side">Сторона</label>
					<select class="input" id="edit-side" name="side" value={editingGuest.side}>
						<option value="both">Общие</option>
						<option value="bride">Сторона невесты</option>
						<option value="groom">Сторона жениха</option>
					</select>
				</div>

				<div class="field-row">
					<label class="checkbox-label">
						<input type="checkbox" name="plusOne" checked={Boolean(editingGuest.plus_one_allowed)} />
						<span>Разрешить спутника (+1)</span>
					</label>

					<label class="checkbox-label">
						<input type="checkbox" name="children" checked={Boolean(editingGuest.children_allowed)} />
						<span>Можно с детьми</span>
					</label>
				</div>

				<div class="field">
					<label class="field-label" for="edit-note">Индивидуальная заметка</label>
					<textarea class="textarea" id="edit-note" name="note" rows="3">{editingGuest.note || ''}</textarea>
				</div>

				<div class="modal__foot">
					<button class="btn btn--outline" type="button" onclick={() => (editingGuest = null)}>
						Отмена
					</button>
					<button class="btn" type="submit">
						Сохранить изменения
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.guests-page {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.guests-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		flex-wrap: wrap;
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

	.header-actions {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		flex-wrap: wrap;
	}

	.toolbar__search {
		display: flex;
		align-items: center;
		gap: 8px;
		background: var(--paper);
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 8px 14px;
		flex: 1;
		min-width: 260px;
		max-width: 400px;
		color: var(--ink-muted);
	}

	.toolbar__search-input {
		border: none;
		outline: none;
		background: transparent;
		font-size: 0.9rem;
		color: var(--ink);
		width: 100%;
	}

	.toolbar__filters {
		display: flex;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
	}

	.btn-group {
		display: flex;
		background: var(--paper);
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 3px;
	}

	.btn-group__btn {
		border: none;
		background: transparent;
		padding: 6px 12px;
		font-size: 0.85rem;
		border-radius: 6px;
		cursor: pointer;
		color: var(--ink-muted);
		transition: all 0.15s ease;
	}

	.btn-group__btn.is-active {
		background: var(--pine);
		color: #fff;
		font-weight: 500;
	}

	.table-card {
		padding: 0;
		overflow: hidden;
		background: var(--paper);
		border: 1px solid var(--border);
		border-radius: var(--radius-md, 10px);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
	}

	.table-wrap {
		overflow-x: auto;
	}

	.table {
		width: 100%;
		border-collapse: collapse;
		text-align: left;
		font-size: 0.9rem;
	}

	.table th {
		padding: 14px 16px;
		border-bottom: 1px solid var(--border);
		background: #fbfbfa;
		color: var(--ink-muted);
		font-weight: 600;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.03em;
		white-space: nowrap;
	}

	.table td {
		padding: 14px 16px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.05);
		vertical-align: middle;
	}

	.guest-name-cell {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.guest-name {
		font-size: 1rem;
		color: var(--ink);
	}

	.guest-note {
		font-size: 0.8rem;
		color: var(--ink-muted);
		font-style: italic;
		max-width: 240px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.guest-companions {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.companion-tag {
		font-size: 0.85rem;
		color: var(--ink);
	}

	.table-select {
		padding: 6px 10px;
		border: 1px solid var(--border);
		border-radius: 6px;
		font-size: 0.85rem;
		background: #fff;
		color: var(--ink);
	}

	.drinks-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		max-width: 220px;
	}

	.drink-chip {
		background: #f4f3ef;
		padding: 2px 8px;
		border-radius: 4px;
		font-size: 0.75rem;
		color: var(--ink);
	}

	.actions-cell {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 4px;
		white-space: nowrap;
	}

	.action-btn {
		width: 32px;
		height: 32px;
		border: 1px solid var(--border);
		background: var(--paper);
		border-radius: 6px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		font-size: 0.9rem;
		transition: all 0.15s ease;
		text-decoration: none;
		color: var(--ink);
	}

	.action-btn:hover {
		background: #eee;
		border-color: #ccc;
	}

	.action-btn--danger:hover {
		background: #fde8e8;
		border-color: #f98080;
	}

	.badge {
		display: inline-block;
		padding: 3px 8px;
		border-radius: 999px;
		font-size: 0.75rem;
		font-weight: 600;
		background: #eee;
		color: #444;
	}

	.badge--green { background: #def7ec; color: #03543f; }
	.badge--red { background: #fde8e8; color: #9b1c1c; }
	.badge--gray { background: #f3f4f6; color: #4b5563; }
	.badge--pink { background: #fce8f3; color: #99154b; }
	.badge--blue { background: #e1effe; color: #1e429f; }

	.empty-state {
		padding: 60px 20px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}

	.empty-state__title {
		font-size: 1.2rem;
		font-weight: 600;
		margin: 0;
	}

	.empty-state__sub {
		color: var(--ink-muted);
		max-width: 400px;
		margin: 0 0 14px 0;
	}

	/* Modal Styles */
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.45);
		backdrop-filter: blur(2px);
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
	}

	.modal {
		background: var(--paper);
		border-radius: var(--radius-lg, 12px);
		width: 100%;
		max-width: 520px;
		padding: 28px;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
	}

	.modal__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20px;
	}

	.modal__title {
		font-family: var(--font-display);
		font-size: 1.5rem;
		margin: 0;
	}

	.modal__close {
		border: none;
		background: transparent;
		font-size: 1.2rem;
		cursor: pointer;
		color: var(--ink-muted);
		padding: 4px;
	}

	.modal-tabs {
		display: flex;
		border-bottom: 1px solid var(--border);
		margin-bottom: 20px;
	}

	.modal-tab {
		border: none;
		background: transparent;
		padding: 10px 16px;
		font-size: 0.9rem;
		cursor: pointer;
		color: var(--ink-muted);
		border-bottom: 2px solid transparent;
		margin-bottom: -1px;
	}

	.modal-tab.is-active {
		color: var(--pine);
		border-bottom-color: var(--pine);
		font-weight: 600;
	}

	.modal__form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.field-row {
		display: flex;
		gap: 20px;
		margin-top: 4px;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.9rem;
		cursor: pointer;
	}

	.modal__foot {
		display: flex;
		justify-content: flex-end;
		gap: 12px;
		margin-top: 14px;
	}

	/* Toast */
	.toast {
		position: fixed;
		bottom: 24px;
		right: 24px;
		background: var(--pine);
		color: #fff;
		padding: 12px 20px;
		border-radius: 8px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
		font-size: 0.9rem;
		font-weight: 500;
		z-index: 200;
		animation: toastSlide 0.25s ease-out;
	}

	@keyframes toastSlide {
		from { transform: translateY(20px); opacity: 0; }
		to { transform: translateY(0); opacity: 1; }
	}

	@media (max-width: 680px) {
		.guests-page {
			gap: 16px;
		}

		.guests-header {
			flex-direction: column;
			align-items: stretch;
			gap: 12px;
		}

		.page-title {
			font-size: 1.5rem;
		}

		.page-subtitle {
			font-size: 0.82rem;
		}

		.header-actions {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 8px;
			width: 100%;
		}

		.header-actions .btn {
			padding: 8px 10px;
			font-size: 0.82rem;
			justify-content: center;
			text-align: center;
		}

		.toolbar {
			flex-direction: column;
			align-items: stretch;
			gap: 10px;
		}

		.toolbar__search {
			max-width: 100%;
			min-width: 0;
			width: 100%;
			padding: 8px 12px;
		}

		.toolbar__filters {
			flex-direction: column;
			align-items: stretch;
			gap: 8px;
			width: 100%;
		}

		.btn-group {
			width: 100%;
			display: flex;
		}

		.btn-group__btn {
			flex: 1;
			text-align: center;
			padding: 7px 4px;
			font-size: 0.78rem;
		}

		.table-wrap {
			-webkit-overflow-scrolling: touch;
		}

		.table th, .table td {
			padding: 10px 8px;
			font-size: 0.82rem;
		}

		.guest-name {
			font-size: 0.92rem;
		}

		.action-btn {
			width: 34px;
			height: 34px;
			font-size: 0.95rem;
		}

		.modal-backdrop {
			padding: 10px;
		}

		.modal {
			padding: 16px 14px;
			max-height: 88vh;
			overflow-y: auto;
		}

		.modal__head {
			margin-bottom: 12px;
		}

		.modal__title {
			font-size: 1.25rem;
		}

		.field-row {
			flex-direction: column;
			gap: 10px;
		}

		.modal__foot {
			flex-direction: column-reverse;
			gap: 8px;
		}

		.modal__foot .btn {
			width: 100%;
			justify-content: center;
		}

		.toast {
			left: 12px;
			right: 12px;
			bottom: 14px;
			text-align: center;
			font-size: 0.82rem;
			padding: 10px 14px;
		}
	}
</style>
