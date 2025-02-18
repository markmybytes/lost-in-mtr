<script lang="ts">
	import { locale, t } from '$lib/i18n/translations';
	import CaretDownFillIcon from '$lib/icons/CaretDownFillIcon.svelte';
	import IosShareIcon from '$lib/icons/IosShareIcon.svelte';
	import Spinner from '$lib/icons/Spinner.svelte';
	import ThreeDotsVerticalIcon from '$lib/icons/ThreeDotsVerticalIcon.svelte';
	import { fleetLastUpdate, fleetData, os } from '$lib/utils';
	import { slide } from 'svelte/transition';

	let pwaGuideShow = $state({
		ios: os() == 'iOS',
		an: os() == 'Android'
	});

	let update = $state({
		time: fleetLastUpdate(),
		inprogress: false
	});
</script>

<div class="flex flex-col gap-y-4">
	<div class="flex flex-col gap-y-2 rounded bg-white p-2">
		<h1 class="font-bold">{$t('setting.fleetData')}</h1>

		<div>
			<p class="w-1/2">{$t('setting.updateTime')}</p>
			<p class="text-gray-400">
				{#if update.time !== null}
					{update.time.toLocaleString(locale.get())}
				{/if}
			</p>
		</div>

		<div class="flex justify-end">
			<button
				class="bg-new-orleans-500 rounded px-5 py-1"
				disabled={update.inprogress}
				onclick={() => {
					update.inprogress = true;
					fleetData(true)
						.then(() => (update.time = fleetLastUpdate()))
						.finally(() => (update.inprogress = false));
				}}
			>
				{#if !update.inprogress}
					{$t('setting.update')}
				{:else}
					<Spinner class_="h-6 w-8 animate-spin fill-new-orleans-800 text-new-orleans-200"
					></Spinner>
				{/if}
			</button>
		</div>
	</div>

	<div class="flex flex-col gap-y-2 rounded bg-white p-2">
		<h1 class="font-bold">{$t('setting.pwaGuideTitle')}</h1>

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
				{`${$t('setting.sourceCode')}${$t('common./')}${$t('setting.reportBugs')}`}
			</p>
			<a href="https://github.com/SuperDumbTM/lost-in-mtr" class="content-center font-mono"
				>🔗 Github
			</a>
		</div>

		<div class="flex">
			<p class="w-1/2">{$t('setting.fleetDataSource')}</p>
			<a href="https://hkrail.fandom.com/wiki/%E9%A6%96%E9%A0%81" class="content-center"
				>🔗 香港鐵路大典
			</a>
		</div>
	</div>
</div>
