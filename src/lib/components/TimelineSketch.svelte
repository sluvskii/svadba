<script lang="ts">
	import type { TimelineIconVariant } from '#lib/timeline.js';

	type Props = {
		variant?: string;
		class?: string;
	};

	let { variant = 'ceremony', class: className = '' }: Props = $props();

	// Нормализация варианта к поддерживаемым значениям
	const resolvedVariant = $derived.by(() => {
		const v = (variant || '').toLowerCase().trim();
		if (['ceremony', 'banquet', 'night', 'gathering', 'transfer', 'photo', 'dance', 'cake', 'sparklers', 'rings'].includes(v)) {
			return v as TimelineIconVariant;
		}
		return 'rings';
	});
</script>

<div class="sketch-wrapper {className}">
	{#if resolvedVariant === 'ceremony'}
		<!-- 1. ЦЕРЕМОНИЯ: Свадебная арка с драпировкой, эвкалиптом и обручальными кольцами -->
		<svg viewBox="0 0 160 150" fill="none" class="sketch-svg" xmlns="http://www.w3.org/2000/svg">
			<path d="M 24,142 H 136" stroke="#718776" stroke-width="1" stroke-linecap="round" opacity="0.6" />
			<path d="M 32,145 H 128" stroke="#718776" stroke-width="0.7" stroke-linecap="round" opacity="0.35" />

			<path d="M 38,142 V 58 C 38,24 122,24 122,58 V 142" stroke="#4d6756" stroke-width="1.3" stroke-linecap="round" />
			<path d="M 44,142 V 60 C 44,32 116,32 116,60 V 142" stroke="#718776" stroke-width="0.8" opacity="0.45" />

			<rect x="34" y="138" width="8" height="4" rx="0.5" stroke="#4d6756" stroke-width="1" fill="#fcfbf8" />
			<rect x="118" y="138" width="8" height="4" rx="0.5" stroke="#4d6756" stroke-width="1" fill="#fcfbf8" />
			<rect x="34" y="56" width="8" height="3" rx="0.5" stroke="#4d6756" stroke-width="0.9" fill="#fcfbf8" />
			<rect x="118" y="56" width="8" height="3" rx="0.5" stroke="#4d6756" stroke-width="0.9" fill="#fcfbf8" />

			<path d="M 38,58 Q 80,78 122,58" stroke="#688373" stroke-width="1.1" stroke-linecap="round" />
			<path d="M 40,65 Q 80,85 120,65" stroke="#8fa699" stroke-width="0.8" stroke-dasharray="2 3" opacity="0.7" />
			<path d="M 38,58 C 34,75 32,100 34,138" stroke="#688373" stroke-width="0.9" stroke-linecap="round" />
			<path d="M 122,58 C 126,75 128,100 126,138" stroke="#688373" stroke-width="0.9" stroke-linecap="round" />

			<path d="M 28,68 C 32,44 46,26 68,20 C 90,14 114,22 130,46" stroke="#415949" stroke-width="1.4" stroke-linecap="round" />
			<path d="M 34,54 C 27,51 25,43 30,38 C 35,43 36,50 34,54 Z" fill="#607b6a" opacity="0.75" />
			<path d="M 44,40 C 38,36 38,28 44,24 C 49,29 48,37 44,40 Z" fill="#607b6a" opacity="0.75" />
			<path d="M 58,26 C 54,20 56,12 63,11 C 66,18 63,24 58,26 Z" fill="#607b6a" opacity="0.75" />
			<path d="M 76,18 C 74,11 79,5 86,6 C 87,13 82,18 76,18 Z" fill="#607b6a" opacity="0.75" />
			<path d="M 96,18 C 96,11 103,7 108,10 C 107,17 101,20 96,18 Z" fill="#607b6a" opacity="0.75" />
			<path d="M 116,28 C 119,22 126,21 129,26 C 126,32 120,32 116,28 Z" fill="#607b6a" opacity="0.75" />
			<path d="M 126,44 C 132,40 137,44 135,50 C 129,52 126,47 126,44 Z" fill="#607b6a" opacity="0.75" />

			<circle cx="50" cy="30" r="3.2" fill="#bfa15f" opacity="0.85" />
			<circle cx="50" cy="30" r="1.8" fill="#ffffff" opacity="0.6" />
			<circle cx="88" cy="18" r="3.5" fill="#bfa15f" opacity="0.85" />
			<circle cx="88" cy="18" r="2" fill="#ffffff" opacity="0.6" />
			<circle cx="120" cy="36" r="3" fill="#bfa15f" opacity="0.85" />
			<circle cx="120" cy="36" r="1.6" fill="#ffffff" opacity="0.6" />
			<circle cx="34" cy="62" r="2.5" fill="#bfa15f" opacity="0.75" />

			<path d="M 72,142 H 88" stroke="#4d6756" stroke-width="1.2" stroke-linecap="round" />
			<path d="M 78,142 V 104 H 82 V 142" stroke="#718776" stroke-width="0.9" fill="#fcfbf8" />
			<ellipse cx="80" cy="104" rx="14" ry="3.5" stroke="#4d6756" stroke-width="1.1" fill="#ffffff" />

			<circle cx="77" cy="94" r="5.5" stroke="#bfa15f" stroke-width="1.3" fill="none" />
			<circle cx="83" cy="94" r="5.5" stroke="#bfa15f" stroke-width="1.3" fill="none" />
			<path d="M 77,85 V 91 M 74,88 H 80" stroke="#bfa15f" stroke-width="1" stroke-linecap="round" />
			<circle cx="77" cy="88" r="1" fill="#ffffff" />
		</svg>
	{:else if resolvedVariant === 'banquet'}
		<!-- 2. БАНКЕТ: Свадебный торт, звон хрустальных бокалов и золотые искры -->
		<svg viewBox="0 0 160 150" fill="none" class="sketch-svg" xmlns="http://www.w3.org/2000/svg">
			<path d="M 20,142 H 140" stroke="#718776" stroke-width="1" stroke-linecap="round" opacity="0.6" />

			<path d="M 34,142 H 58" stroke="#4d6756" stroke-width="1.2" stroke-linecap="round" />
			<path d="M 44,142 V 132 H 48 V 142" stroke="#718776" stroke-width="0.9" fill="#fcfbf8" />
			<ellipse cx="46" cy="132" rx="20" ry="3.5" stroke="#4d6756" stroke-width="1.1" fill="#ffffff" />

			<rect x="30" y="110" width="32" height="20" rx="1.5" stroke="#4d6756" stroke-width="1.2" fill="#ffffff" />
			<path d="M 30,122 H 62" stroke="#8fa699" stroke-width="0.7" stroke-dasharray="2 2" />
			<rect x="35" y="92" width="22" height="18" rx="1.5" stroke="#4d6756" stroke-width="1.2" fill="#ffffff" />
			<path d="M 35,102 H 57" stroke="#8fa699" stroke-width="0.7" stroke-dasharray="2 2" />
			<rect x="40" y="78" width="12" height="14" rx="1" stroke="#4d6756" stroke-width="1.2" fill="#ffffff" />

			<path d="M 34,128 Q 44,116 38,104 Q 46,96 42,86" stroke="#415949" stroke-width="1.1" stroke-linecap="round" />
			<circle cx="35" cy="126" r="2.2" fill="#bfa15f" />
			<circle cx="44" cy="112" r="2.2" fill="#bfa15f" />
			<circle cx="39" cy="98" r="2" fill="#bfa15f" />
			<circle cx="46" cy="76" r="2.5" fill="#bfa15f" />
			<path d="M 46,74 C 44,71 42,72 42,74 C 42,76 46,78 46,78 C 46,78 50,76 50,74 C 50,72 48,71 46,74 Z" fill="#bfa15f" />

			<g transform="translate(94, 60) rotate(10)">
				<path d="M -6,-28 C -6,-6 0,0 0,0 C 0,0 6,-6 6,-28 Z" stroke="#415949" stroke-width="1.2" fill="#ffffff" />
				<path d="M -5,-16 Q 0,-14 5,-16" stroke="#bfa15f" stroke-width="0.9" opacity="0.85" />
				<path d="M 0,0 V 38" stroke="#415949" stroke-width="1.1" />
				<ellipse cx="0" cy="38" rx="9" ry="2.5" stroke="#415949" stroke-width="1" fill="#fcfbf8" />
			</g>

			<g transform="translate(122, 60) rotate(-10)">
				<path d="M -6,-28 C -6,-6 0,0 0,0 C 0,0 6,-6 6,-28 Z" stroke="#415949" stroke-width="1.2" fill="#ffffff" />
				<path d="M -5,-16 Q 0,-14 5,-16" stroke="#bfa15f" stroke-width="0.9" opacity="0.85" />
				<path d="M 0,0 V 38" stroke="#415949" stroke-width="1.1" />
				<ellipse cx="0" cy="38" rx="9" ry="2.5" stroke="#415949" stroke-width="1" fill="#fcfbf8" />
			</g>

			<path d="M 108,24 V 16 M 104,20 H 112" stroke="#bfa15f" stroke-width="1.2" stroke-linecap="round" />
			<path d="M 102,14 L 105,17 M 114,14 L 111,17" stroke="#bfa15f" stroke-width="1" stroke-linecap="round" />
			<circle cx="108" cy="20" r="1.5" fill="#ffffff" stroke="#bfa15f" stroke-width="0.8" />

			<circle cx="106" cy="32" r="1.4" fill="#bfa15f" opacity="0.85" />
			<circle cx="112" cy="28" r="1.2" fill="#bfa15f" opacity="0.75" />
			<circle cx="100" cy="38" r="1.6" fill="#bfa15f" opacity="0.65" />
			<circle cx="116" cy="36" r="1.3" fill="#bfa15f" opacity="0.8" />
			<circle cx="108" cy="44" r="1.5" fill="#bfa15f" opacity="0.7" />

			<path d="M 80,140 C 95,136 115,138 135,132" stroke="#415949" stroke-width="1.1" stroke-linecap="round" />
			<path d="M 94,137 C 90,132 94,126 100,128 C 100,134 96,137 94,137 Z" fill="#607b6a" opacity="0.7" />
			<path d="M 112,136 C 110,129 116,124 122,126 C 121,133 115,136 112,136 Z" fill="#607b6a" opacity="0.7" />
			<circle cx="128" cy="132" r="2" fill="#bfa15f" opacity="0.85" />
		</svg>
	{:else if resolvedVariant === 'night'}
		<!-- 3. ФИНАЛ: Старинный фонарь со свечой, бенгальские огни, полумесяц и звёзды -->
		<svg viewBox="0 0 160 150" fill="none" class="sketch-svg" xmlns="http://www.w3.org/2000/svg">
			<path d="M 24,142 H 136" stroke="#718776" stroke-width="1" stroke-linecap="round" opacity="0.6" />

			<rect x="66" y="136" width="28" height="6" rx="1" stroke="#4d6756" stroke-width="1.2" fill="#fcfbf8" />
			<path d="M 69,136 L 73,86 H 87 L 91,136 Z" stroke="#4d6756" stroke-width="1.2" fill="#ffffff" />
			<path d="M 80,86 V 136" stroke="#718776" stroke-width="0.8" opacity="0.6" />
			<path d="M 71,86 L 80,72 L 89,86 Z" stroke="#4d6756" stroke-width="1.2" fill="#fcfbf8" />
			<circle cx="80" cy="68" r="4" stroke="#4d6756" stroke-width="1.1" fill="none" />

			<rect x="76" y="108" width="8" height="24" rx="1" stroke="#718776" stroke-width="0.9" fill="#fcfbf8" />
			<path d="M 80,108 V 104" stroke="#415949" stroke-width="1" />
			<path d="M 80,104 C 78,101 78,97 80,94 C 82,97 82,101 80,104 Z" fill="#bfa15f" />
			<circle cx="80" cy="99" r="8" stroke="#bfa15f" stroke-width="0.6" stroke-dasharray="1 2" opacity="0.6" />

			<path d="M 38,138 L 48,94" stroke="#4d6756" stroke-width="1.2" stroke-linecap="round" />
			<path d="M 48,84 V 74 M 48,104 V 114 M 38,94 H 28 M 58,94 H 68" stroke="#bfa15f" stroke-width="1.1" stroke-linecap="round" />
			<path d="M 41,87 L 34,80 M 55,101 L 62,108 M 41,101 L 34,108 M 55,87 L 62,80" stroke="#bfa15f" stroke-width="0.9" stroke-linecap="round" />
			<circle cx="48" cy="94" r="2.5" fill="#ffffff" stroke="#bfa15f" stroke-width="1" />

			<path d="M 122,138 L 112,94" stroke="#4d6756" stroke-width="1.2" stroke-linecap="round" />
			<path d="M 112,84 V 74 M 112,104 V 114 M 102,94 H 92 M 122,94 H 132" stroke="#bfa15f" stroke-width="1.1" stroke-linecap="round" />
			<path d="M 105,87 L 98,80 M 119,101 L 126,108 M 105,101 L 98,108 M 119,87 L 126,80" stroke="#bfa15f" stroke-width="0.9" stroke-linecap="round" />
			<circle cx="112" cy="94" r="2.5" fill="#ffffff" stroke="#bfa15f" stroke-width="1" />

			<path d="M 124,20 C 117,23 114,31 116,38 C 118,44 124,49 131,48 C 122,48 116,38 120,28 C 122,24 124,20 124,20 Z" fill="#bfa15f" opacity="0.9" />

			<g transform="translate(42, 28)">
				<path d="M 0,-6 V 6 M -6,0 H 6" stroke="#bfa15f" stroke-width="1" stroke-linecap="round" />
				<circle cx="0" cy="0" r="1.2" fill="#ffffff" />
			</g>
			<g transform="translate(78, 22)">
				<path d="M 0,-8 V 8 M -8,0 H 8" stroke="#bfa15f" stroke-width="1.1" stroke-linecap="round" />
				<circle cx="0" cy="0" r="1.5" fill="#ffffff" />
			</g>
			<g transform="translate(98, 42)">
				<path d="M 0,-5 V 5 M -5,0 H 5" stroke="#bfa15f" stroke-width="0.9" stroke-linecap="round" />
				<circle cx="0" cy="0" r="1" fill="#ffffff" />
			</g>

			<path d="M 30,140 C 44,135 56,139 66,141" stroke="#415949" stroke-width="1" stroke-linecap="round" />
			<path d="M 94,141 C 104,139 116,135 130,140" stroke="#415949" stroke-width="1" stroke-linecap="round" />
			<circle cx="36" cy="136" r="1.6" fill="#bfa15f" />
			<circle cx="124" cy="136" r="1.6" fill="#bfa15f" />
		</svg>
	{:else if resolvedVariant === 'gathering'}
		<!-- 4. СБОР ГОСТЕЙ: Приветственный мольберт с венком и бокал аперитива -->
		<svg viewBox="0 0 160 150" fill="none" class="sketch-svg" xmlns="http://www.w3.org/2000/svg">
			<path d="M 24,142 H 136" stroke="#718776" stroke-width="1" stroke-linecap="round" opacity="0.6" />

			<!-- Деревянный мольберт -->
			<path d="M 52,142 L 72,40 L 92,142" stroke="#4d6756" stroke-width="1.2" stroke-linecap="round" />
			<path d="M 72,40 V 142" stroke="#718776" stroke-width="1" opacity="0.6" />
			<path d="M 46,108 H 98" stroke="#4d6756" stroke-width="1.2" stroke-linecap="round" />

			<!-- Приветственная доска Welcome -->
			<rect x="50" y="60" width="44" height="46" rx="2" stroke="#4d6756" stroke-width="1.2" fill="#ffffff" />
			<rect x="53" y="63" width="38" height="40" rx="1" stroke="#8fa699" stroke-width="0.7" stroke-dasharray="2 2" fill="none" />
			<!-- Надпись Welcome (изящная волна) -->
			<path d="M 58,78 Q 72,74 86,78" stroke="#bfa15f" stroke-width="1.2" stroke-linecap="round" />
			<circle cx="72" cy="88" r="1.5" fill="#bfa15f" />

			<!-- Цветочный венок в углу мольберта -->
			<path d="M 44,68 C 42,54 54,48 64,54" stroke="#415949" stroke-width="1.3" stroke-linecap="round" />
			<circle cx="48" cy="58" r="2.8" fill="#bfa15f" />
			<circle cx="58" cy="52" r="2.4" fill="#bfa15f" />
			<path d="M 44,52 C 40,48 42,42 48,46 C 46,52 44,52 44,52 Z" fill="#607b6a" opacity="0.75" />

			<!-- Справа: Бокал аперитива с оливкой и веточкой розмарина -->
			<g transform="translate(118, 92)">
				<path d="M -12,-16 Q 0,4 12,-16 Z" stroke="#415949" stroke-width="1.2" fill="#ffffff" />
				<path d="M 0,3 V 46" stroke="#415949" stroke-width="1.1" />
				<ellipse cx="0" cy="46" rx="9" ry="2.5" stroke="#415949" stroke-width="1" fill="#fcfbf8" />
				<!-- Шпажка с оливкой -->
				<line x1="-8" y1="-24" x2="6" y2="0" stroke="#bfa15f" stroke-width="1.1" stroke-linecap="round" />
				<circle cx="-2" cy="-10" r="2.5" fill="#607b6a" />
				<!-- Искорки -->
				<circle cx="10" cy="-22" r="1.5" fill="#bfa15f" />
				<path d="M 14,-14 V -8 M 11,-11 H 17" stroke="#bfa15f" stroke-width="0.9" />
			</g>
		</svg>
	{:else if resolvedVariant === 'transfer'}
		<!-- 5. ТРАНСФЕР: Свадебный автомобиль с лентами, цветами и сердечком -->
		<svg viewBox="0 0 160 150" fill="none" class="sketch-svg" xmlns="http://www.w3.org/2000/svg">
			<path d="M 16,142 H 144" stroke="#718776" stroke-width="1" stroke-linecap="round" opacity="0.6" />

			<!-- Контур классического свадебного автомобиля -->
			<path d="M 28,124 C 26,110 32,98 44,98 L 62,98 L 78,74 L 114,74 L 126,98 L 138,102 C 142,108 142,120 138,124 Z" stroke="#4d6756" stroke-width="1.3" fill="#ffffff" />
			<!-- Окна -->
			<path d="M 66,96 L 79,78 L 94,78 L 94,96 Z" stroke="#718776" stroke-width="0.9" fill="#fcfbf8" />
			<path d="M 98,96 L 98,78 L 112,78 L 122,96 Z" stroke="#718776" stroke-width="0.9" fill="#fcfbf8" />

			<!-- Колеса -->
			<g transform="translate(48, 126)">
				<circle cx="0" cy="0" r="12" stroke="#4d6756" stroke-width="1.3" fill="#fcfbf8" />
				<circle cx="0" cy="0" r="6" stroke="#bfa15f" stroke-width="1" fill="#ffffff" />
			</g>
			<g transform="translate(118, 126)">
				<circle cx="0" cy="0" r="12" stroke="#4d6756" stroke-width="1.3" fill="#fcfbf8" />
				<circle cx="0" cy="0" r="6" stroke="#bfa15f" stroke-width="1" fill="#ffffff" />
			</g>

			<!-- Цветочная композиция на капоте -->
			<path d="M 124,96 Q 134,92 140,96" stroke="#415949" stroke-width="1.3" stroke-linecap="round" />
			<circle cx="128" cy="94" r="2.5" fill="#bfa15f" />
			<circle cx="134" cy="92" r="2.2" fill="#bfa15f" />

			<!-- Свадебные ленты и сердечки сзади -->
			<path d="M 28,112 Q 18,110 12,118" stroke="#bfa15f" stroke-width="1" stroke-linecap="round" />
			<path d="M 26,118 Q 16,120 8,128" stroke="#bfa15f" stroke-width="1" stroke-linecap="round" />
			<!-- Сердечко сверху автомобиля -->
			<path d="M 96,62 C 93,58 89,60 89,63 C 89,67 96,70 96,70 C 96,70 103,67 103,63 C 103,60 99,58 96,62 Z" fill="#bfa15f" />
			<circle cx="106" cy="54" r="1.5" fill="#bfa15f" opacity="0.8" />
		</svg>
	{:else if resolvedVariant === 'photo'}
		<!-- 6. ФОТОСЕССИЯ: Винтажная камера в ботаническом венке со вспышкой-звездой -->
		<svg viewBox="0 0 160 150" fill="none" class="sketch-svg" xmlns="http://www.w3.org/2000/svg">
			<path d="M 24,142 H 136" stroke="#718776" stroke-width="1" stroke-linecap="round" opacity="0.6" />

			<!-- Корпус фотоаппарата -->
			<rect x="44" y="66" width="72" height="52" rx="4" stroke="#4d6756" stroke-width="1.3" fill="#ffffff" />
			<path d="M 64,66 L 70,54 H 90 L 96,66 Z" stroke="#4d6756" stroke-width="1.2" fill="#fcfbf8" />

			<!-- Объектив с кольцами -->
			<circle cx="80" cy="92" r="20" stroke="#4d6756" stroke-width="1.3" fill="#fcfbf8" />
			<circle cx="80" cy="92" r="14" stroke="#718776" stroke-width="1" fill="#ffffff" />
			<circle cx="80" cy="92" r="7" stroke="#bfa15f" stroke-width="1.1" fill="none" />
			<circle cx="76" cy="88" r="2.2" fill="#bfa15f" opacity="0.8" />

			<!-- Кнопка спуска и видоискатель -->
			<rect x="52" y="58" width="8" height="8" rx="1" stroke="#4d6756" stroke-width="1" fill="#fcfbf8" />
			<rect x="100" y="72" width="10" height="6" rx="1" stroke="#718776" stroke-width="0.9" fill="#fcfbf8" />

			<!-- Вспышка / сияющая звезда -->
			<g transform="translate(80, 36)">
				<path d="M 0,-12 V 12 M -12,0 H 12" stroke="#bfa15f" stroke-width="1.3" stroke-linecap="round" />
				<path d="M -7,-7 L 7,7 M -7,7 L 7,-7" stroke="#bfa15f" stroke-width="1" stroke-linecap="round" opacity="0.7" />
				<circle cx="0" cy="0" r="2" fill="#ffffff" stroke="#bfa15f" stroke-width="0.8" />
			</g>

			<!-- Венок эвкалипта вокруг камеры -->
			<path d="M 36,92 C 34,120 60,138 80,138 C 100,138 126,120 124,92" stroke="#415949" stroke-width="1.2" stroke-linecap="round" />
			<path d="M 32,106 C 26,108 26,116 32,118 C 36,112 36,108 32,106 Z" fill="#607b6a" opacity="0.75" />
			<path d="M 128,106 C 134,108 134,116 128,118 C 124,112 124,108 128,106 Z" fill="#607b6a" opacity="0.75" />
			<circle cx="48" cy="132" r="2.2" fill="#bfa15f" />
			<circle cx="112" cy="132" r="2.2" fill="#bfa15f" />
		</svg>
	{:else if resolvedVariant === 'dance'}
		<!-- 7. ПЕРВЫЙ ТАНЕЦ: Хрустальная люстра, сияющие гирлянды и силуэт вальса -->
		<svg viewBox="0 0 160 150" fill="none" class="sketch-svg" xmlns="http://www.w3.org/2000/svg">
			<path d="M 24,142 H 136" stroke="#718776" stroke-width="1" stroke-linecap="round" opacity="0.6" />

			<!-- Хрустальная люстра сверху -->
			<path d="M 80,18 V 32" stroke="#4d6756" stroke-width="1.2" />
			<path d="M 64,32 Q 80,40 96,32" stroke="#4d6756" stroke-width="1.2" stroke-linecap="round" />
			<path d="M 56,38 Q 80,48 104,38" stroke="#718776" stroke-width="1" opacity="0.7" />
			<!-- Капли хрусталя -->
			<circle cx="80" cy="50" r="2.5" fill="#bfa15f" />
			<circle cx="68" cy="44" r="2" fill="#bfa15f" />
			<circle cx="92" cy="44" r="2" fill="#bfa15f" />

			<!-- Подвесные мерцающие огоньки -->
			<path d="M 28,36 Q 80,60 132,36" stroke="#8fa699" stroke-width="0.8" stroke-dasharray="2 3" />
			<circle cx="46" cy="46" r="1.5" fill="#bfa15f" />
			<circle cx="114" cy="46" r="1.5" fill="#bfa15f" />

			<!-- Танцующая пара силуэтом (элегантный контур) -->
			<!-- Жених -->
			<circle cx="72" cy="80" r="5" stroke="#4d6756" stroke-width="1.1" fill="#fcfbf8" />
			<path d="M 66,92 C 66,86 78,86 78,92 L 76,140 H 68 Z" stroke="#4d6756" stroke-width="1.1" fill="#ffffff" />
			<!-- Невеста -->
			<circle cx="88" cy="82" r="4.5" stroke="#4d6756" stroke-width="1.1" fill="#fcfbf8" />
			<path d="M 82,92 C 82,88 94,88 94,92 L 106,140 H 76 Z" stroke="#4d6756" stroke-width="1.1" fill="#ffffff" />
			<!-- Фата невесты -->
			<path d="M 86,80 C 98,82 104,96 108,122" stroke="#8fa699" stroke-width="0.8" stroke-dasharray="2 2" />

			<!-- Музыкальные искры -->
			<circle cx="56" cy="90" r="1.5" fill="#bfa15f" />
			<circle cx="106" cy="78" r="1.8" fill="#bfa15f" />
		</svg>
	{:else if resolvedVariant === 'cake'}
		<!-- 8. СВАДЕБНЫЙ ТОРТ: Роскошный многоярусный торт со свечами и розами -->
		<svg viewBox="0 0 160 150" fill="none" class="sketch-svg" xmlns="http://www.w3.org/2000/svg">
			<path d="M 20,142 H 140" stroke="#718776" stroke-width="1" stroke-linecap="round" opacity="0.6" />

			<!-- Подставка -->
			<path d="M 52,142 H 108" stroke="#4d6756" stroke-width="1.2" stroke-linecap="round" />
			<path d="M 76,142 V 134 H 84 V 142" stroke="#718776" stroke-width="0.9" fill="#fcfbf8" />
			<ellipse cx="80" cy="134" rx="36" ry="4.5" stroke="#4d6756" stroke-width="1.2" fill="#ffffff" />

			<!-- Нижний ярус -->
			<rect x="52" y="106" width="56" height="28" rx="2" stroke="#4d6756" stroke-width="1.2" fill="#ffffff" />
			<path d="M 52,120 H 108" stroke="#8fa699" stroke-width="0.7" stroke-dasharray="2 2" />

			<!-- Средний ярус -->
			<rect x="62" y="82" width="36" height="24" rx="2" stroke="#4d6756" stroke-width="1.2" fill="#ffffff" />
			<path d="M 62,94 H 98" stroke="#8fa699" stroke-width="0.7" stroke-dasharray="2 2" />

			<!-- Верхний ярус -->
			<rect x="70" y="64" width="20" height="18" rx="1.5" stroke="#4d6756" stroke-width="1.2" fill="#ffffff" />

			<!-- Цветочная гирлянда по спирали -->
			<path d="M 60,130 Q 76,116 68,102 Q 82,90 76,78" stroke="#415949" stroke-width="1.2" stroke-linecap="round" />
			<circle cx="62" cy="128" r="2.8" fill="#bfa15f" />
			<circle cx="76" cy="114" r="2.5" fill="#bfa15f" />
			<circle cx="70" cy="98" r="2.5" fill="#bfa15f" />
			<circle cx="80" cy="80" r="2.8" fill="#bfa15f" />

			<!-- Топпер и праздничные искорки -->
			<path d="M 80,58 C 77,54 74,56 74,58 C 74,60 80,63 80,63 C 80,63 86,60 86,58 C 86,56 83,54 80,58 Z" fill="#bfa15f" />
			<path d="M 80,48 V 40 M 74,44 H 86" stroke="#bfa15f" stroke-width="1" stroke-linecap="round" />
			<circle cx="80" cy="44" r="1.5" fill="#ffffff" />
			<circle cx="66" cy="50" r="1.2" fill="#bfa15f" />
			<circle cx="94" cy="50" r="1.2" fill="#bfa15f" />
		</svg>
	{:else if resolvedVariant === 'sparklers'}
		<!-- 9. БЕНГАЛЬСКИЕ ОГНИ / САЛЮТ: Скрещенные искрящиеся спарклеры -->
		<svg viewBox="0 0 160 150" fill="none" class="sketch-svg" xmlns="http://www.w3.org/2000/svg">
			<path d="M 24,142 H 136" stroke="#718776" stroke-width="1" stroke-linecap="round" opacity="0.6" />

			<!-- Скрещенные палочки -->
			<path d="M 44,136 L 116,44" stroke="#4d6756" stroke-width="1.3" stroke-linecap="round" />
			<path d="M 116,136 L 44,44" stroke="#4d6756" stroke-width="1.3" stroke-linecap="round" />

			<!-- Верхнее сияние левого спарклера -->
			<g transform="translate(44, 44)">
				<path d="M 0,-16 V 16 M -16,0 H 16" stroke="#bfa15f" stroke-width="1.2" stroke-linecap="round" />
				<path d="M -10,-10 L 10,10 M -10,10 L 10,-10" stroke="#bfa15f" stroke-width="1" stroke-linecap="round" opacity="0.8" />
				<circle cx="0" cy="0" r="2.5" fill="#ffffff" stroke="#bfa15f" stroke-width="1" />
			</g>

			<!-- Верхнее сияние правого спарклера -->
			<g transform="translate(116, 44)">
				<path d="M 0,-16 V 16 M -16,0 H 16" stroke="#bfa15f" stroke-width="1.2" stroke-linecap="round" />
				<path d="M -10,-10 L 10,10 M -10,10 L 10,-10" stroke="#bfa15f" stroke-width="1" stroke-linecap="round" opacity="0.8" />
				<circle cx="0" cy="0" r="2.5" fill="#ffffff" stroke="#bfa15f" stroke-width="1" />
			</g>

			<!-- Центральный перекрёстный фейерверк -->
			<g transform="translate(80, 80)">
				<path d="M 0,-12 V 12 M -12,0 H 12" stroke="#bfa15f" stroke-width="1.1" stroke-linecap="round" />
				<circle cx="0" cy="0" r="2" fill="#ffffff" />
			</g>

			<!-- Разлетающиеся золотые искры -->
			<circle cx="60" cy="30" r="1.5" fill="#bfa15f" />
			<circle cx="100" cy="30" r="1.5" fill="#bfa15f" />
			<circle cx="80" cy="22" r="2" fill="#bfa15f" />
			<circle cx="34" cy="68" r="1.3" fill="#bfa15f" />
			<circle cx="126" cy="68" r="1.3" fill="#bfa15f" />
		</svg>
	{:else}
		<!-- 10. КОЛЬЦА И БУКЕТ: Универсальный свадебный символ -->
		<svg viewBox="0 0 160 150" fill="none" class="sketch-svg" xmlns="http://www.w3.org/2000/svg">
			<path d="M 24,142 H 136" stroke="#718776" stroke-width="1" stroke-linecap="round" opacity="0.6" />

			<!-- Переплетённые свадебные кольца на подушечке -->
			<g transform="translate(80, 56)">
				<circle cx="-8" cy="0" r="14" stroke="#bfa15f" stroke-width="1.5" fill="none" />
				<circle cx="8" cy="0" r="14" stroke="#bfa15f" stroke-width="1.5" fill="none" />
				<!-- Бриллиант на кольце -->
				<path d="M -8,-14 L -4,-20 L -12,-20 Z" stroke="#bfa15f" stroke-width="1" fill="#ffffff" />
				<!-- Искорка сияния -->
				<path d="M -8,-28 V -22 M -11,-25 H -5" stroke="#bfa15f" stroke-width="1" stroke-linecap="round" />
				<circle cx="-8" cy="-25" r="1.2" fill="#ffffff" />
			</g>

			<!-- Свадебный букет невесты с розами и эвкалиптом внизу -->
			<path d="M 64,136 L 76,108 L 88,136" stroke="#4d6756" stroke-width="1.3" stroke-linecap="round" />
			<path d="M 80,108 V 136" stroke="#718776" stroke-width="1" />
			<!-- Шелковая лента -->
			<path d="M 72,118 Q 80,124 88,118" stroke="#bfa15f" stroke-width="1.2" />
			<path d="M 76,122 Q 74,136 70,140" stroke="#bfa15f" stroke-width="1" />
			<path d="M 84,122 Q 86,136 90,140" stroke="#bfa15f" stroke-width="1" />

			<!-- Бутоны роз и листья в букете -->
			<circle cx="72" cy="102" r="6" stroke="#4d6756" stroke-width="1.1" fill="#fcfbf8" />
			<circle cx="88" cy="102" r="6" stroke="#4d6756" stroke-width="1.1" fill="#fcfbf8" />
			<circle cx="80" cy="94" r="7" stroke="#4d6756" stroke-width="1.2" fill="#fcfbf8" />
			<circle cx="80" cy="94" r="3" fill="#bfa15f" opacity="0.8" />
			<circle cx="72" cy="102" r="2.5" fill="#bfa15f" opacity="0.8" />
			<circle cx="88" cy="102" r="2.5" fill="#bfa15f" opacity="0.8" />

			<!-- Листья эвкалипта по бокам -->
			<path d="M 58,102 C 50,98 52,90 58,92 C 60,98 60,102 58,102 Z" fill="#607b6a" opacity="0.75" />
			<path d="M 102,102 C 110,98 108,90 102,92 C 100,98 100,102 102,102 Z" fill="#607b6a" opacity="0.75" />
		</svg>
	{/if}
</div>

<style>
	.sketch-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
	}

	.sketch-wrapper.sketch--left {
		justify-content: flex-end;
	}

	.sketch-wrapper.sketch--right {
		justify-content: flex-start;
	}

	.sketch-svg {
		width: clamp(92px, 18vw, 145px);
		height: auto;
		opacity: 0.92;
		transition: transform 0.4s var(--ease), opacity 0.4s var(--ease);
	}

	:global(.timeline__step:hover) .sketch-svg {
		transform: scale(1.05);
		opacity: 1;
	}

	@media (max-width: 480px) {
		.sketch-svg {
			width: clamp(82px, 24vw, 110px);
		}
	}
</style>
