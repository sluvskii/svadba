<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	let saving = $state(false);
	let savedSuccess = $state(false);
	let uploading = $state(false);

	// Списки редактируются локально и уходят на сервер JSON-ом при сохранении.
	// Начальные значения data берутся один раз — это намеренно.
	/* svelte-ignore state_referenced_locally */
	let chapters = $state<{ title: string; text: string }[]>(data.storyChapters);
	/* svelte-ignore state_referenced_locally */
	let faqItems = $state<{ q: string; a: string }[]>(data.faqItems);
	/* svelte-ignore state_referenced_locally */
	let courses = $state<{ label: string; title: string; text: string }[]>(data.menuCourses);
	/* svelte-ignore state_referenced_locally */
	let menuBar = $state(data.menuBar);
	/* svelte-ignore state_referenced_locally */
	let drinksList = $state<{ id: string; labelRu: string; labelTt?: string; alcohol: boolean }[]>(data.drinksList);

	function addDrink() {
		if (drinksList.length >= 20) return;
		const id = `drink-${Date.now()}`;
		drinksList = [...drinksList, { id, labelRu: '', labelTt: '', alcohol: true }];
	}

	function resetDrinksToDefault() {
		drinksList = [
			{ id: 'red-wine', labelRu: 'Красное вино', labelTt: 'Кызыл шәраб', alcohol: true },
			{ id: 'white-wine', labelRu: 'Белое вино', labelTt: 'Ак шәраб', alcohol: true },
			{ id: 'champagne', labelRu: 'Шампанское', labelTt: 'Шампан', alcohol: true },
			{ id: 'vodka', labelRu: 'Водка', labelTt: 'Водка', alcohol: true },
			{ id: 'soft', labelRu: 'Безалкогольные напитки', labelTt: 'Алкогольсез эчемлекләр', alcohol: false },
			{ id: 'none', labelRu: 'Не пью алкоголь', labelTt: 'Алкоголь эчмим', alcohol: false }
		];
	}

	function moveDrink(index: number, direction: number) {
		const targetIndex = index + direction;
		if (targetIndex < 0 || targetIndex >= drinksList.length) return;
		const copy = [...drinksList];
		const temp = copy[index];
		copy[index] = copy[targetIndex];
		copy[targetIndex] = temp;
		drinksList = copy;
	}

	// После успешной загрузки/удаления фото обновляем превью и флаг.
	let photoTs = $state(Date.now());
	$effect(() => {
		if (form?.photoSuccess || form?.photoRemoved) {
			photoTs = Date.now();
		}
	});

	function onSave() {
		saving = true;
		savedSuccess = false;
		return async ({ update }: any) => {
			await update();
			saving = false;
			savedSuccess = true;
			setTimeout(() => {
				savedSuccess = false;
			}, 3000);
		};
	}

	function onPhotoUpload() {
		uploading = true;
		return async ({ update }: any) => {
			await update();
			uploading = false;
		};
	}

	function addChapter() {
		if (chapters.length >= 8) return;
		chapters = [...chapters, { title: '', text: '' }];
	}

	function addFaq() {
		if (faqItems.length >= 12) return;
		faqItems = [...faqItems, { q: '', a: '' }];
	}

	function addCourse() {
		if (courses.length >= 8) return;
		courses = [...courses, { label: '', title: '', text: '' }];
	}
</script>

<div class="content-admin">
	<header class="content-head">
		<div>
			<h1 class="page-title">Редактирование информации</h1>
			<p class="page-subtitle">Тексты, расписание и фото, которые видят гости на сайте</p>
		</div>
	</header>

	{#if savedSuccess}
		<div class="alert-success" role="alert">
			✓ Все изменения успешно сохранены и применены на сайте!
		</div>
	{/if}

	{#if form?.saveError}
		<div class="alert-error" role="alert">
			✕ {form.saveError}
		</div>
	{/if}

	<!-- Section 0: Restaurant photo -->
	<section class="card">
		<h2 class="card__title">📷 Фото ресторана</h2>
		<p class="card__hint">
			Фотография показывается в секции «Детали» поверх тёмной плашки. Горизонтальное фото,
			до 8 МБ (JPG, PNG, WebP).
		</p>

		<div class="photo-block">
			{#if data.photoExists}
				<img
					class="photo-preview"
					src="/media/restaurant?ts={photoTs}"
					alt="Фото ресторана"
				/>
			{:else}
				<div class="photo-empty">Фото пока не загружено</div>
			{/if}

			<div class="photo-actions">
				<form method="POST" action="?/uploadPhoto" enctype="multipart/form-data" use:enhance={onPhotoUpload}>
					<input class="input photo-input" type="file" name="photo" accept="image/*" required />
					<button class="btn" type="submit" disabled={uploading}>
						{uploading ? 'Загружаем...' : 'Загрузить фото'}
					</button>
				</form>

				{#if form?.photoError}
					<p class="photo-error" role="alert">{form.photoError}</p>
				{/if}
				{#if form?.photoSuccess}
					<p class="photo-ok" role="status">Фото загружено — обновите сайт, чтобы увидеть результат.</p>
				{/if}

				{#if data.photoExists}
					<form method="POST" action="?/removePhoto" use:enhance={() => async ({ update }) => update()}>
						<button class="btn btn--outline" type="submit">Удалить фото</button>
					</form>
				{/if}
			</div>
		</div>
	</section>

	<form method="POST" action="?/save" use:enhance={onSave} class="content-form">
		<input type="hidden" name="storyJson" value={JSON.stringify(chapters)} />
		<input type="hidden" name="faqJson" value={JSON.stringify(faqItems)} />
		<input type="hidden" name="menuJson" value={JSON.stringify(courses)} />
		<input type="hidden" name="drinksJson" value={JSON.stringify(drinksList)} />
		<input type="hidden" name="menuBar" value={menuBar} />

		<!-- Section 1: Date & Venue -->
		<section class="card">
			<h2 class="card__title">📅 Дата, время и ресторан</h2>
			<div class="form-grid">
				<div class="field">
					<label class="field-label" for="dateLong">Отображаемая дата</label>
					<input class="input" id="dateLong" name="dateLong" value={data.current.dateLong} required />
				</div>

				<div class="field">
					<label class="field-label" for="city">Город</label>
					<input class="input" id="city" name="city" value={data.current.city} required />
				</div>

				<div class="field">
					<label class="field-label" for="venue">Название площадки</label>
					<input class="input" id="venue" name="venue" value={data.current.venue} required />
				</div>

				<div class="field">
					<label class="field-label" for="address">Точный адрес</label>
					<input class="input" id="address" name="address" value={data.current.address} required />
				</div>

				<div class="field full-width">
					<label class="field-label" for="mapUrl">Ссылка на Яндекс.Карты</label>
					<input class="input" id="mapUrl" name="mapUrl" value={data.current.mapUrl} />
				</div>

				<div class="field">
					<label class="field-label" for="gatheringTime">Сбор гостей</label>
					<input
						class="input"
						id="gatheringTime"
						name="gatheringTime"
						value={data.current.gatheringTime}
						placeholder="Пусто (скрыть сбор гостей)"
					/>
					<p class="form-hint" style="margin-top: 4px;">Оставьте пустым, чтобы убрать сбор гостей из расписания</p>
				</div>

				<div class="field">
					<label class="field-label" for="ceremonyTime">Церемония</label>
					<input class="input" id="ceremonyTime" name="ceremonyTime" value={data.current.ceremonyTime} />
				</div>

				<div class="field">
					<label class="field-label" for="dinnerTime">Банкет / Ужин</label>
					<input class="input" id="dinnerTime" name="dinnerTime" value={data.current.dinnerTime} />
				</div>

				<div class="field">
					<label class="field-label" for="endTime">Завершение вечера</label>
					<input class="input" id="endTime" name="endTime" value={data.current.endTime} />
				</div>
			</div>
		</section>

		<!-- Section 2: Invitation Message -->
		<section class="card">
			<h2 class="card__title">💌 Слова приглашения от пары</h2>
			<div class="field" style="margin-bottom: 16px;">
				<label class="field-label" for="invitationTitle">Заголовок обращения</label>
				<input class="input" id="invitationTitle" name="invitationTitle" value={data.current.invitationTitle} />
			</div>

			<div class="field" style="margin-bottom: 16px;">
				<label class="field-label" for="invitationText">Текст приглашения (абзацы разделяйте пустой строкой)</label>
				<textarea class="textarea" id="invitationText" name="invitationText" rows="4">{data.current.invitationText}</textarea>
			</div>

			<div class="field">
				<label class="field-label" for="invitationSignature">Подпись</label>
				<input class="input" id="invitationSignature" name="invitationSignature" value={data.current.invitationSignature} />
			</div>
		</section>

		<!-- Section 3: Story -->
		<section class="card">
			<h2 class="card__title">📖 Наша история</h2>
			<p class="card__hint">
				Главы появятся на сайте в разделе «Как всё началось». Пока здесь пусто — секция
				полностью скрыта. Номера глав (I, II, III…) проставляются автоматически.
			</p>

			{#each chapters as chapter, i}
				<div class="list-row">
					<div class="list-row__head">
						<span class="list-row__num">Глава {i + 1}</span>
						<button
							class="list-row__remove"
							type="button"
						 onclick={() => (chapters = chapters.filter((_, j) => j !== i))}
							aria-label="Удалить главу {i + 1}"
						>✕</button>
					</div>
					<div class="field" style="margin-bottom: 10px;">
						<label class="field-label" for="chapter-title-{i}">Название главы</label>
						<input class="input" id="chapter-title-{i}" bind:value={chapter.title} placeholder="Например: Первая встреча" maxlength="80" />
					</div>
					<div class="field">
						<label class="field-label" for="chapter-text-{i}">Рассказ</label>
						<textarea class="textarea" id="chapter-text-{i}" bind:value={chapter.text} rows="3" placeholder="Пара тёплых строк об этом моменте" maxlength="700"></textarea>
					</div>
				</div>
			{/each}

			<button class="btn btn--outline" type="button" onclick={addChapter} disabled={chapters.length >= 8}>
				+ Добавить главу
			</button>
		</section>

		<!-- Section 4: Dress Code -->
		<section class="card">
			<h2 class="card__title">👗 Дресс-код</h2>
			<div class="field" style="margin-bottom: 16px;">
				<label class="field-label" for="dressCodeTitle">Заголовок</label>
				<input class="input" id="dressCodeTitle" name="dressCodeTitle" value={data.current.dressCodeTitle} />
			</div>

			<div class="field" style="margin-bottom: 16px;">
				<label class="field-label" for="dressCodeText">Описание для гостей</label>
				<textarea class="textarea" id="dressCodeText" name="dressCodeText" rows="3">{data.current.dressCodeText}</textarea>
			</div>

			<div class="field">
				<label class="field-label" for="dressCodeNote">Важные примечания (необязательно)</label>
				<input class="input" id="dressCodeNote" name="dressCodeNote" value={data.current.dressCodeNote} />
			</div>
		</section>

		<!-- Section 5: Menu -->
		<section class="card">
			<h2 class="card__title">🍽 Меню</h2>
			<p class="card__hint">Блюда показываются в секции «Вкусы вечера».</p>

			{#each courses as course, i}
				<div class="list-row">
					<div class="list-row__head">
						<span class="list-row__num">Курс {i + 1}</span>
						<button
							class="list-row__remove"
							type="button"
							onclick={() => (courses = courses.filter((_, j) => j !== i))}
							aria-label="Удалить курс {i + 1}"
						>✕</button>
					</div>
					<div class="form-grid" style="margin-bottom: 10px;">
						<div class="field">
							<label class="field-label" for="course-label-{i}">Подпись</label>
							<input class="input" id="course-label-{i}" bind:value={course.label} placeholder="Например: Приветствие" maxlength="40" />
						</div>
						<div class="field">
							<label class="field-label" for="course-title-{i}">Название</label>
							<input class="input" id="course-title-{i}" bind:value={course.title} placeholder="Например: Свадебный торт" maxlength="80" />
						</div>
					</div>
					<div class="field">
						<label class="field-label" for="course-text-{i}">Описание</label>
						<textarea class="textarea" id="course-text-{i}" bind:value={course.text} rows="2" maxlength="400"></textarea>
					</div>
				</div>
			{/each}

			<button class="btn btn--outline" type="button" onclick={addCourse} disabled={courses.length >= 8}>
				+ Добавить курс
			</button>

			<div class="field" style="margin-top: 18px;">
				<label class="field-label" for="menuBar">Строка про бар / напитки</label>
				<textarea class="textarea" id="menuBar" bind:value={menuBar} rows="2" maxlength="400"></textarea>
			</div>
		</section>

		<!-- Section 6: FAQ -->
		<section class="card">
			<h2 class="card__title">❓ Вопросы и ответы</h2>
			<p class="card__hint">Блок «Всё, что важно знать» внизу страницы.</p>

			{#each faqItems as item, i}
				<div class="list-row">
					<div class="list-row__head">
						<span class="list-row__num">Вопрос {i + 1}</span>
						<button
							class="list-row__remove"
							type="button"
							onclick={() => (faqItems = faqItems.filter((_, j) => j !== i))}
							aria-label="Удалить вопрос {i + 1}"
						>✕</button>
					</div>
					<div class="field" style="margin-bottom: 10px;">
						<label class="field-label" for="faq-q-{i}">Вопрос</label>
						<input class="input" id="faq-q-{i}" bind:value={item.q} maxlength="160" />
					</div>
					<div class="field">
						<label class="field-label" for="faq-a-{i}">Ответ</label>
						<textarea class="textarea" id="faq-a-{i}" bind:value={item.a} rows="2" maxlength="600"></textarea>
					</div>
				</div>
			{/each}

			<button class="btn btn--outline" type="button" onclick={addFaq} disabled={faqItems.length >= 12}>
				+ Добавить вопрос
			</button>
		</section>

		<!-- Section 7: RSVP Drink Preferences -->
		<section class="card">
			<div class="card__head" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 12px;">
				<div>
					<h2 class="card__title" style="margin: 0; padding: 0; border: 0;">🍷 Напитки для гостей (RSVP)</h2>
					<p class="card__hint" style="margin: 4px 0 0;">
						Настройте список напитков, которые гости выбирают при подтверждении участия. Коньяк и виски убраны по умолчанию.
					</p>
				</div>
				<div style="display: flex; gap: 8px;">
					<button class="btn btn--outline" type="button" onclick={resetDrinksToDefault}>
						Сбросить к исходным
					</button>
					<button class="btn btn--outline" type="button" onclick={addDrink} disabled={drinksList.length >= 20}>
						+ Добавить напиток
					</button>
				</div>
			</div>

			<div style="margin-top: 16px;">
				{#each drinksList as item, i}
					<div class="list-row">
						<div class="list-row__head">
							<span class="list-row__num">Напиток #{i + 1} {item.alcohol ? '· 🍷 Алкогольный' : '· 🧃 Безалкогольный'}</span>
							<div style="display: flex; gap: 6px; align-items: center;">
								{#if i > 0}
									<button class="list-row__remove" type="button" title="Выше" onclick={() => moveDrink(i, -1)}>↑</button>
								{/if}
								{#if i < drinksList.length - 1}
									<button class="list-row__remove" type="button" title="Ниже" onclick={() => moveDrink(i, 1)}>↓</button>
								{/if}
								<button
									class="list-row__remove"
									type="button"
									title="Удалить"
									onclick={() => (drinksList = drinksList.filter((_, j) => j !== i))}
								>
									✕ Удалить
								</button>
							</div>
						</div>

						<div class="form-grid">
							<div class="field">
								<label class="field-label" for="drink-ru-{i}">Название на русском *</label>
								<input class="input" id="drink-ru-{i}" bind:value={item.labelRu} placeholder="Например: Красное вино" required />
							</div>
							<div class="field">
								<label class="field-label" for="drink-tt-{i}">Название на татарском (опционально)</label>
								<input class="input" id="drink-tt-{i}" bind:value={item.labelTt} placeholder="Кызыл шәраб" />
							</div>
							<div class="field full-width">
								<label style="display: inline-flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px;">
									<input type="checkbox" bind:checked={item.alcohol} />
									<span><strong>Алкогольный напиток</strong> (при выборе гостем снимает отметку «Не пью алкоголь», и наоборот)</span>
								</label>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<!-- Bottom Save Button Bar -->
		<div class="save-bar">
			<button class="btn" type="submit" disabled={saving}>
				{saving ? 'Сохраняем...' : 'Сохранить все изменения'}
			</button>
		</div>
	</form>
</div>

<style>
	.content-admin {
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

	.alert-success {
		background: #def7ec;
		border: 1px solid #31c48d;
		color: #03543f;
		padding: 14px 18px;
		border-radius: 8px;
		font-size: 0.95rem;
		font-weight: 500;
	}

	.alert-error {
		background: #fff5f5;
		border: 1px solid #f8b4b4;
		color: #c53030;
		padding: 14px 18px;
		border-radius: 8px;
		font-size: 0.95rem;
		font-weight: 500;
	}

	.card__hint {
		margin: -8px 0 16px;
		font-size: 0.85rem;
		line-height: 1.6;
		color: var(--ink-muted);
	}

	.content-form {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.card {
		background: var(--paper);
		border: 1px solid var(--border);
		border-radius: var(--radius-md, 10px);
		padding: 24px;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
	}

	.card__title {
		font-family: var(--font-display);
		font-size: 1.3rem;
		margin: 0 0 18px 0;
		color: var(--ink);
		padding-bottom: 12px;
		border-bottom: 1px solid var(--border);
	}

	.form-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}

	@media (max-width: 680px) {
		.form-grid {
			grid-template-columns: 1fr;
		}
	}

	.full-width {
		grid-column: 1 / -1;
	}

	/* Фото */
	.photo-block {
		display: flex;
		gap: 22px;
		align-items: flex-start;
		flex-wrap: wrap;
	}

	.photo-preview {
		width: min(100%, 340px);
		aspect-ratio: 3 / 2;
		object-fit: cover;
		border: 1px solid var(--border);
		border-radius: 8px;
	}

	.photo-empty {
		width: min(100%, 340px);
		aspect-ratio: 3 / 2;
		display: grid;
		place-items: center;
		border: 1px dashed var(--border);
		border-radius: 8px;
		color: var(--ink-muted);
		font-size: 0.9rem;
	}

	.photo-actions {
		display: flex;
		flex-direction: column;
		gap: 12px;
		flex: 1;
		min-width: 240px;
	}

	.photo-actions form {
		display: flex;
		gap: 12px;
		align-items: center;
		flex-wrap: wrap;
	}

	.photo-input {
		max-width: 260px;
	}

	.photo-error {
		margin: 0;
		color: #c53030;
		font-size: 0.85rem;
		font-weight: 500;
	}

	.photo-ok {
		margin: 0;
		color: #03543f;
		font-size: 0.85rem;
		font-weight: 500;
	}

	/* Списки (главы, вопросы, курсы) */
	.list-row {
		padding: 16px;
		border: 1px solid var(--border);
		border-radius: 8px;
		margin-bottom: 14px;
		background: rgba(0, 0, 0, 0.012);
	}

	.list-row__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 12px;
	}

	.list-row__num {
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-muted);
	}

	.list-row__remove {
		appearance: none;
		background: none;
		border: 0;
		color: var(--ink-muted);
		font-size: 0.9rem;
		cursor: pointer;
		padding: 4px 8px;
		border-radius: 6px;
	}

	.list-row__remove:hover {
		color: #c53030;
		background: #fff5f5;
	}

	.save-bar {
		position: sticky;
		bottom: 20px;
		background: var(--paper);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 16px 24px;
		display: flex;
		justify-content: flex-end;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
		z-index: 40;
	}
</style>
