<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let showAddModal = $state(false);
	let editingTable = $state<any | null>(null);

	const percentSeated = $derived(
		data.totalGuests > 0 ? Math.round((data.seatedCount / data.totalGuests) * 100) : 0
	);
</script>

<div class="seating-admin">
	<!-- Page Header -->
	<header class="seating-head">
		<div>
			<h1 class="page-title">План рассадки столов</h1>
			<p class="page-subtitle">
				Рассажено: <strong>{data.seatedCount}</strong> из <strong>{data.totalGuests}</strong> гостей ({percentSeated}%)
			</p>
		</div>

		<div class="head-actions">
			<form method="POST" action="?/toggleVisibility" use:enhance class="visibility-form">
				<label class="visibility-toggle">
					<input
						type="checkbox"
						checked={data.seatingVisible}
						onchange={(e) => e.currentTarget.form?.requestSubmit()}
					/>
					<span class="toggle-switch"></span>
					<span class="toggle-label">
						{data.seatingVisible ? 'Схема открыта на сайте' : 'Схема скрыта от гостей'}
					</span>
				</label>
			</form>

			<button class="btn" type="button" onclick={() => (showAddModal = true)}>
				<span>+ Добавить стол</span>
			</button>
		</div>
	</header>

	<!-- Progress Bar -->
	<div class="progress-wrap">
		<div class="progress-bar">
			<div class="progress-bar__fill" style={`width: ${percentSeated}%;`}></div>
		</div>
	</div>

	<!-- Main Seating Layout: Tables & Unassigned -->
	<div class="seating-layout">
		<!-- Left: Tables Grid -->
		<div class="tables-section">
			<h2 class="section-title">Столы в зале ({data.tables.length})</h2>

			{#if data.tables.length > 0}
				<div class="tables-grid">
					{#each data.tables as table (table.id)}
						{@const isFull = table.guests.length >= table.capacity}
						<div class="table-card" class:table-card--full={isFull}>
							<div class="table-card__head">
								<div>
									<h3 class="table-card__name">{table.name}</h3>
									<span class="table-card__cap" class:text-danger={isFull}>
										{table.guests.length} / {table.capacity} мест
									</span>
								</div>
								<div class="table-card__controls">
									<button
										type="button"
										class="icon-btn"
										title="Редактировать стол"
										onclick={() => (editingTable = table)}
									>
										✏️
									</button>
									<form
										method="POST"
										action="?/deleteTable"
										use:enhance
										onsubmit={(e) => {
											if (!confirm(`Удалить «${table.name}»? Гости за ним будут откреплены.`)) {
												e.preventDefault();
											}
										}}
									>
										<input type="hidden" name="id" value={table.id} />
										<button type="submit" class="icon-btn icon-btn--danger" title="Удалить стол">
											🗑️
										</button>
									</form>
								</div>
							</div>

							<!-- Guests in this table -->
							<div class="table-guests-list">
								{#if table.guests.length > 0}
									{#each table.guests as guest}
										<div class="table-guest-item">
											<div class="guest-info">
												<span class="guest-title">{guest.name}</span>
												{#if guest.side === 'bride'}
													<span class="tiny-dot tiny-dot--pink" title="Сторона невесты"></span>
												{:else if guest.side === 'groom'}
													<span class="tiny-dot tiny-dot--blue" title="Сторона жениха"></span>
												{/if}
											</div>
											<form method="POST" action="?/assignSeat" use:enhance>
												<input type="hidden" name="guestId" value={guest.id} />
												<input type="hidden" name="tableId" value="" />
												<button
													type="submit"
													class="unseat-btn"
													title="Убрать гостя из этого стола"
												>
													✕
												</button>
											</form>
										</div>
									{/each}
								{:else}
									<p class="empty-table-note">Стол пока свободен</p>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="empty-card">
					<p>Столы ещё не добавлены.</p>
					<button class="btn btn--outline" type="button" onclick={() => (showAddModal = true)}>
						+ Создать первый стол
					</button>
				</div>
			{/if}
		</div>

		<!-- Right: Unassigned Guests -->
		<div class="unassigned-section">
			<div class="unassigned-card">
				<div class="unassigned-card__head">
					<h2 class="unassigned-card__title">
						Нерассаженные гости ({data.unassignedGuests.length})
					</h2>
					<p class="unassigned-card__sub">Выберите стол для быстрой посадки</p>
				</div>

				{#if data.unassignedGuests.length > 0}
					<div class="unassigned-list">
						{#each data.unassignedGuests as guest (guest.id)}
							<div class="unassigned-item">
								<div class="unassigned-info">
									<strong class="unassigned-name">{guest.name}</strong>
									<span class="unassigned-side">
										{guest.side === 'bride' ? 'Невеста' : guest.side === 'groom' ? 'Жених' : 'Общие'}
									</span>
								</div>

								<form method="POST" action="?/assignSeat" use:enhance class="seat-assign-form">
									<input type="hidden" name="guestId" value={guest.id} />
									<select
										name="tableId"
										class="assign-select"
										onchange={(e) => e.currentTarget.form?.requestSubmit()}
									>
										<option value="">Посадить за стол...</option>
										{#each data.tables as t}
											<option value={t.id}>{t.name} ({t.guests.length}/{t.capacity})</option>
										{/each}
									</select>
								</form>
							</div>
						{/each}
					</div>
				{:else}
					<div class="all-seated-badge">
						🎉 Все гости рассажены по столам!
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<!-- Modal: Add Table -->
{#if showAddModal}
	<div
		class="modal-backdrop"
		onclick={() => (showAddModal = false)}
		onkeydown={(e) => {
			if (e.key === 'Escape') showAddModal = false;
		}}
		role="presentation"
	>
		<div
			class="modal"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => {
				if (e.key === 'Escape') showAddModal = false;
			}}
			role="dialog"
			aria-modal="true"
			tabindex="-1"
		>
			<div class="modal__head">
				<h2 class="modal__title">Добавление стола</h2>
				<button class="modal__close" type="button" onclick={() => (showAddModal = false)}>✕</button>
			</div>

			<form
				method="POST"
				action="?/addTable"
				use:enhance={() => {
					return async ({ update }) => {
						await update();
						showAddModal = false;
					};
				}}
				class="modal__form"
			>
				<div class="field">
					<label class="field-label" for="table-name">Название стола *</label>
					<input
						class="input"
						id="table-name"
						name="name"
						required
						placeholder="Например: Стол 1, Стол родителей или Стол молодёжи"
					/>
				</div>

				<div class="field">
					<label class="field-label" for="table-cap">Вместимость (человек)</label>
					<input
						class="input"
						id="table-cap"
						name="capacity"
						type="number"
						min="1"
						max="30"
						value="8"
						required
					/>
				</div>

				<div class="modal__foot">
					<button class="btn btn--outline" type="button" onclick={() => (showAddModal = false)}>
						Отмена
					</button>
					<button class="btn" type="submit">Создать стол</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Modal: Edit Table -->
{#if editingTable}
	<div
		class="modal-backdrop"
		onclick={() => (editingTable = null)}
		onkeydown={(e) => {
			if (e.key === 'Escape') editingTable = null;
		}}
		role="presentation"
	>
		<div
			class="modal"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => {
				if (e.key === 'Escape') editingTable = null;
			}}
			role="dialog"
			aria-modal="true"
			tabindex="-1"
		>
			<div class="modal__head">
				<h2 class="modal__title">Редактирование стола</h2>
				<button class="modal__close" type="button" onclick={() => (editingTable = null)}>✕</button>
			</div>

			<form
				method="POST"
				action="?/updateTable"
				use:enhance={() => {
					return async ({ update }) => {
						await update();
						editingTable = null;
					};
				}}
				class="modal__form"
			>
				<input type="hidden" name="id" value={editingTable.id} />

				<div class="field">
					<label class="field-label" for="edit-t-name">Название стола *</label>
					<input
						class="input"
						id="edit-t-name"
						name="name"
						value={editingTable.name}
						required
					/>
				</div>

				<div class="field">
					<label class="field-label" for="edit-t-cap">Вместимость</label>
					<input
						class="input"
						id="edit-t-cap"
						name="capacity"
						type="number"
						min="1"
						max="30"
						value={editingTable.capacity}
						required
					/>
				</div>

				<div class="modal__foot">
					<button class="btn btn--outline" type="button" onclick={() => (editingTable = null)}>
						Отмена
					</button>
					<button class="btn" type="submit">Сохранить</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.seating-admin {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.seating-head {
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

	.head-actions {
		display: flex;
		align-items: center;
		gap: 16px;
		flex-wrap: wrap;
	}

	/* Visibility Toggle */
	.visibility-toggle {
		display: flex;
		align-items: center;
		gap: 10px;
		cursor: pointer;
		user-select: none;
		background: var(--paper);
		border: 1px solid var(--border);
		padding: 8px 14px;
		border-radius: 8px;
	}

	.visibility-toggle input {
		display: none;
	}

	.toggle-switch {
		width: 36px;
		height: 20px;
		background: #d1d5db;
		border-radius: 999px;
		position: relative;
		transition: background 0.2s;
	}

	.toggle-switch::after {
		content: '';
		position: absolute;
		top: 2px;
		left: 2px;
		width: 16px;
		height: 16px;
		background: #fff;
		border-radius: 50%;
		transition: transform 0.2s;
	}

	.visibility-toggle input:checked + .toggle-switch {
		background: var(--pine);
	}

	.visibility-toggle input:checked + .toggle-switch::after {
		transform: translateX(16px);
	}

	.toggle-label {
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--ink);
	}

	.progress-wrap {
		width: 100%;
	}

	.progress-bar {
		height: 8px;
		background: #e5e7eb;
		border-radius: 999px;
		overflow: hidden;
	}

	.progress-bar__fill {
		height: 100%;
		background: var(--pine);
		transition: width 0.3s ease;
	}

	.seating-layout {
		display: grid;
		grid-template-columns: 1fr 340px;
		gap: 24px;
		align-items: start;
	}

	@media (max-width: 960px) {
		.seating-layout {
			grid-template-columns: 1fr;
		}
	}

	.section-title {
		font-family: var(--font-display);
		font-size: 1.35rem;
		margin: 0 0 16px 0;
		color: var(--ink);
	}

	.tables-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: 16px;
	}

	.table-card {
		background: var(--paper);
		border: 1px solid var(--border);
		border-radius: var(--radius-md, 10px);
		padding: 16px;
		display: flex;
		flex-direction: column;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
		transition: border-color 0.2s;
	}

	.table-card--full {
		border-color: #f98080;
	}

	.table-card__head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 12px;
		padding-bottom: 10px;
		border-bottom: 1px solid var(--border);
	}

	.table-card__name {
		font-size: 1.1rem;
		font-family: var(--font-display);
		margin: 0 0 2px 0;
	}

	.table-card__cap {
		font-size: 0.8rem;
		color: var(--ink-muted);
	}

	.text-danger {
		color: #c53030;
		font-weight: 600;
	}

	.table-card__controls {
		display: flex;
		gap: 4px;
	}

	.icon-btn {
		background: transparent;
		border: 1px solid transparent;
		border-radius: 4px;
		width: 28px;
		height: 28px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		font-size: 0.85rem;
	}

	.icon-btn:hover {
		background: #f3f4f6;
		border-color: #e5e7eb;
	}

	.icon-btn--danger:hover {
		background: #fde8e8;
		border-color: #f98080;
	}

	.table-guests-list {
		display: flex;
		flex-direction: column;
		gap: 6px;
		min-height: 80px;
	}

	.table-guest-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 6px 10px;
		background: #fbfbfa;
		border: 1px solid var(--border);
		border-radius: 6px;
		font-size: 0.85rem;
	}

	.guest-info {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.tiny-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
	}

	.tiny-dot--pink { background: #e02424; }
	.tiny-dot--blue { background: #1c64f2; }

	.unseat-btn {
		border: none;
		background: transparent;
		color: #9ca3af;
		cursor: pointer;
		font-size: 0.75rem;
		padding: 2px 4px;
	}

	.unseat-btn:hover {
		color: #e02424;
	}

	.empty-table-note {
		color: var(--ink-muted);
		font-size: 0.85rem;
		font-style: italic;
		text-align: center;
		margin: auto 0;
	}

	/* Unassigned Section */
	.unassigned-card {
		background: var(--paper);
		border: 1px solid var(--border);
		border-radius: var(--radius-md, 10px);
		padding: 20px;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
		position: sticky;
		top: 80px;
	}

	.unassigned-card__head {
		margin-bottom: 16px;
	}

	.unassigned-card__title {
		font-size: 1.15rem;
		font-family: var(--font-display);
		margin: 0 0 4px 0;
	}

	.unassigned-card__sub {
		color: var(--ink-muted);
		font-size: 0.8rem;
		margin: 0;
	}

	.unassigned-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
		max-height: 480px;
		overflow-y: auto;
		padding-right: 4px;
	}

	.unassigned-item {
		padding: 10px;
		background: #fbfbfa;
		border: 1px solid var(--border);
		border-radius: 6px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.unassigned-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.unassigned-name {
		font-size: 0.9rem;
	}

	.unassigned-side {
		font-size: 0.75rem;
		color: var(--ink-muted);
	}

	.assign-select {
		width: 100%;
		padding: 6px 8px;
		font-size: 0.8rem;
		border: 1px solid var(--border);
		border-radius: 6px;
		background: #fff;
	}

	.all-seated-badge {
		padding: 24px;
		text-align: center;
		background: #def7ec;
		color: #03543f;
		border-radius: 8px;
		font-weight: 500;
		font-size: 0.95rem;
	}

	.empty-card {
		padding: 40px;
		text-align: center;
		background: var(--paper);
		border: 1px dashed var(--border);
		border-radius: var(--radius-md, 10px);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}

	/* Modal */
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
		max-width: 440px;
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
		font-size: 1.4rem;
		margin: 0;
	}

	.modal__close {
		border: none;
		background: transparent;
		font-size: 1.2rem;
		cursor: pointer;
		color: var(--ink-muted);
	}

	.modal__form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.modal__foot {
		display: flex;
		justify-content: flex-end;
		gap: 12px;
		margin-top: 14px;
	}

	@media (max-width: 680px) {
		.seating-head {
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

		.head-actions {
			flex-direction: column;
			align-items: stretch;
			gap: 8px;
		}

		.visibility-toggle {
			width: 100%;
			justify-content: space-between;
			padding: 8px 12px;
		}

		.head-actions .btn {
			width: 100%;
			justify-content: center;
		}

		.tables-grid {
			grid-template-columns: 1fr;
			gap: 12px;
		}

		.modal-backdrop {
			padding: 10px;
		}

		.modal {
			padding: 16px 14px;
			max-height: 88vh;
			overflow-y: auto;
		}

		.modal__foot {
			flex-direction: column-reverse;
			gap: 8px;
		}

		.modal__foot .btn {
			width: 100%;
			justify-content: center;
		}
	}
</style>
