<script lang="ts">
	import { base } from '$app/paths';
	import HomeIcon from '$lib/icons/HomeIcon.svelte';
	import InfoSquareIcon from '$lib/icons/InfoSquareIcon.svelte';
	import TranslateIcon from '$lib/icons/TranslateIcon.svelte';
	import '../app.css';
	import { locale } from '$lib/i18n/translations';

	let { children } = $props();

	let showLocalDropdown = $state(false);
</script>

<div class="m-auto flex h-svh max-w-xl flex-col">
	<div class="bg-apple-blossom-100 flex justify-between p-4">
		<a href="https://flowbite.com/" class="flex items-center space-x-3 rtl:space-x-reverse">
			<img src="https://flowbite.com/docs/images/logo.svg" class="h-7" alt="Flowbite Logo" />
			<span class="self-center text-lg font-semibold whitespace-nowrap"> 迷失港鐵 </span>
		</a>

		<ul class="flex items-center gap-x-4">
			<li>
				<a href={`${base}/`} class="flex h-6 w-8 items-center justify-center">
					<HomeIcon></HomeIcon>
				</a>
			</li>
			<li>
				<a href={`${base}/about`} class="flex h-6 w-8 items-center justify-center">
					<InfoSquareIcon></InfoSquareIcon>
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

	<!-- <main style="height: calc(100% - 52px);"> -->
	<main class="h-full">
		{@render children()}
	</main>
</div>
