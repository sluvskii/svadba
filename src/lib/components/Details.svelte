<script lang="ts">
	import { content } from '#lib/content.js';
	import { pick } from '#lib/i18n.svelte.js';
	import Reveal from './Reveal.svelte';

	// Фотография ресторана загружается через админку (Тексты → Фото ресторана).
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
				<p class="lead details__subtitle">
					Всё самое важное, чтобы вы могли спланировать праздничный день вместе с нами
				</p>
			</Reveal>
		</div>

		<div class="details__grid">
			<!-- Карточка: Дата и время -->
			<Reveal delay={80} class="details__card-reveal">
				<div class="details__card details__card--date">
					<div class="details__card-top">
						<span class="details__tag">
							<svg viewBox="0 0 16 16" fill="none" class="details__tag-icon" aria-hidden="true">
								<rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" stroke-width="1.2" />
								<path d="M2 7h12M5 1v3M11 1v3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
							</svg>
							<span>{pick(content.details.weekday)}</span>
						</span>
					</div>

					<div class="details__date-display">
						<span class="details__day display">{content.wedding.day}</span>
						<div class="details__date-meta">
							<span class="details__month">{pick(content.wedding.month)}</span>
							<span class="details__year">{content.wedding.year}</span>
						</div>
					</div>

					<div class="details__time-pill">
						<span class="details__time-dot" aria-hidden="true"></span>
						<span class="details__time-text">
							Сбор гостей в <strong>14:00</strong> · Церемония в <strong>14:20</strong>
						</span>
					</div>

					<p class="details__note">
						{pick(content.details.note)}
					</p>

					<div class="details__action">
						<button type="button" class="btn btn--outline details__btn" onclick={addToCalendar}>
							<svg viewBox="0 0 16 16" fill="none" class="details__btn-icon" aria-hidden="true">
								<rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" stroke-width="1.2" />
								<path d="M2 7h12M5 1v3M11 1v3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
							</svg>
							<span>{pick(content.details.calendarAdd)}</span>
						</button>
					</div>
				</div>
			</Reveal>

			<!-- Карточка: Место торжества & Маршрут -->
			<Reveal delay={140} class="details__card-reveal">
				<div class="details__card details__card--venue">
					<div class="details__card-top">
						<span class="details__tag">
							<svg viewBox="0 0 16 16" fill="none" class="details__tag-icon" aria-hidden="true">
								<path d="M8 1.5C5.24 1.5 3 3.74 3 6.5c0 3.8 4.6 7.7 4.8 7.85.12.1.28.1.4 0 .2-.15 4.8-4.05 4.8-7.85 0-2.76-2.24-5-5-5zm0 7a2 2 0 110-4 2 2 0 010 4z" stroke="currentColor" stroke-width="1.2" />
							</svg>
							<span>{pick(content.details.venueEyebrow)}</span>
						</span>
					</div>

					<h3 class="display details__venue-title">{pick(content.details.venue)}</h3>
					<p class="details__address">{pick(content.details.address)}</p>

					<!-- Интерактивное превью ресторана -->
					<a
						class="details__preview"
						class:has-photo={photoOk}
						href={content.wedding.mapUrl}
						target="_blank"
						rel="noreferrer"
						aria-label={`${pick(content.details.venue)} на Яндекс.Картах`}
					>
						{#if photoOk}
							<img
								class="details__preview-img"
								src="/media/restaurant"
								alt={pick(content.details.venue)}
								loading="lazy"
								onerror={() => (photoOk = false)}
							/>
						{:else}
							<div class="details__preview-empty">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" class="details__preview-empty-icon" aria-hidden="true">
									<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
								</svg>
								<span>{pick(content.details.venue)}</span>
							</div>
						{/if}

						<div class="details__preview-scrim">
							<span class="details__preview-pill">
								<span>{pick(content.details.mapLabel)}</span>
								<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
									<path d="M2 8h11M8 3l5 5-5 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
							</span>
						</div>
					</a>

					<div class="details__action">
						<a class="btn details__btn" href={content.wedding.mapUrl} target="_blank" rel="noreferrer">
							<span>{pick(content.details.mapLabel)}</span>
							<svg viewBox="0 0 16 16" fill="none" class="details__btn-icon" aria-hidden="true">
								<path d="M2 8h11M8 3l5 5-5 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
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
		background: var(--paper-2);
		position: relative;
	}

	.details__header {
		max-width: 680px;
		margin-bottom: clamp(40px, 6vw, 68px);
	}

	.details__title {
		margin-top: 18px;
		font-size: clamp(38px, 5.2vw, 68px);
		line-height: 1.02;
		color: var(--ink);
	}

	.details__subtitle {
		margin-top: 16px;
		font-size: clamp(16px, 1.25vw, 19px);
		line-height: 1.65;
		color: var(--ink-soft);
	}

	.details__grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: clamp(24px, 3.5vw, 44px);
		align-items: stretch;
	}

	:global(.details__card-reveal) {
		height: 100%;
		display: flex;
	}

	.details__card {
		display: flex;
		flex-direction: column;
		width: 100%;
		padding: clamp(28px, 4vw, 44px);
		background: #ffffff;
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-card);
		transition:
			transform 0.4s var(--ease),
			box-shadow 0.4s var(--ease),
			border-color 0.4s var(--ease);
	}

	.details__card:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-float);
		border-color: rgba(27, 48, 37, 0.16);
	}

	.details__card-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 24px;
	}

	.details__tag {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 6px 14px;
		border-radius: var(--radius-pill);
		background: var(--paper);
		border: 1px solid var(--line);
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--pine);
	}

	.details__tag-icon {
		width: 13px;
		height: 13px;
		color: var(--pine);
	}

	/* Блок даты */
	.details__date-display {
		display: flex;
		align-items: flex-end;
		gap: 16px;
		margin-bottom: 22px;
	}

	.details__day {
		font-size: clamp(84px, 11vw, 132px);
		line-height: 0.78;
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
		font-size: clamp(26px, 3.2vw, 38px);
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

	.details__time-pill {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 10px 16px;
		margin-bottom: 18px;
		background: rgba(118, 141, 126, 0.1);
		border: 1px solid rgba(118, 141, 126, 0.22);
		border-radius: var(--radius-sm);
		font-size: 13px;
		color: var(--ink);
	}

	.details__time-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--pine);
		flex: 0 0 auto;
	}

	.details__note {
		font-size: 14px;
		line-height: 1.65;
		color: var(--ink-soft);
		margin-bottom: 28px;
	}

	/* Блок ресторана */
	.details__venue-title {
		font-size: clamp(32px, 3.8vw, 46px);
		line-height: 1.05;
		color: var(--ink);
		margin-bottom: 8px;
	}

	.details__address {
		font-size: 14px;
		line-height: 1.6;
		color: var(--ink-soft);
		margin-bottom: 20px;
	}

	.details__preview {
		position: relative;
		display: block;
		width: 100%;
		height: clamp(180px, 22vw, 240px);
		border-radius: var(--radius);
		overflow: hidden;
		border: 1px solid var(--line);
		margin-bottom: 24px;
		text-decoration: none;
		background: var(--paper-3);
	}

	.details__preview-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.6s var(--ease);
	}

	.details__preview:hover .details__preview-img {
		transform: scale(1.04);
	}

	.details__preview-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		gap: 8px;
		color: var(--ink-soft);
		font-size: 12px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.details__preview-empty-icon {
		width: 32px;
		height: 32px;
		color: var(--pine);
	}

	.details__preview-scrim {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			180deg,
			rgba(17, 32, 24, 0.05) 0%,
			rgba(17, 32, 24, 0.72) 100%
		);
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		padding: 16px;
		transition: background 0.3s var(--ease);
	}

	.details__preview:hover .details__preview-scrim {
		background: linear-gradient(
			180deg,
			rgba(17, 32, 24, 0.1) 0%,
			rgba(17, 32, 24, 0.82) 100%
		);
	}

	.details__preview-pill {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 8px 16px;
		border-radius: var(--radius-pill);
		background: rgba(255, 255, 255, 0.92);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		color: var(--pine);
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
		transition: transform 0.3s var(--ease);
	}

	.details__preview:hover .details__preview-pill {
		transform: translateY(-2px);
	}

	.details__preview-pill svg {
		width: 12px;
		height: 12px;
	}

	/* Кнопки действий */
	.details__action {
		margin-top: auto;
		display: flex;
	}

	.details__btn {
		width: 100%;
	}

	.details__btn-icon {
		width: 14px;
		height: 14px;
		flex: 0 0 auto;
	}

	@media (max-width: 860px) {
		.details__grid {
			grid-template-columns: minmax(0, 1fr);
			gap: 24px;
		}

		.details__card {
			padding: 24px 20px;
		}

		.details__preview {
			height: 200px;
		}
	}
</style>
