<script lang="ts">
	import { content } from '#lib/content.js';
	import { pick } from '#lib/i18n.svelte.js';
	import Ornament from './Ornament.svelte';
	import Reveal from './Reveal.svelte';

	// Фотография ресторана загружается через админку (Тексты → Фото ресторана).
	// Пока фото не загружено — показываем декоративную графику.
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

<section class="section section--pine details" id="details">
	<div class="shell">
		<div class="details__grid">
			<div class="details__when">
				<Reveal>
					<p class="eyebrow">{pick(content.details.eyebrow)}</p>
				</Reveal>

				<Reveal delay={80}>
					<div class="details__date">
						<span class="details__day display">{content.wedding.day}</span>
						<div class="details__date-side">
							<span class="details__month">{pick(content.wedding.month)}</span>
							<span class="details__year">{content.wedding.year}</span>
						</div>
					</div>
				</Reveal>

				<Reveal delay={140}>
					<div class="details__meta">
						<span>{pick(content.details.weekday)}</span>
						<span class="details__meta-line" aria-hidden="true"></span>
						<span>{content.details.time}</span>
					</div>
					<p class="details__note">{pick(content.details.note)}</p>
				</Reveal>
			</div>

			<div class="details__where">
				<Reveal delay={120}>
					<Ornament variant="divider" class="details__ornament" />
				</Reveal>

				<Reveal delay={180}>
					<h2 class="display details__venue">{pick(content.details.venue)}</h2>
					<p class="details__address">{pick(content.details.address)}</p>
					<div class="details__links">
						<a
							class="link-line details__link-item"
							href={content.wedding.mapUrl}
							target="_blank"
							rel="noreferrer"
						>
							<span>{pick(content.details.mapLabel)}</span>
							<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
								<path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" stroke-width="1.1" />
							</svg>
						</a>
						<button
							type="button"
							class="link-line details__link-item details__calendar-btn"
							onclick={addToCalendar}
						>
							<span>{pick(content.details.calendarAdd)}</span>
							<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
								<rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" stroke-width="1.1" />
								<path d="M2 7h12M5 1v3M11 1v3" stroke="currentColor" stroke-width="1.1" />
							</svg>
						</button>
					</div>
				</Reveal>

				<Reveal delay={240}>
					<div class="details__schedule">
						{#each content.details.schedule as item (item.value + pick(item.label))}
							<div class="details__schedule-item">
								<span>{pick(item.label)}</span>
								<strong>{item.value}</strong>
							</div>
						{/each}
					</div>
				</Reveal>
			</div>
		</div>

		<Reveal delay={120}>
			<a
				class="details__map-card"
				class:has-photo={photoOk}
				href={content.wedding.mapUrl}
				target="_blank"
				rel="noreferrer"
				aria-label={`${pick(content.details.venue)} — ${pick(content.details.mapLabel)}`}
			>
				{#if photoOk}
					<img
						class="details__map-photo"
						src="/media/restaurant"
						alt={pick(content.details.venue)}
						loading="lazy"
						onerror={() => (photoOk = false)}
					/>
				{/if}

				<svg
					class="details__map-art"
					viewBox="0 0 1200 340"
					preserveAspectRatio="none"
					fill="none"
					aria-hidden="true"
				>
					<g stroke="currentColor" stroke-width="1" opacity=".2">
						<path d="M-20 74C140 48 260 96 410 72C560 48 700 10 860 40C1010 68 1110 60 1220 34" />
						<path d="M-20 170C120 140 230 178 380 162C560 142 690 110 840 136C990 162 1110 150 1220 126" />
						<path d="M-20 268C150 238 280 288 430 260C590 230 730 202 890 232C1020 256 1120 244 1220 220" />
						<path d="M96 -20C120 80 86 160 110 250C122 302 116 340 108 380" />
						<path d="M322 -20C300 70 340 150 318 240C306 292 320 330 338 380" />
						<path d="M574 -20C596 70 560 160 586 250C600 300 590 340 576 380" />
						<path d="M834 -20C810 80 850 160 826 250C814 300 830 340 846 380" />
						<path d="M1068 -20C1090 80 1056 160 1082 250C1094 300 1088 340 1074 380" />
					</g>
					<g stroke="currentColor" stroke-width="1" opacity=".35">
						<path d="M0 120H1200M0 222H1200" stroke-dasharray="2 8" />
						<path d="M200 0V340M460 0V340M720 0V340M980 0V340" stroke-dasharray="2 8" />
					</g>
					<circle cx="586" cy="162" r="34" stroke="var(--brass)" stroke-width="1" opacity=".55" />
					<circle cx="586" cy="162" r="8" fill="var(--brass)" />
					<path d="M586 196V278" stroke="var(--brass)" stroke-width="1" stroke-dasharray="4 6" />
				</svg>

				<div class="details__map-info">
					<span class="details__map-kicker">17 · 12 · 2026</span>
					<strong>{pick(content.details.venue)}</strong>
					<span>{pick(content.details.address)}</span>
				</div>

				<span class="details__map-action">
					{pick(content.details.mapLabel)}
					<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
						<path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" stroke-width="1.1" />
					</svg>
				</span>
			</a>
		</Reveal>
	</div>
</section>

<style>
	.details {
		position: relative;
		overflow: hidden;
	}

	.details::before {
		content: '';
		position: absolute;
		right: -120px;
		top: -160px;
		width: 520px;
		height: 520px;
		border: 1px solid var(--line-light);
		border-radius: 50%;
		opacity: 0.35;
		pointer-events: none;
	}

	.details__grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: clamp(44px, 8vw, 130px);
		align-items: start;
	}

	.details__when {
		position: relative;
	}

	.details__date {
		display: flex;
		align-items: flex-end;
		gap: 20px;
		margin-top: 22px;
	}

	.details__day {
		font-size: clamp(120px, 16vw, 220px);
		line-height: 0.68;
		letter-spacing: -0.04em;
	}

	.details__date-side {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding-bottom: 10px;
	}

	.details__month {
		font-family: var(--serif);
		font-size: clamp(26px, 3vw, 40px);
		line-height: 1;
	}

	.details__year {
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.26em;
		color: var(--brass-light);
	}

	.details__meta {
		display: flex;
		align-items: center;
		gap: 14px;
		margin-top: 30px;
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--brass-light);
	}

	.details__meta-line {
		width: 24px;
		height: 1px;
		background: var(--line-light);
	}

	.details__note {
		max-width: 34ch;
		margin-top: 18px;
		font-size: 15px;
		line-height: 1.7;
		color: rgba(247, 242, 233, 0.7);
	}

	:global(.details__ornament) {
		width: 160px;
		color: var(--brass-light);
		margin-bottom: 30px;
	}

	.details__venue {
		max-width: 12ch;
		font-size: clamp(38px, 4.6vw, 64px);
		line-height: 1;
	}

	.details__address {
		max-width: 30ch;
		margin-top: 18px;
		font-size: 15px;
		line-height: 1.7;
		color: rgba(247, 242, 233, 0.78);
	}

	.details__links {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 24px;
		margin-top: 26px;
	}

	.details__link-item {
		color: var(--brass-light);
	}

	.details__calendar-btn {
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		cursor: pointer;
		font: inherit;
		text-align: left;
	}

	.details__schedule {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0;
		margin-top: clamp(36px, 5vw, 54px);
		border-top: 1px solid var(--line-light);
		border-left: 1px solid var(--line-light);
	}

	.details__schedule-item {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 16px 18px;
		border-right: 1px solid var(--line-light);
		border-bottom: 1px solid var(--line-light);
	}

	.details__schedule-item span {
		font-size: 8px;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: rgba(247, 242, 233, 0.52);
	}

	.details__schedule-item strong {
		font-family: var(--serif);
		font-size: 24px;
		font-weight: 400;
		line-height: 1.1;
		color: var(--paper);
	}

	.details__map-card {
		position: relative;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 24px;
		min-height: 300px;
		margin-top: clamp(48px, 7vw, 86px);
		padding: clamp(22px, 3.4vw, 40px);
		border: 1px solid var(--line-light);
		overflow: hidden;
		color: var(--paper);
		background: var(--pine-deep);
		transition: border-color 0.3s var(--ease);
	}

	.details__map-card:hover {
		border-color: var(--brass-light);
	}

	.details__map-photo {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		pointer-events: none;
	}

	/* С фото декоративная графика не нужна */
	.details__map-card.has-photo .details__map-art {
		display: none;
	}

	/* Затемняющий градиент поверх фото — для читаемости текста */
	.details__map-card.has-photo::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			180deg,
			rgba(29, 51, 42, 0.18) 0%,
			rgba(29, 51, 42, 0.52) 58%,
			rgba(29, 51, 42, 0.85) 100%
		);
		pointer-events: none;
	}

	.details__map-art {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		color: var(--paper);
		pointer-events: none;
	}

	.details__map-info {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		gap: 5px;
		max-width: 58%;
	}

	.details__map-kicker {
		font-size: 8px;
		font-weight: 700;
		letter-spacing: 0.24em;
		color: var(--brass-light);
	}

	.details__map-info strong {
		font-family: var(--serif);
		font-size: clamp(28px, 3.2vw, 42px);
		font-weight: 400;
		line-height: 1.05;
	}

	.details__map-info span:last-child {
		font-size: 12px;
		line-height: 1.5;
		color: rgba(247, 242, 233, 0.66);
	}

	.details__map-action {
		position: relative;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding-bottom: 4px;
		border-bottom: 1px solid var(--brass-light);
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--brass-light);
		white-space: nowrap;
	}

	.details__map-action svg {
		width: 13px;
		height: 13px;
	}

	@media (max-width: 900px) {
		.details__grid {
			grid-template-columns: minmax(0, 1fr);
			gap: 52px;
		}

		.details__venue {
			max-width: 16ch;
		}
	}

	@media (max-width: 620px) {
		.details__date {
			gap: 14px;
		}

		.details__day {
			font-size: 126px;
		}

		.details__schedule {
			grid-template-columns: minmax(0, 1fr);
		}

		.details__map-card {
			flex-direction: column;
			align-items: flex-start;
			justify-content: flex-end;
			min-height: 320px;
		}

		.details__map-info {
			max-width: 100%;
		}

		.details__map-action {
			margin-top: 6px;
		}

		:global(.details__ornament) {
			width: 120px;
		}
	}
</style>
