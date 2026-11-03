<script lang="ts">
	type Props = {
		variant?: 'divider' | 'flower' | 'sprig' | 'corner';
		class?: string;
	};

	let { variant = 'divider', class: className = '' }: Props = $props();
</script>

{#if variant === 'divider'}
	<svg
		class={className}
		viewBox="0 0 140 28"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<path d="M0 14H44M96 14H140" stroke="currentColor" stroke-width="1" opacity=".55" />
		<path d="M70 3.5 81 14 70 24.5 59 14 70 3.5Z" stroke="currentColor" stroke-width="1" />
		<path d="M70 9 75.5 14 70 19 64.5 14 70 9Z" fill="currentColor" opacity=".55" />
		<path
			d="M44 14C50 14 52 6 60 6M96 14C90 14 88 6 80 6M44 14C50 14 52 22 60 22M96 14C90 14 88 22 80 22"
			stroke="currentColor"
			stroke-width="1"
			opacity=".55"
		/>
		<circle cx="44" cy="14" r="1.4" fill="currentColor" opacity=".7" />
		<circle cx="96" cy="14" r="1.4" fill="currentColor" opacity=".7" />
	</svg>
{:else if variant === 'flower'}
	<svg
		class={className}
		viewBox="0 0 48 68"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<path d="M24 66V30" stroke="currentColor" stroke-width="1" />
		<path
			d="M24 48C15 46 10 39 10 30C19 32 24 39 24 48ZM24 44C33 42 38 35 38 26C29 28 24 35 24 44Z"
			stroke="currentColor"
			stroke-width="1"
			opacity=".7"
		/>
		<path
			d="M24 30C15 27 13 17 18 8C22 13 24 21 24 30ZM24 30C33 27 35 17 30 8C26 13 24 21 24 30ZM24 30C21 21 22 12 24 4C26 12 27 21 24 30Z"
			stroke="currentColor"
			stroke-width="1"
		/>
		<circle cx="24" cy="30" r="2" fill="currentColor" opacity=".65" />
	</svg>
{:else if variant === 'sprig'}
	<svg
		class={className}
		viewBox="0 0 180 420"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<path
			d="M90 412C90 340 76 286 84 226C92 168 112 118 108 18"
			stroke="currentColor"
			stroke-width="1"
		/>
		<path
			d="M86 348C64 340 50 320 48 296C70 302 84 320 86 348ZM94 338C116 328 130 308 132 284C110 290 96 310 94 338ZM82 288C60 280 46 260 44 236C66 242 80 260 82 288ZM98 278C120 268 134 248 136 224C114 230 100 250 98 278ZM84 228C62 220 48 200 46 176C68 182 82 200 84 228ZM100 218C122 208 136 188 138 164C116 170 102 190 100 218ZM88 168C70 158 60 140 60 120C78 128 88 144 88 168ZM104 158C122 148 132 130 132 110C114 118 104 134 104 158ZM92 112C78 100 72 84 74 68C88 78 94 94 92 112ZM108 104C122 92 128 76 126 60C112 70 106 86 108 104Z"
			stroke="currentColor"
			stroke-width="1"
			opacity=".72"
		/>
		<circle cx="108" cy="18" r="3" fill="currentColor" opacity=".55" />
		<circle cx="84" cy="226" r="2.2" fill="currentColor" opacity=".5" />
		<circle cx="60" cy="120" r="2" fill="currentColor" opacity=".4" />
	</svg>
{:else if variant === 'corner'}
	<svg
		class={className}
		viewBox="0 0 80 80"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<path d="M2 78V20C2 10 10 2 20 2H78" stroke="currentColor" stroke-width="1" />
		<path
			d="M10 78V22C10 15 15 10 22 10H78"
			stroke="currentColor"
			stroke-width="1"
			opacity=".45"
		/>
		<path
			d="M22 22C32 22 38 28 38 38M22 22C22 32 28 38 38 38"
			stroke="currentColor"
			stroke-width="1"
			opacity=".65"
		/>
		<circle cx="22" cy="22" r="1.5" fill="currentColor" opacity=".65" />
	</svg>
{/if}
