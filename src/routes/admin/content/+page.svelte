<script lang="ts">
	import { enhance } from '$app/forms';
	import { TIMELINE_ICONS, detectTimelineIcon } from '#lib/timeline';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	let saving = $state(false);
	let savedSuccess = $state(false);
	let uploading = $state(false);

	// Списки редактируются локально и уходят на сервер JSON-ом при сохранении.
	// Начальные значения data берутся один раз — это намеренно.
	/* svelte-ignore state_referenced_locally */
	let chapters = $state<{ title: string; titleTt: string; text: string; textTt: string }[]>(
		data.storyChapters
	);
	/* svelte-ignore state_referenced_locally */
	let faqItems = $state<{ q: string; qTt: string; a: string; aTt: string }[]>(data.faqItems);
	/* svelte-ignore state_referenced_locally */
	let courses = $state<
		{ label: string; labelTt: string; title: string; titleTt: string; text: string; textTt: string }[]
	>(data.menuCourses);
	/* svelte-ignore state_referenced_locally */
	let menuBar = $state(data.menuBar);
	/* svelte-ignore state_referenced_locally */
	let menuBarTt = $state(data.menuBarTt);
	/* svelte-ignore state_referenced_locally */
	let drinksList = $state<{ id: string; labelRu: string; labelTt?: string; alcohol: boolean }[]>(data.drinksList);
	/* svelte-ignore state_referenced_locally */
	let timelineItems = $state<
		{ time: string; title: string; titleTt: string; text: string; textTt: string; icon: string }[]
	>(data.timelineItems);

	function addTimelineItem() {
		if (timelineItems.length >= 14) return;
		timelineItems = [
			...timelineItems,
			{ time: '12:00', title: '', titleTt: '', text: '', textTt: '', icon: 'auto' }
		];
	}

	function resetTimelineToDefault() {
		timelineItems = [
			{
				time: '14:20',
				title: 'Церемония регистрации',
				titleTt: 'Тантаналы теркәү',
				text: 'Самый волнительный момент вечера.',
				textTt: 'Кичнең иң дулкынландыргыч мизгеле.',
				icon: 'ceremony'
			},
			{
				time: '18:00',
				title: 'Начало банкета',
				titleTt: 'Банкет башлануы',
				text: 'Время за большим столом, тёплых слов и тостов.',
				textTt: 'Зур өстәл артында җылы сүзләр һәм тостлар вакыты.',
				icon: 'banquet'
			},
			{
				time: '00:00',
				title: 'Завершение вечера',
				titleTt: 'Кич тәмамлануы',
				text: 'Спасибо, что разделили с нами этот день.',
				textTt: 'Бу көнне безнең белән бүлешкәнегез өчен рәхмәт.',
				icon: 'night'
			}
		];
	}

	function moveTimelineItem(index: number, direction: number) {
		const targetIndex = index + direction;
		if (targetIndex < 0 || targetIndex >= timelineItems.length) return;
		const copy = [...timelineItems];
		const temp = copy[index];
		copy[index] = copy[targetIndex];
		copy[targetIndex] = temp;
		timelineItems = copy;
	}

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
	let couplePhotoTs = $state(Date.now());
	$effect(() => {
		if (form?.photoSuccess || form?.photoRemoved) {
			photoTs = Date.now();
			couplePhotoTs = Date.now();
		}
	});

	function onSave() {
		saving = true;
		savedSuccess = false;
		return async ({ update }: any) => {
			// reset:false — критично: нативный form.reset() после сохранения
			// стирал все bind:value поля (таймлайн, главы, FAQ) до пустоты,
			// и повторное сохранение записывало пустоту в базу.
			await update({ reset: false });
			saving = false;
			savedSuccess = true;
			setTimeout(() => {
				savedSuccess = false;
			}, 3000);
		};
	}

	// Сжатие фото в браузере: длинная сторона ≤1600px, JPEG q=0.85.
	// Гости и мобильный интернет скажут спасибо — вместо 5 МБ уедет ~300 КБ.
	const PHOTO_MAX_SIDE = 1600;

	async function compressImage(file: File): Promise<File> {
		// GIF не переживает перекодирование, маленькие файлы не трогаем.
		if (file.type === 'image/gif' || file.size < 400_000) return file;
		try {
			const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
			const scale = Math.min(1, PHOTO_MAX_SIDE / Math.max(bitmap.width, bitmap.height));
			if (scale === 1 && file.size < 900_000) return file;

			const w = Math.max(1, Math.round(bitmap.width * scale));
			const h = Math.max(1, Math.round(bitmap.height * scale));
			const canvas = document.createElement('canvas');
			canvas.width = w;
			canvas.height = h;
			const ctx = canvas.getContext('2d');
			if (!ctx) return file;
			ctx.fillStyle = '#ffffff'; // PNG с прозрачностью → белый фон под фото
			ctx.fillRect(0, 0, w, h);
			ctx.drawImage(bitmap, 0, 0, w, h);

			const blob = await new Promise<Blob | null>((resolve) =>
				canvas.toBlob(resolve, 'image/jpeg', 0.85)
			);
			if (!blob || blob.size >= file.size) return file; // сжатие не помогло — отдаём оригинал

			return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' });
		} catch {
			return file; // что-то пошло не так — отправляем оригинал
		}
	}

	let compressingRestaurant = $state(false);
	let compressingCouple = $state(false);
	let restaurantFile = $state<File | null>(null);
	let coupleFile = $state<File | null>(null);

	async function onPhotoSelect(event: Event, kind: 'restaurant' | 'couple') {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		if (kind === 'restaurant') compressingRestaurant = true;
		else compressingCouple = true;

		const compressed = await compressImage(file);

		if (kind === 'restaurant') {
			restaurantFile = compressed;
			compressingRestaurant = false;
		} else {
			coupleFile = compressed;
			compressingCouple = false;
		}
	}

	function makePhotoEnhance(kind: 'restaurant' | 'couple') {
		return ({ formData }: { formData: FormData }) => {
			const compressed = kind === 'restaurant' ? restaurantFile : coupleFile;
			if (compressed) formData.set('photo', compressed, compressed.name || 'photo.jpg');
			uploading = true;
			return async ({ update }: any) => {
				await update();
				uploading = false;
				// после успешной загрузки сбрасываем подготовленный файл
				if (kind === 'restaurant') restaurantFile = null;
				else coupleFile = null;
			};
		};
	}

	function addChapter() {
		if (chapters.length >= 8) return;
		chapters = [...chapters, { title: '', titleTt: '', text: '', textTt: '' }];
	}

	function addFaq() {
		if (faqItems.length >= 12) return;
		faqItems = [...faqItems, { q: '', qTt: '', a: '', aTt: '' }];
	}

	function addCourse() {
		if (courses.length >= 8) return;
		courses = [
			...courses,
			{ label: '', labelTt: '', title: '', titleTt: '', text: '', textTt: '' }
		];
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
			Фотография показывается в секции «Детали» поверх тёмной плашки. Горизонтальное фото.
			Любой размер — сожмём автоматически при загрузке.
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
				<form
					method="POST"
					action="?/uploadPhoto"
					enctype="multipart/form-data"
					use:enhance={makePhotoEnhance('restaurant')}
				>
					<input
						class="input photo-input"
						type="file"
						name="photo"
						accept="image/jpeg,image/png,image/webp,image/gif"
						required
						onchange={(e) => onPhotoSelect(e, 'restaurant')}
					/>
					<button
						class="btn"
						type="submit"
						disabled={uploading || compressingRestaurant}
					>
						{compressingRestaurant ? 'Сжимаем...' : uploading ? 'Загружаем...' : 'Загрузить фото'}
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

	<!-- Section 0b: Couple photo -->
	<section class="card">
		<h2 class="card__title">💍 Фото молодожёнов</h2>
		<p class="card__hint">
			Главное фото на первом экране — в арочной рамке рядом с именами. Лучше подойдёт
			вертикальный портрет. Любой размер — сожмём автоматически при загрузке.
		</p>

		<div class="photo-block">
			{#if data.couplePhotoExists}
				<div class="photo-preview-wrap">
					<img
						class="photo-preview photo-preview--portrait"
						src="/media/couple?ts={couplePhotoTs}"
						alt="Фото молодожёнов"
					/>
				</div>
			{:else}
				<div class="photo-empty photo-empty--portrait">Фото пока не загружено</div>
			{/if}

			<div class="photo-actions">
				<form
					method="POST"
					action="?/uploadCouplePhoto"
					enctype="multipart/form-data"
					use:enhance={makePhotoEnhance('couple')}
				>
					<input
						class="input photo-input"
						type="file"
						name="photo"
						accept="image/jpeg,image/png,image/webp,image/gif"
						required
						onchange={(e) => onPhotoSelect(e, 'couple')}
					/>
					<button
						class="btn"
						type="submit"
						disabled={uploading || compressingCouple}
					>
						{compressingCouple ? 'Сжимаем...' : uploading ? 'Загружаем...' : 'Загрузить фото'}
					</button>
				</form>

				{#if form?.photoError}
					<p class="photo-error" role="alert">{form.photoError}</p>
				{/if}
				{#if form?.photoSuccess}
					<p class="photo-ok" role="status">Фото загружено — обновите сайт, чтобы увидеть результат.</p>
				{/if}

				{#if data.couplePhotoExists}
					<form method="POST" action="?/removeCouplePhoto" use:enhance={() => async ({ update }) => update()}>
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
		<input type="hidden" name="timelineJson" value={JSON.stringify(timelineItems)} />
		<input type="hidden" name="menuBar" value={menuBar} />
		<input type="hidden" name="menuBarTt" value={menuBarTt} />

		<!-- Section 1: Date & Venue -->
		<section class="card">
			<h2 class="card__title">📅 Дата и место проведения</h2>
			<div class="form-grid">
				<div class="field">
					<label class="field-label" for="dateLong">Отображаемая дата (русский)</label>
					<input class="input" id="dateLong" name="dateLong" value={data.current.dateLong} required />
					<label class="field-label field-label--sub" for="dateLongTt">Татарча</label>
					<input class="input" id="dateLongTt" name="dateLongTt" value={data.current.dateLongTt} />
				</div>

				<div class="field">
					<label class="field-label" for="city">Город (русский)</label>
					<input class="input" id="city" name="city" value={data.current.city} required />
					<label class="field-label field-label--sub" for="cityTt">Татарча</label>
					<input class="input" id="cityTt" name="cityTt" value={data.current.cityTt} />
				</div>

				<div class="field">
					<label class="field-label" for="venue">Название площадки (русский)</label>
					<input class="input" id="venue" name="venue" value={data.current.venue} required />
					<label class="field-label field-label--sub" for="venueTt">Татарча</label>
					<input class="input" id="venueTt" name="venueTt" value={data.current.venueTt} />
				</div>

				<div class="field">
					<label class="field-label" for="address">Точный адрес (русский)</label>
					<input class="input" id="address" name="address" value={data.current.address} required />
					<label class="field-label field-label--sub" for="addressTt">Татарча</label>
					<input class="input" id="addressTt" name="addressTt" value={data.current.addressTt} />
				</div>

				<div class="field full-width">
					<label class="field-label" for="mapUrl">Ссылка на Яндекс.Карты</label>
					<input class="input" id="mapUrl" name="mapUrl" value={data.current.mapUrl} />
				</div>

				<div class="field">
					<label class="field-label" for="detailsDay">Большое число в блоке даты</label>
					<input class="input" id="detailsDay" name="detailsDay" value={data.current.detailsDay} required />
				</div>

				<div class="field">
					<label class="field-label" for="detailsYear">Год в блоке даты</label>
					<input class="input" id="detailsYear" name="detailsYear" value={data.current.detailsYear} required />
				</div>

				<div class="field">
					<label class="field-label" for="detailsMonth">Месяц (русский)</label>
					<input class="input" id="detailsMonth" name="detailsMonth" value={data.current.detailsMonth} required />
					<label class="field-label field-label--sub" for="detailsMonthTt">Татарча</label>
					<input class="input" id="detailsMonthTt" name="detailsMonthTt" value={data.current.detailsMonthTt} />
				</div>

				<div class="field">
					<label class="field-label" for="detailsWeekday">День недели (русский)</label>
					<input class="input" id="detailsWeekday" name="detailsWeekday" value={data.current.detailsWeekday} required />
					<label class="field-label field-label--sub" for="detailsWeekdayTt">Татарча</label>
					<input class="input" id="detailsWeekdayTt" name="detailsWeekdayTt" value={data.current.detailsWeekdayTt} />
				</div>

				<div class="field full-width">
					<label class="field-label" for="detailsNote">Текст под датой — сбор гостей (русский)</label>
					<input class="input" id="detailsNote" name="detailsNote" value={data.current.detailsNote} required />
					<label class="field-label field-label--sub" for="detailsNoteTt">Татарча</label>
					<input class="input" id="detailsNoteTt" name="detailsNoteTt" value={data.current.detailsNoteTt} />
				</div>
			</div>
		</section>

		<!-- Section: Program / Schedule (Timeline) -->
		<section class="card">
			<div class="card__head" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 12px;">
				<div>
					<h2 class="card__title" style="margin: 0; padding: 0; border: 0;">⏰ Программа свадебного дня (Расписание)</h2>
					<p class="card__hint" style="margin: 4px 0 0;">
						События отображаются на сайте вдоль извилистой линии с сердечком и авторскими скетчами. Вы можете добавлять любые этапы (сбор гостей, трансфер, фотосессию, торт, салют), менять их порядок и выбирать подходящую иконку или положиться на умный автоподбор.
					</p>
				</div>
				<div style="display: flex; gap: 8px;">
					<button class="btn btn--outline" type="button" onclick={resetTimelineToDefault}>
						Сбросить к исходным
					</button>
					<button class="btn btn--outline" type="button" onclick={addTimelineItem} disabled={timelineItems.length >= 14}>
						+ Добавить пункт
					</button>
				</div>
			</div>

			<div style="margin-top: 16px;">
				{#each timelineItems as item, i}
					{@const resolvedIcon = item.icon && item.icon !== 'auto' ? item.icon : detectTimelineIcon(item.title, item.text)}
					{@const iconInfo = TIMELINE_ICONS.find((x) => x.id === resolvedIcon)}
					<div class="list-row">
						<div class="list-row__head">
							<span class="list-row__num">
								Этап #{i + 1} {iconInfo ? `· ${iconInfo.emoji} ${iconInfo.label}` : ''}
							</span>
							<div style="display: flex; gap: 6px; align-items: center;">
								{#if i > 0}
									<button class="list-row__remove" type="button" title="Выше" onclick={() => moveTimelineItem(i, -1)}>↑</button>
								{/if}
								{#if i < timelineItems.length - 1}
									<button class="list-row__remove" type="button" title="Ниже" onclick={() => moveTimelineItem(i, 1)}>↓</button>
								{/if}
								<button
									class="list-row__remove"
									type="button"
									title="Удалить"
									onclick={() => (timelineItems = timelineItems.filter((_, j) => j !== i))}
								>
									✕ Удалить
								</button>
							</div>
						</div>

						<div class="form-grid">
							<div class="field">
								<label class="field-label" for="tl-time-{i}">Время *</label>
								<input class="input" id="tl-time-{i}" bind:value={item.time} placeholder="Например: 14:20 или 13:00-14:00" required />
							</div>
							<div class="field">
								<label class="field-label" for="tl-icon-{i}">Иллюстрация / Скетч</label>
								<select class="input" id="tl-icon-{i}" bind:value={item.icon}>
									{#each TIMELINE_ICONS as opt}
										<option value={opt.id}>
											{opt.emoji} {opt.label}
										</option>
									{/each}
								</select>
							</div>
							<div class="field full-width">
								<label class="field-label" for="tl-title-{i}">Название события (русский) *</label>
								<input class="input" id="tl-title-{i}" bind:value={item.title} placeholder="Например: Церемония регистрации / Трансфер до площадки" required />
								<label class="field-label field-label--sub" for="tl-title-tt-{i}">Татарча</label>
								<input class="input" id="tl-title-tt-{i}" bind:value={item.titleTt} placeholder="Мәсәлән: Тантаналы теркәү" />
							</div>
							<div class="field full-width">
								<label class="field-label" for="tl-text-{i}">Описание события (русский)</label>
								<input class="input" id="tl-text-{i}" bind:value={item.text} placeholder="Например: Самый волнительный момент вечера." />
								<label class="field-label field-label--sub" for="tl-text-tt-{i}">Татарча</label>
								<input class="input" id="tl-text-tt-{i}" bind:value={item.textTt} placeholder="Мәсәлән: Кичнең иң дулкынландыргыч мизгеле." />
							</div>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<!-- Section 2: Invitation Message -->
		<section class="card">
			<h2 class="card__title">💌 Слова приглашения от пары</h2>
			<div class="field" style="margin-bottom: 16px;">
				<label class="field-label" for="invitationTitle">Заголовок обращения (русский)</label>
				<input class="input" id="invitationTitle" name="invitationTitle" value={data.current.invitationTitle} />
				<label class="field-label field-label--sub" for="invitationTitleTt">Татарча</label>
				<input class="input" id="invitationTitleTt" name="invitationTitleTt" value={data.current.invitationTitleTt} />
			</div>

			<div class="field" style="margin-bottom: 16px;">
				<label class="field-label" for="invitationText">Текст приглашения (русский, абзацы разделяйте пустой строкой)</label>
				<textarea class="textarea" id="invitationText" name="invitationText" rows="4">{data.current.invitationText}</textarea>
				<label class="field-label field-label--sub" for="invitationTextTt">Татарча (абзацы — так же, пустой строкой)</label>
				<textarea class="textarea" id="invitationTextTt" name="invitationTextTt" rows="4">{data.current.invitationTextTt}</textarea>
			</div>

			<div class="field">
				<label class="field-label" for="invitationSignature">Подпись (русский)</label>
				<input class="input" id="invitationSignature" name="invitationSignature" value={data.current.invitationSignature} />
				<label class="field-label field-label--sub" for="invitationSignatureTt">Татарча</label>
				<input class="input" id="invitationSignatureTt" name="invitationSignatureTt" value={data.current.invitationSignatureTt} />
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
						<label class="field-label" for="chapter-title-{i}">Название главы (русский)</label>
						<input class="input" id="chapter-title-{i}" bind:value={chapter.title} placeholder="Например: Первая встреча" maxlength="80" />
						<label class="field-label field-label--sub" for="chapter-title-tt-{i}">Татарча</label>
						<input class="input" id="chapter-title-tt-{i}" bind:value={chapter.titleTt} placeholder="Мәсәлән: Беренче очрашу" maxlength="80" />
					</div>
					<div class="field">
						<label class="field-label" for="chapter-text-{i}">Рассказ (русский)</label>
						<textarea class="textarea" id="chapter-text-{i}" bind:value={chapter.text} rows="3" placeholder="Пара тёплых строк об этом моменте" maxlength="700"></textarea>
						<label class="field-label field-label--sub" for="chapter-text-tt-{i}">Татарча</label>
						<textarea class="textarea" id="chapter-text-tt-{i}" bind:value={chapter.textTt} rows="3" placeholder="Бу мизгел турында бер-ике җылы юл" maxlength="700"></textarea>
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
				<label class="field-label" for="dressCodeTitle">Заголовок (русский)</label>
				<input class="input" id="dressCodeTitle" name="dressCodeTitle" value={data.current.dressCodeTitle} />
				<label class="field-label field-label--sub" for="dressCodeTitleTt">Татарча</label>
				<input class="input" id="dressCodeTitleTt" name="dressCodeTitleTt" value={data.current.dressCodeTitleTt} />
			</div>

			<div class="field" style="margin-bottom: 16px;">
				<label class="field-label" for="dressCodeText">Описание для гостей (русский)</label>
				<textarea class="textarea" id="dressCodeText" name="dressCodeText" rows="3">{data.current.dressCodeText}</textarea>
				<label class="field-label field-label--sub" for="dressCodeTextTt">Татарча</label>
				<textarea class="textarea" id="dressCodeTextTt" name="dressCodeTextTt" rows="3">{data.current.dressCodeTextTt}</textarea>
			</div>

			<div class="field">
				<label class="field-label" for="dressCodeNote">Важные примечания (русский, необязательно)</label>
				<input class="input" id="dressCodeNote" name="dressCodeNote" value={data.current.dressCodeNote} />
				<label class="field-label field-label--sub" for="dressCodeNoteTt">Татарча</label>
				<input class="input" id="dressCodeNoteTt" name="dressCodeNoteTt" value={data.current.dressCodeNoteTt} />
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
							<label class="field-label" for="course-label-{i}">Подпись (русский)</label>
							<input class="input" id="course-label-{i}" bind:value={course.label} placeholder="Например: Приветствие" maxlength="40" />
							<label class="field-label field-label--sub" for="course-label-tt-{i}">Татарча</label>
							<input class="input" id="course-label-tt-{i}" bind:value={course.labelTt} placeholder="Мәсәлән: Сәламләү" maxlength="40" />
						</div>
						<div class="field">
							<label class="field-label" for="course-title-{i}">Название (русский)</label>
							<input class="input" id="course-title-{i}" bind:value={course.title} placeholder="Например: Свадебный торт" maxlength="80" />
							<label class="field-label field-label--sub" for="course-title-tt-{i}">Татарча</label>
							<input class="input" id="course-title-tt-{i}" bind:value={course.titleTt} placeholder="Мәсәлән: Туй торты" maxlength="80" />
						</div>
					</div>
					<div class="field">
						<label class="field-label" for="course-text-{i}">Описание (русский)</label>
						<textarea class="textarea" id="course-text-{i}" bind:value={course.text} rows="2" maxlength="400"></textarea>
						<label class="field-label field-label--sub" for="course-text-tt-{i}">Татарча</label>
						<textarea class="textarea" id="course-text-tt-{i}" bind:value={course.textTt} rows="2" maxlength="400"></textarea>
					</div>
				</div>
			{/each}

			<button class="btn btn--outline" type="button" onclick={addCourse} disabled={courses.length >= 8}>
				+ Добавить курс
			</button>

			<div class="field" style="margin-top: 18px;">
				<label class="field-label" for="menuBar">Строка про бар / напитки (русский)</label>
				<textarea class="textarea" id="menuBar" bind:value={menuBar} rows="2" maxlength="400"></textarea>
				<label class="field-label field-label--sub" for="menuBarTt">Татарча</label>
				<textarea class="textarea" id="menuBarTt" bind:value={menuBarTt} rows="2" maxlength="400"></textarea>
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
						<label class="field-label" for="faq-q-{i}">Вопрос (русский)</label>
						<input class="input" id="faq-q-{i}" bind:value={item.q} maxlength="160" />
						<label class="field-label field-label--sub" for="faq-q-tt-{i}">Татарча</label>
						<input class="input" id="faq-q-tt-{i}" bind:value={item.qTt} maxlength="160" />
					</div>
					<div class="field">
						<label class="field-label" for="faq-a-{i}">Ответ (русский)</label>
						<textarea class="textarea" id="faq-a-{i}" bind:value={item.a} rows="2" maxlength="600"></textarea>
						<label class="field-label field-label--sub" for="faq-a-tt-{i}">Татарча</label>
						<textarea class="textarea" id="faq-a-tt-{i}" bind:value={item.aTt} rows="2" maxlength="600"></textarea>
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
		/* Место под фиксированную панель сохранения */
		padding-bottom: 84px;
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

	/* Подпись татарского поля под русским */
	.field-label--sub {
		margin-top: 10px;
		color: var(--ink-muted);
		font-weight: 500;
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

	.photo-preview--portrait {
		width: min(100%, 260px);
		aspect-ratio: 3 / 4;
	}

	.photo-preview-wrap {
		flex: 0 0 auto;
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

	.photo-empty--portrait {
		width: min(100%, 260px);
		aspect-ratio: 3 / 4;
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
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		background: var(--paper);
		border-top: 1px solid var(--border);
		padding: 12px 24px;
		padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
		display: flex;
		justify-content: flex-end;
		box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.08);
		z-index: 60;
	}

	@media (max-width: 680px) {
		.content-admin {
			gap: 16px;
		}

		.page-title {
			font-size: 1.5rem;
		}

		.page-subtitle {
			font-size: 0.82rem;
		}

		.card {
			padding: 14px 12px;
			border-radius: 8px;
		}

		.card__title {
			font-size: 1.15rem;
			margin-bottom: 12px;
		}

		.card__hint {
			font-size: 0.8rem;
			margin-bottom: 12px;
		}

		.list-row {
			padding: 12px 10px;
			margin-bottom: 10px;
		}

		.list-row__head {
			flex-wrap: wrap;
			gap: 8px;
		}

		.list-row__num {
			font-size: 0.74rem;
		}

		.photo-block {
			gap: 14px;
		}

		/* Превью всегда влезает в экран: по ширине и по высоте */
		.photo-preview,
		.photo-empty,
		.photo-preview-wrap {
			width: auto;
			max-width: 100%;
		}

		.photo-preview,
		.photo-empty {
			width: 100%;
			max-height: 48svh;
			object-fit: cover;
		}

		.photo-preview--portrait,
		.photo-empty--portrait {
			width: min(100%, 260px);
			max-height: 55svh;
			margin-inline: auto;
		}

		.photo-actions form {
			flex-direction: column;
			align-items: stretch;
		}

		.photo-input {
			max-width: 100%;
		}

		.save-bar {
			bottom: 10px;
			padding: 10px 14px;
			border-radius: 10px;
		}

		.save-bar .btn {
			width: 100%;
			min-height: 44px;
			font-size: 0.95rem;
			justify-content: center;
		}
	}
</style>
