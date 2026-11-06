<script lang="ts">
	import { ui } from '#lib/content.js';
	import { pick } from '#lib/i18n.svelte.js';

	type Props = {
		size?: number;
		light?: boolean;
		class?: string;
	};

	let { size = 112, light = false, class: className = '' }: Props = $props();
</script>

<svg
	class={`monogram ${className}`}
	class:monogram--light={light}
	width={size}
	height={size}
	viewBox="0 0 120 120"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	role="img"
	aria-label={pick(ui.brandNames)}
>
	<!-- Внешняя тонкая рамка печати -->
	<circle
		cx="60"
		cy="60"
		r="56"
		stroke="currentColor"
		stroke-width="1.2"
		vector-effect="non-scaling-stroke"
	/>
	<!-- Внутреннее декоративное кольцо -->
	<circle
		cx="60"
		cy="60"
		r="51"
		stroke="currentColor"
		stroke-width="0.75"
		stroke-dasharray="2 2.5"
		opacity={light ? '0.5' : '0.4'}
		vector-effect="non-scaling-stroke"
	/>

	<!-- Верхний акцент: четырёхконечная золотая звёздочка -->
	<path
		d="M60 14.5 L61.2 17.8 L64.5 19 L61.2 20.2 L60 23.5 L58.8 20.2 L55.5 19 L58.8 17.8 Z"
		class="monogram__gold"
	/>

	<!-- Буква А (классическая антиква с засечками) -->
	<!-- Левая наклонная стойка -->
	<path
		d="M39 34 L25 82 M21 82 H31 M37 34 H44 M31 66 H49"
		stroke="currentColor"
		stroke-width="1.4"
		stroke-linecap="round"
		stroke-linejoin="round"
		vector-effect="non-scaling-stroke"
	/>
	<!-- Правая усиленная наклонная стойка -->
	<path
		d="M39 34 L54 82"
		stroke="currentColor"
		stroke-width="2.6"
		stroke-linecap="round"
		vector-effect="non-scaling-stroke"
	/>
	<!-- Нижняя правая засечка A -->
	<path
		d="M49 82 H58"
		stroke="currentColor"
		stroke-width="1.4"
		stroke-linecap="round"
		vector-effect="non-scaling-stroke"
	/>

	<!-- Золотой амперсанд, переплетающий А и К -->
	<path
		d="M59 47 C55 41 49 42 49 47 C49 53 61 60 59 69 C57 75 51 76 46 72 C41 68 44 61 48 60 C54 59 63 67 69 73"
		class="monogram__gold-stroke"
		stroke-width="1.8"
		stroke-linecap="round"
		stroke-linejoin="round"
		vector-effect="non-scaling-stroke"
	/>

	<!-- Буква К (классическая антиква с засечками) -->
	<!-- Вертикальный ствол К -->
	<path
		d="M66 34 V82"
		stroke="currentColor"
		stroke-width="2.6"
		stroke-linecap="round"
		vector-effect="non-scaling-stroke"
	/>
	<!-- Верхняя и нижняя засечки ствола К -->
	<path
		d="M61 34 H72 M61 82 H72"
		stroke="currentColor"
		stroke-width="1.4"
		stroke-linecap="round"
		vector-effect="non-scaling-stroke"
	/>
	<!-- Верхняя диагональ К -->
	<path
		d="M67 56 L86 34 M82 34 H90"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
		vector-effect="non-scaling-stroke"
	/>
	<!-- Нижняя диагональ К с каллиграфическим изгибом -->
	<path
		d="M72 52 Q81 67 91 82 M86 82 H95"
		stroke="currentColor"
		stroke-width="2.4"
		stroke-linecap="round"
		vector-effect="non-scaling-stroke"
	/>

	<!-- Нижняя ветвь (лавровые листочки) -->
	<path
		d="M40 98 C48 103 54 104 60 104 C66 104 72 103 80 98"
		stroke="currentColor"
		stroke-width="1"
		opacity="0.5"
		stroke-linecap="round"
		vector-effect="non-scaling-stroke"
	/>
	<circle cx="48" cy="99" r="1.2" fill="currentColor" opacity="0.45" />
	<circle cx="54" cy="102" r="1.2" fill="currentColor" opacity="0.45" />
	<circle cx="66" cy="102" r="1.2" fill="currentColor" opacity="0.45" />
	<circle cx="72" cy="99" r="1.2" fill="currentColor" opacity="0.45" />
	<!-- Нижняя золотая жемчужина -->
	<circle cx="60" cy="104" r="1.6" class="monogram__gold" />
</svg>

<style>
	.monogram {
		display: inline-block;
		color: var(--pine);
		flex: 0 0 auto;
		transition: transform 0.35s var(--ease), color 0.3s ease;
	}

	.monogram:hover {
		transform: scale(1.03);
	}

	.monogram--light {
		color: var(--paper);
	}

	.monogram__gold {
		fill: var(--brass);
	}

	.monogram__gold-stroke {
		stroke: var(--brass);
		fill: none;
	}

	.monogram--light .monogram__gold {
		fill: var(--brass-light);
	}

	.monogram--light .monogram__gold-stroke {
		stroke: var(--brass-light);
	}
</style>
