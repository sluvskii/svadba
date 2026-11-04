<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const confirmedPct = $derived(
		data.totalGuests > 0 ? Math.round((data.confirmedCount / data.totalGuests) * 100) : 0
	);
</script>

<div class="dash">
	<!-- Hero Header -->
	<header class="dash__header">
		<div>
			<h1 class="dash__title">Свадебная сводка</h1>
			<p class="dash__subtitle">Алина & Камиль · 17 декабря 2026 · Ресторан «Тантана», Нефтекамск</p>
		</div>
		<div class="dash__actions">
			<a href="/admin/guests" class="btn">
				<span>+ Добавить гостей</span>
			</a>
		</div>
	</header>

	<!-- KPI Cards -->
	<section class="kpi-grid">
		<div class="kpi-card">
			<div class="kpi-card__top">
				<span class="kpi-card__label">Всего в списке</span>
				<span class="kpi-card__icon">📋</span>
			</div>
			<div class="kpi-card__value">{data.totalGuests}</div>
			<span class="kpi-card__hint">приглашений сформировано</span>
		</div>

		<div class="kpi-card kpi-card--success">
			<div class="kpi-card__top">
				<span class="kpi-card__label">Подтвердили («Да»)</span>
				<span class="kpi-card__icon">✅</span>
			</div>
			<div class="kpi-card__value">{data.totalAttendingPeople}</div>
			<span class="kpi-card__hint">
				{data.confirmedCount} гостей + {data.plusOnesConfirmed} спутников ({confirmedPct}%)
			</span>
		</div>

		<div class="kpi-card kpi-card--danger">
			<div class="kpi-card__top">
				<span class="kpi-card__label">Не смогут</span>
				<span class="kpi-card__icon">❌</span>
			</div>
			<div class="kpi-card__value">{data.declinedCount}</div>
			<span class="kpi-card__hint">отклонили приглашение</span>
		</div>

		<div class="kpi-card kpi-card--warning">
			<div class="kpi-card__top">
				<span class="kpi-card__label">Ещё думают</span>
				<span class="kpi-card__icon">⏳</span>
			</div>
			<div class="kpi-card__value">{data.pendingCount}</div>
			<span class="kpi-card__hint">пока не ответили</span>
		</div>
	</section>

	<!-- Drinks Breakdown -->
	<section class="card">
		<div class="card__head">
			<div>
				<h2 class="card__title">🥂 Предпочтения по напиткам</h2>
				<p class="card__sub">Поможет рассчитать объём закупки для банкета</p>
			</div>
		</div>

		<div class="drinks-grid">
			{#each data.drinkOptions as opt}
				{@const count = data.drinksTally[opt.id] || 0}
				<div class="drink-item">
					<div class="drink-item__icon">{opt.alcohol ? '🍷' : (opt.id === 'none' ? '🚫' : '🧃')}</div>
					<div class="drink-item__info">
						<span class="drink-item__name">{opt.label}</span>
						<strong class="drink-item__count">{count} {count === 1 ? 'человек' : 'человек(а)'}</strong>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Details 2-Column Grid -->
	<div class="dash-columns">
		<!-- Left: Food Notes & Children -->
		<div class="dash-col">
			<section class="card">
				<div class="card__head">
					<h2 class="card__title">🍽️ Особенности питания и аллергии</h2>
				</div>
				{#if data.foodNotes.length > 0}
					<ul class="notes-list">
						{#each data.foodNotes as item}
							<li class="notes-item">
								<strong>{item.guestName}:</strong>
								<span>{item.note}</span>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="muted">Пока никто не указал аллергий или особых пожеланий.</p>
				{/if}
			</section>

			<section class="card" style="margin-top: 24px;">
				<div class="card__head">
					<h2 class="card__title">👶 Дети на свадьбе</h2>
				</div>
				{#if data.childrenNotes.length > 0}
					<ul class="notes-list">
						{#each data.childrenNotes as item}
							<li class="notes-item">
								<strong>{item.guestName}:</strong>
								<span>{item.children}</span>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="muted">Дети пока не указаны в ответах.</p>
				{/if}
			</section>
		</div>

		<!-- Right: Song requests -->
		<div class="dash-col">
			<section class="card">
				<div class="card__head">
					<h2 class="card__title">🎵 Плейлист для танцпола от гостей</h2>
					<p class="card__sub">Песни, под которые гости точно выйдут танцевать</p>
				</div>
				{#if data.songRequests.length > 0}
					<ul class="songs-list">
						{#each data.songRequests as item}
							<li class="song-item">
								<span class="song-item__icon">🎶</span>
								<div class="song-item__info">
									<strong class="song-item__title">{item.song}</strong>
									<span class="song-item__guest">пожелание от {item.guestName}</span>
								</div>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="muted">Песенные пожелания ещё не поступили.</p>
				{/if}
			</section>
		</div>
	</div>

	<!-- Recent Activity -->
	<section class="card" style="margin-top: 24px;">
		<div class="card__head">
			<div>
				<h2 class="card__title">🕒 Последние ответы</h2>
				<p class="card__sub">Кто недавно заполнил или обновил приглашение</p>
			</div>
			<a href="/admin/guests" class="link-line">
				<span>Все гости ({data.totalGuests}) →</span>
			</a>
		</div>

		{#if data.recentRsvps.length > 0}
			<div class="table-wrap">
				<table class="table">
					<thead>
						<tr>
							<th>Гость</th>
							<th>Сторона</th>
							<th>Ответ</th>
							<th>Спутник (+1)</th>
							<th>Пожелание / комментарий</th>
							<th>Время</th>
						</tr>
					</thead>
					<tbody>
						{#each data.recentRsvps as rsvp}
							<tr>
								<td>
									<strong>{rsvp.name}</strong>
								</td>
								<td>
									{#if rsvp.side === 'bride'}
										<span class="badge badge--pink">Невеста</span>
									{:else if rsvp.side === 'groom'}
										<span class="badge badge--blue">Жених</span>
									{:else}
										<span class="badge">Общие</span>
									{/if}
								</td>
								<td>
									{#if rsvp.attending === 'yes'}
										<span class="badge badge--green">✅ Будет</span>
									{:else}
										<span class="badge badge--red">❌ Не сможет</span>
									{/if}
								</td>
								<td>{rsvp.plusOne || '—'}</td>
								<td>{rsvp.comment || '—'}</td>
								<td class="muted tiny">{new Date(rsvp.updatedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<p class="muted">Ответов пока нет. Отправьте персональные ссылки гостям!</p>
		{/if}
	</section>
</div>

<style>
	.dash {
		display: flex;
		flex-direction: column;
		gap: 28px;
	}

	.dash__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		flex-wrap: wrap;
	}

	.dash__title {
		font-family: var(--font-display);
		font-size: 2.2rem;
		margin: 0 0 4px 0;
		color: var(--ink);
	}

	.dash__subtitle {
		color: var(--ink-muted);
		margin: 0;
		font-size: 0.95rem;
	}

	.kpi-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 16px;
	}

	.kpi-card {
		background: var(--paper);
		border: 1px solid var(--border);
		border-radius: var(--radius-md, 10px);
		padding: 20px;
		display: flex;
		flex-direction: column;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
	}

	.kpi-card--success {
		border-left: 4px solid #2b473a;
	}

	.kpi-card--danger {
		border-left: 4px solid #c53030;
	}

	.kpi-card--warning {
		border-left: 4px solid #d97706;
	}

	.kpi-card__top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 8px;
	}

	.kpi-card__label {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--ink-muted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.kpi-card__icon {
		font-size: 1.1rem;
	}

	.kpi-card__value {
		font-size: 2.2rem;
		font-weight: 700;
		font-family: var(--font-display);
		color: var(--ink);
		line-height: 1.1;
		margin-bottom: 6px;
	}

	.kpi-card__hint {
		font-size: 0.8rem;
		color: var(--ink-muted);
	}

	.card {
		background: var(--paper);
		border: 1px solid var(--border);
		border-radius: var(--radius-md, 10px);
		padding: 24px;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
	}

	.card__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20px;
		gap: 16px;
		flex-wrap: wrap;
	}

	.card__title {
		font-size: 1.25rem;
		font-family: var(--font-display);
		margin: 0 0 4px 0;
		color: var(--ink);
	}

	.card__sub {
		color: var(--ink-muted);
		font-size: 0.85rem;
		margin: 0;
	}

	.drinks-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 14px;
	}

	.drink-item {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 12px 16px;
		background: #fbfbfa;
		border: 1px solid var(--border);
		border-radius: 8px;
	}

	.drink-item__icon {
		font-size: 1.6rem;
	}

	.drink-item__info {
		display: flex;
		flex-direction: column;
	}

	.drink-item__name {
		font-size: 0.85rem;
		color: var(--ink-muted);
	}

	.drink-item__count {
		font-size: 1.05rem;
		color: var(--ink);
	}

	.dash-columns {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
	}

	@media (max-width: 900px) {
		.dash-columns {
			grid-template-columns: 1fr;
		}
	}

	.notes-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.notes-item {
		padding: 10px 14px;
		background: #fafaf8;
		border-left: 3px solid var(--brass);
		border-radius: 4px;
		font-size: 0.9rem;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.songs-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.song-item {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 10px 14px;
		background: #fafaf8;
		border: 1px solid var(--border);
		border-radius: 6px;
	}

	.song-item__icon {
		font-size: 1.2rem;
	}

	.song-item__info {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.song-item__title {
		font-size: 0.95rem;
		color: var(--ink);
	}

	.song-item__guest {
		font-size: 0.8rem;
		color: var(--ink-muted);
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
		padding: 10px 14px;
		border-bottom: 1px solid var(--border);
		color: var(--ink-muted);
		font-weight: 600;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.table td {
		padding: 12px 14px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.05);
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

	.badge--green {
		background: #def7ec;
		color: #03543f;
	}

	.badge--red {
		background: #fde8e8;
		color: #9b1c1c;
	}

	.badge--pink {
		background: #fce8f3;
		color: #99154b;
	}

	.badge--blue {
		background: #e1effe;
		color: #1e429f;
	}

	@media (max-width: 640px) {
		.dash {
			gap: 18px;
		}

		.dash__header {
			flex-direction: column;
			align-items: stretch;
			gap: 12px;
		}

		.dash__title {
			font-size: 1.5rem;
		}

		.dash__subtitle {
			font-size: 0.82rem;
		}

		.dash__actions {
			width: 100%;
		}

		.dash__actions .btn {
			width: 100%;
			justify-content: center;
		}

		.kpi-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 8px;
		}

		.kpi-card {
			padding: 12px 10px;
		}

		.kpi-card__label {
			font-size: 0.7rem;
		}

		.kpi-card__value {
			font-size: 1.55rem;
			margin-bottom: 2px;
		}

		.kpi-card__hint {
			font-size: 0.72rem;
		}

		.card {
			padding: 14px 12px;
			border-radius: 8px;
		}

		.card__head {
			margin-bottom: 12px;
		}

		.card__title {
			font-size: 1.15rem;
		}

		.drinks-grid {
			grid-template-columns: 1fr;
			gap: 8px;
		}

		.drink-item {
			padding: 8px 12px;
		}

		.table-wrap {
			-webkit-overflow-scrolling: touch;
		}

		.table th, .table td {
			padding: 8px 10px;
			font-size: 0.82rem;
		}
	}
</style>
