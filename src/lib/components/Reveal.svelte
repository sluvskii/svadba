<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		delay?: number;
		kind?: 'up' | 'fade' | 'left' | 'right' | 'scale';
		class?: string;
	};

	let { children, delay = 0, kind = 'up', class: className = '' }: Props = $props();

	let element = $state<HTMLDivElement | null>(null);

	$effect(() => {
		const node = element;
		if (!node) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						node.classList.add('is-visible');
						observer.unobserve(node);
					}
				}
			},
			{ threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
		);

		observer.observe(node);
		return () => observer.disconnect();
	});
</script>

<div
	bind:this={element}
	class={className}
	data-reveal={kind}
	style={`--reveal-delay: ${delay}ms`}
>
	{@render children()}
</div>
