<script lang="ts">
	import { base, resolve } from '$app/paths';
	import TranslateIcon from '$lib/icons/TranslateIcon.svelte';
	import './layout.css';
	import { setLocale } from '$lib/paraglide/runtime';
	import GearIcon from '$lib/icons/GearIcon.svelte';
	import SearchIcon from '$lib/icons/SearchIcon.svelte';
	import QuestionLgIcon from '$lib/icons/QuestionLgIcon.svelte';
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { Fleet } from '$lib/data';

	let { children } = $props();

	let showLocalDropdown = $state(false);

	onMount(() => {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker
				.register(`${base}/service-worker.js`, { type: dev ? 'module' : 'classic' })
				.then((registration) => {
					registration.addEventListener('updatefound', () => {
						if (registration.installing === null) {
							return;
						}

						registration.installing.addEventListener('statechange', () => {
							if (registration.waiting && navigator.serviceWorker.controller) {
								registration.waiting.postMessage('SKIP_WAITING');
							}
						});
					});

					navigator.serviceWorker.addEventListener('controllerchange', () => {
						Fleet.clear();
						window.location.reload();
					});
				})
				.catch((error) => {
					console.error('Service worker registration failed: ', error);
				});
		}
	});
</script>

<div class="m-auto flex h-svh max-w-xl flex-col">
	<div class="flex justify-between bg-apple-blossom-600/40 px-3 py-5">
		<div class="flex items-center space-x-3 rtl:space-x-reverse">
			<!-- <img src={`${assets}/favicon.svg`} class="h-7" alt="Logo" /> -->
			<span class="self-center text-lg font-semibold whitespace-nowrap text-new-orleans-400">
				迷失港鐵
			</span>
		</div>

		<ul class="flex items-center gap-x-4">
			<li>
				<a
					href={resolve('/')}
					class="flex h-6 w-8 items-center justify-center"
					data-sveltekit-replacestate
				>
					<SearchIcon></SearchIcon>
				</a>
			</li>
			<li>
				<a
					href={resolve('/setting')}
					class="flex h-6 w-8 items-center justify-center"
					data-sveltekit-replacestate
				>
					<GearIcon></GearIcon>
				</a>
			</li>
			<li>
				<a
					href={resolve('/guide')}
					class="flex h-6 w-8 items-center justify-center"
					data-sveltekit-replacestate
				>
					<QuestionLgIcon></QuestionLgIcon>
				</a>
			</li>
			<li class="border-s ps-3">
				<div class="relative">
					<button
						type="button"
						class=" flex h-6 w-8 items-center justify-center"
						onclick={() => (showLocalDropdown = !showLocalDropdown)}
					>
						<TranslateIcon></TranslateIcon>
					</button>
					<div
						class="absolute right-0 z-10 mt-2 w-28 rounded-md border border-gray-200 bg-white text-center shadow-lg"
						class:hidden={!showLocalDropdown}
					>
						<button
							class="w-full px-4 py-2"
							onclick={() => {
								showLocalDropdown = false;
								setLocale('zh-Hant-HK');
							}}
						>
							繁體中文
						</button>
						<button
							class="w-full px-4 py-2"
							onclick={() => {
								showLocalDropdown = false;
								setLocale('en');
							}}
						>
							English
						</button>
					</div>
				</div>
			</li>
		</ul>
	</div>

	<main
		class="5 h-full px-2 pt-5"
		style="padding-bottom: max(env(safe-area-inset-bottom), calc(var(--spacing)* 5));"
	>
		{@render children()}
	</main>
</div>
