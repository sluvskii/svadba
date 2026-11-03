<script lang="ts">
	type Props = {
		size?: number;
		light?: boolean;
		class?: string;
	};

	let { size = 112, light = false, class: className = '' }: Props = $props();
</script>

<div
	class={`monogram ${className}`}
	class:monogram--light={light}
	style={`--monogram-size: ${size}px`}
	role="img"
	aria-label="Алина и Камиль"
>
	<span class="monogram__letter">А</span>
	<span class="monogram__amp">&</span>
	<span class="monogram__letter">К</span>
</div>

<style>
	.monogram {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.08em;
		width: var(--monogram-size);
		height: var(--monogram-size);
		border: 1px solid currentColor;
		border-radius: 50%;
		color: var(--pine);
		font-family: var(--serif);
		font-weight: 400;
		line-height: 1;
		letter-spacing: 0.01em;
		flex: 0 0 auto;
	}

	.monogram::before {
		content: '';
		position: absolute;
		inset: 6px;
		border: 1px solid currentColor;
		border-radius: 50%;
		opacity: 0.32;
	}

	.monogram--light {
		color: var(--paper);
	}

	.monogram__letter {
		font-size: calc(var(--monogram-size) * 0.28);
		transform: translateY(-0.02em);
	}

	.monogram__amp {
		font-size: calc(var(--monogram-size) * 0.2);
		font-style: italic;
		color: var(--brass);
		transform: translateY(0.08em);
	}

	.monogram--light .monogram__amp {
		color: var(--brass-light);
	}
</style>
