<script lang="ts">
	import { base } from '$app/paths';
	import TranslateIcon from '$lib/icons/TranslateIcon.svelte';
	import '../app.css';
	import { locale } from '$lib/i18n/translations';
	import GearIcon from '$lib/icons/GearIcon.svelte';
	import SearchIcon from '$lib/icons/SearchIcon.svelte';
	import QuestionLgIcon from '$lib/icons/QuestionLgIcon.svelte';
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';
	import { Fleet } from '$lib/data';

	let { children } = $props();

	let showLocalDropdown = $state(false);

	let hasUpdate = $state(false);

	onMount(() => {
		// reference: https://whatwebcando.today/articles/handling-service-worker-updates/
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker
				.register(`${base}/service-worker.js`, { type: dev ? 'module' : 'classic' })
				.then((registration) => {
					if (registration.waiting) {
						hasUpdate = true;
					}

					registration.addEventListener('updatefound', () => {
						if (!registration.installing) {
							return;
						}

						registration.installing.addEventListener('statechange', () => {
							if (registration.waiting && navigator.serviceWorker.controller) {
								hasUpdate = true;
							}
						});
					});

					let refreshing = false;

					navigator.serviceWorker.addEventListener('controllerchange', () => {
						if (!refreshing) {
							Fleet.clear();
							refreshing = true;
							window.location.reload();
						}
					});
				});
		}
	});
</script>

<div class="m-auto flex h-svh max-w-xl flex-col">
	<div class="bg-apple-blossom-600/40 flex justify-between px-3 py-5">
		<div class="flex items-center space-x-3 rtl:space-x-reverse">
			<!-- <img src={`${assets}/favicon.svg`} class="h-7" alt="Logo" /> -->
			<span class="text-new-orleans-400 self-center text-lg font-semibold whitespace-nowrap">
				迷失港鐵
			</span>
		</div>

		<ul class="flex items-center gap-x-4">
			<li>
				<a
					href={`${base}/`}
					class="flex h-6 w-8 items-center justify-center"
					data-sveltekit-replacestate
				>
					<SearchIcon></SearchIcon>
				</a>
			</li>
			<li>
				<a
					href={`${base}/setting`}
					class="flex h-6 w-8 items-center justify-center"
					data-sveltekit-replacestate
				>
					<GearIcon></GearIcon>
				</a>
			</li>
			<li>
				<a
					href={`${base}/guide`}
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
						{#each [['繁體中文', 'zh-hk'], ['English', 'en']] as lc}
							<button
								class="w-full px-4 py-2"
								onclick={() => {
									showLocalDropdown = false;
									locale.set(lc[1]);
								}}
							>
								{lc[0]}
							</button>
						{/each}
					</div>
				</div>
			</li>
		</ul>
	</div>

	<main
		class="h-full px-2 pt-5"
		style="padding-bottom: max(env(safe-area-inset-bottom), calc(var(--spacing)* 5));"
	>
		<div class="-mt-2 mb-2 flex">
			<button
				class="bg-new-orleans-700 w-full cursor-pointer rounded py-1"
				class:hidden={!hasUpdate}
				onclick={() => {
					if ('serviceWorker' in navigator) {
						navigator.serviceWorker.getRegistration().then((registration) => {
							registration?.waiting?.postMessage('SKIP_WAITING');
						});
					}
				}}
			>
				有新的版本可供更新，按此更新。
			</button>
		</div>

		{@render children()}
	</main>
</div>
