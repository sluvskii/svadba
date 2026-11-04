<script lang="ts">
	import { content } from '#lib/content.js';
	import { pick } from '#lib/i18n.svelte.js';
	import Reveal from './Reveal.svelte';

	let photoOk = $state(true);

	function addToCalendar() {
		const title = 'Свадьба Алины и Камиля';
		const venue = pick(content.details.venue);
		const address = pick(content.details.address);
		const description = `${title}\\n${venue}, ${address}`;
		const ics = [
			'BEGIN:VCALENDAR',
			'VERSION:2.0',
			'PRODID:-//Alina and Kamil Wedding//RU',
			'CALSCALE:GREGORIAN',
			'METHOD:PUBLISH',
			'BEGIN:VEVENT',
			'UID:wedding-alina-kamil-20261217@svadba',
			'DTSTAMP:20261104T000000Z',
			'DTSTART:20261217T090000Z',
			'DTEND:20261217T180000Z',
			`SUMMARY:${title}`,
			`DESCRIPTION:${description}`,
			`LOCATION:${venue}, ${address}`,
			'STATUS:CONFIRMED',
			'END:VEVENT',
			'END:VCALENDAR'
		].join('\r\n');

		const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'wedding-alina-kamil.ics';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
</script>

<section class="section details" id="details">
	<div class="shell">
		<div class="details__header">
			<Reveal>
				<p class="eyebrow">{pick(content.details.eyebrow)}</p>
				<h2 class="display details__title">Дата и место</h2>
			</Reveal>
		</div>

		<div class="details__grid">
			<!-- Колонка 1: Дата и время -->
			<Reveal delay={80} class="details__col-wrap">
				<div class="details__col">
					<div class="details__section-label">
						<span class="tiny muted">{pick(content.details.weekday)}</span>
					</div>

					<div class="details__date-display">
						<span class="details__day display">{content.wedding.day}</span>
						<div class="details__date-meta">
							<span class="details__month">{pick(content.wedding.month)}</span>
							<span class="details__year">{content.wedding.year}</span>
						</div>
					</div>

					<div class="details__timetable">
						<div class="details__time-cell">
							<span class="details__time-kicker">Сбор гостей</span>
							<strong class="details__time-val">14:00</strong>
						</div>
						<div class="details__time-cell">
							<span class="details__time-kicker">Церемония</span>
							<strong class="details__time-val">14:20</strong>
						</div>
					</div>

					<p class="details__note">
						{pick(content.details.note)}
					</p>

					<div class="details__action">
						<button type="button" class="btn btn--outline details__btn" onclick={addToCalendar}>
							<span>{pick(content.details.calendarAdd)}</span>
						</button>
					</div>
				</div>
			</Reveal>

			<!-- Колонка 2: Место проведения & Карта -->
			<Reveal delay={140} class="details__col-wrap">
				<div class="details__col">
					<div class="details__section-label">
						<span class="tiny muted">{pick(content.details.venueEyebrow)}</span>
					</div>

					<h3 class="display details__venue-title">{pick(content.details.venue)}</h3>
					<p class="details__address">{pick(content.details.address)}</p>

					<!-- Фотография ресторана: чистый прямоугольный баннер без дублирующих кнопок поверх него -->
					<div class="details__photo-frame">
						{#if photoOk}
							<img
								class="details__photo"
								src="/media/restaurant"
								alt={pick(content.details.venue)}
								loading="lazy"
								onerror={() => (photoOk = false)}
							/>
						{:else}
							<div class="details__photo-fallback">
								<span>{pick(content.details.venue)}</span>
							</div>
						{/if}
					</div>

					<!-- ЕДИНСТВЕННАЯ кнопка перехода на карту -->
					<div class="details__action">
						<a
							class="btn details__btn"
							href={content.wedding.mapUrl}
							target="_blank"
							rel="noreferrer"
						>
							<span>{pick(content.details.mapLabel)}</span>
							<svg viewBox="0 0 16 16" fill="none" class="details__btn-icon" aria-hidden="true">
								<path d="M2 8h11M8 3l5 5-5 5" stroke="currentColor" stroke-width="1.3" />
							</svg>
						</a>
					</div>
				</div>
			</Reveal>
		</div>
	</div>
</section>

<style>
	.details {
		background: var(--paper);
		position: relative;
	}

	.details__header {
		margin-bottom: clamp(36px, 5vw, 60px);
	}

	.details__title {
		margin-top: 18px;
		font-size: clamp(42px, 5.6vw, 76px);
		line-height: 0.98;
		color: var(--ink);
	}

	.details__grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: clamp(32px, 5vw, 64px);
		align-items: stretch;
	}

	:global(.details__col-wrap) {
		height: 100%;
		display: flex;
	}

	.details__col {
		display: flex;
		flex-direction: column;
		width: 100%;
		padding: clamp(28px, 4vw, 42px);
		background: #ffffff;
		border: 1px solid var(--line);
		border-radius: 0;
	}

	.details__section-label {
		padding-bottom: 14px;
		margin-bottom: 22px;
		border-bottom: 1px solid var(--line);
	}

	/* Блок даты */
	.details__date-display {
		display: flex;
		align-items: flex-end;
		gap: 16px;
		margin-bottom: 24px;
	}

	.details__day {
		font-size: clamp(92px, 12vw, 136px);
		line-height: 0.74;
		letter-spacing: -0.04em;
		color: var(--pine);
	}

	.details__date-meta {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding-bottom: 6px;
	}

	.details__month {
		font-family: var(--serif);
		font-size: clamp(28px, 3.4vw, 42px);
		line-height: 1;
		color: var(--ink);
	}

	.details__year {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}

	/* Чёткая таблица времени */
	.details__timetable {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		border: 1px solid var(--line);
		margin-bottom: 22px;
	}

	.details__time-cell {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 14px 18px;
	}

	.details__time-cell + .details__time-cell {
		border-left: 1px solid var(--line);
	}

	.details__time-kicker {
		font-size: 8px;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}

	.details__time-val {
		font-family: var(--serif);
		font-size: 26px;
		font-weight: 400;
		line-height: 1;
		color: var(--pine);
	}

	.details__note {
		font-size: 14px;
		line-height: 1.65;
		color: var(--ink-soft);
		margin-bottom: 28px;
	}

	/* Блок ресторана */
	.details__venue-title {
		font-size: clamp(34px, 4vw, 50px);
		line-height: 1.02;
		color: var(--ink);
		margin-bottom: 8px;
	}

	.details__address {
		font-size: 14px;
		line-height: 1.6;
		color: var(--ink-soft);
		margin-bottom: 22px;
	}

	.details__photo-frame {
		position: relative;
		width: 100%;
		height: clamp(170px, 20vw, 220px);
		border: 1px solid var(--line);
		overflow: hidden;
		margin-bottom: 24px;
		background: var(--paper-3);
	}

	.details__photo {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.details__photo-fallback {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: var(--ink-soft);
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	/* Кнопки действий */
	.details__action {
		margin-top: auto;
	}

	.details__btn {
		width: 100%;
	}

	.details__btn-icon {
		width: 13px;
		height: 13px;
	}

	@media (max-width: 860px) {
		.details__grid {
			grid-template-columns: minmax(0, 1fr);
			gap: 28px;
		}

		.details__col {
			padding: 24px 20px;
		}

		.details__photo-frame {
			height: 190px;
		}
	}
</style>
