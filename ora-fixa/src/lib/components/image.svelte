<script lang="ts">
	import { onMount } from 'svelte';

	interface ImageVariant {
		src: string;
		w: number;
		h: number;
	}

	interface EnhancedImage {
		img: {
			src: string;
			w: number;
			h: number;
		};
		sources: {
			avif: string;
			webp: string;
			[key: string]: string;
		};

		jpeg: ImageVariant[];
	}

	interface Props {
		image: string;
		alt: string;
		sizes?: string;
		class?: string;
		transitionDuration?: number;
	}

	let {
		image,
		alt,
		sizes = '100vw',
		class: className = '',
		transitionDuration = 300
	}: Props = $props();

	let isVisible = $state<boolean>(false);
	let isLoaded = $state<boolean>(false);
	let containerElement = $state<HTMLDivElement | null>(null);
	let processedSources = $state<EnhancedImage | null>(null);

	async function importImage(imagePath: string): Promise<EnhancedImage | null> {
		const pictures: Record<string, () => Promise<unknown>> = import.meta.glob(
			`/src/lib/assets/**/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}`,
			{
				import: 'default',
				query: {
					enhanced: true,
					w: '30;400;800;1200;1600;2400'
				}
			}
		);
    
    console.log(pictures)

		for (const [path, srcPromise] of Object.entries(pictures)) {
			if (path.includes(imagePath)) {
				return (await srcPromise()) as EnhancedImage;
			}
		}

		return null;
	}

	$effect(() => {
		if (isVisible && !processedSources) {
			importImage(image).then((src) => {
				if (src) {
					processedSources = src;
				}
			});
		}
	});

	onMount(() => {
		if (!containerElement) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (entry.isIntersecting) {
					isVisible = true;
					observer.unobserve(entry.target);
				}
			},
			{ rootMargin: '50px' }
		);

		observer.observe(containerElement);

		return () => observer.disconnect();
	});
</script>

<div
	bind:this={containerElement}
	class="image-container {className}"
	style:aspect-ratio={processedSources
		? `${processedSources.img.w} / ${processedSources.img.h}`
		: 'auto'}
>
	{#if processedSources}
		<img
			src=""
			class="placeholder"
			class:loaded={isLoaded}
			alt="Loading..."
			aria-hidden="true"
		/>
		<picture>
			<source srcset={""} type="image/avif" {sizes} />
			<source srcset={processedSources.sources.webp} type="image/webp" {sizes} />
			<img
				src={processedSources.img.src}
				srcset={processedSources.sources.webp}
				{alt}
				width={processedSources.img.w}
				height={processedSources.img.h}
				class="main-image"
				class:loaded={isLoaded}
				onload={() => (isLoaded = true)}
				loading="lazy"
			/>
		</picture>
	{/if}
</div>

<style>
	.image-container {
		position: relative;
		overflow: hidden;
		display: block;
		width: 100%;
		/* A fallback background provides a better experience than a blank space if JS fails */
		background-color: #f0f0f0;
	}

	.placeholder,
	.main-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: opacity var(--transition-duration) ease-in-out;
	}

	.placeholder {
		/* Apply a CSS blur to the tiny placeholder image for a smooth effect */
		filter: blur(10px);
		/* Scale up slightly to avoid blurred edges showing */
		transform: scale(1.1);
		opacity: 1;
		z-index: 1;
	}

	.placeholder.loaded {
		opacity: 0;
	}

	.main-image {
		opacity: 0;
		z-index: 2;
	}

	.main-image.loaded {
		opacity: 1;
	}

</style>
