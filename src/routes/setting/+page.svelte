<script lang="ts">
	import { getLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';
	import CaretDownFillIcon from '$lib/icons/CaretDownFillIcon.svelte';
	import IosShareIcon from '$lib/icons/IosShareIcon.svelte';
	import Spinner from '$lib/icons/Spinner.svelte';
	import ThreeDotsVerticalIcon from '$lib/icons/ThreeDotsVerticalIcon.svelte';
	import { Fleet } from '$lib/data';
	import { slide } from 'svelte/transition';
	import { os } from '$lib/utils';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let pwaGuideShow = $state({
		ios: os() == 'iOS',
		an: os() == 'Android'
	});

	let update = $state({
		time: Fleet.lastUpdateTime()?.toLocaleString(getLocale()),
		inprogress: false,
		auto: Fleet.isAutoUpdate()
	});

	$effect(() => {
		update.time = Fleet.lastUpdateTime()?.toLocaleString(getLocale());
	});

	$effect(() => Fleet.setAutoUpdate(update.auto));
</script>

<div class="flex flex-col gap-y-4">
	<div class="flex items-center justify-between rounded bg-white p-2">
		<div class="flex gap-x-2">
			<h1 class="font-bold">{m.version()}</h1>

			<p>
				{data.version ?? data.commitHash.slice(0, 8)}
			</p>
		</div>
	</div>

	<div class="flex flex-col gap-y-2 rounded bg-white p-2">
		<h1 class="font-bold">{m.fleetData()}</h1>

		<div class="flex">
			<p class="w-1/2">{m.autoUpdate()}</p>
			<div class="w-1/2 text-end text-gray-400">
				<label class="inline-flex cursor-pointer items-center">
					<input type="checkbox" class="peer sr-only" bind:checked={update.auto} />
					<div
						class="peer peer-checked:bg-new-orleans-500 relative h-6 w-11 rounded-full bg-gray-200 peer-focus:ring-2 peer-focus:outline-none after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"
					></div>
				</label>
			</div>
		</div>

		<div>
			<p class="w-1/2">{m.updateTime()}</p>
			<p class="text-gray-400">
				{#if update.time !== null}
					{update.time}
				{/if}
			</p>
		</div>

		<div class="flex justify-end">
			<button
				class="bg-new-orleans-500 rounded px-5 py-1"
				disabled={update.inprogress}
				onclick={() => {
					update.inprogress = true;
					Fleet.get(true)
						.then(() => (update.time = Fleet.lastUpdateTime()?.toLocaleString(getLocale())))
						.finally(() => setTimeout(() => (update.inprogress = false), 200));
				}}
			>
				{#if !update.inprogress}
					{m.update()}
				{:else}
					<Spinner class_="h-6 w-8 animate-spin fill-new-orleans-800 text-new-orleans-200"
					></Spinner>
				{/if}
			</button>
		</div>
	</div>

	<div class="flex flex-col gap-y-2 rounded bg-white p-2">
		<h1 class="font-bold">{m.pwaGuideTitle()}</h1>

		<div>
			<div class="flex w-1/2 gap-x-2">
				<p>iOS</p>
				<button
					type="button"
					class="inline-block transition-all"
					class:-rotate-90={!pwaGuideShow.ios}
					onclick={() => (pwaGuideShow.ios = !pwaGuideShow.ios)}
				>
					<CaretDownFillIcon></CaretDownFillIcon>
				</button>
			</div>

			{#if pwaGuideShow.ios}
				<p class="text-battleship-gray-800 text-sm" transition:slide={{ duration: 100 }}>
					在 Safai 中點擊
					<span class="inline-block"><IosShareIcon></IosShareIcon></span>
					按鈕，再點擊「加至主畫面」選項。
				</p>
			{/if}
		</div>

		<div>
			<div class="flex w-1/2 gap-x-2">
				<p>Android</p>
				<button
					type="button"
					class="inline-block transition-all"
					class:-rotate-90={!pwaGuideShow.an}
					onclick={() => (pwaGuideShow.an = !pwaGuideShow.an)}
				>
					<CaretDownFillIcon></CaretDownFillIcon>
				</button>
			</div>

			{#if pwaGuideShow.an}
				<p class="text-battleship-gray-800 text-sm" transition:slide={{ duration: 100 }}>
					在 Chrome 中點擊
					<span class="inline-block"><ThreeDotsVerticalIcon></ThreeDotsVerticalIcon></span>
					按鈕，再點擊「新增至主畫面」或「安裝應用程式」選項。
				</p>
			{/if}
		</div>
	</div>

	<div class="flex flex-col gap-y-3 rounded bg-white p-2">
		<div class="flex">
			<p class="w-1/2">
				{`${m.sourceCode()}${m.slash()}${m.reportBugs()}`}
			</p>
			<a href="https://github.com/SuperDumbTM/lost-in-mtr" class="content-center font-mono"
				>🔗 Github
			</a>
		</div>

		<div class="flex">
			<p class="w-1/2">{m.fleetDataSource()}</p>
			<a href="https://hkrail.fandom.com/wiki/%E9%A6%96%E9%A0%81" class="content-center"
				>🔗 香港鐵路大典
			</a>
		</div>
	</div>
</div>
