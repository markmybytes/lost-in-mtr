<script lang="ts">
	import lines from '$lib/data/lines.json';
	import { t } from '$lib/i18n/translations';
	import { onMount } from 'svelte';
	import { Fleet } from '$lib/data';
	import { textColor } from '$lib/utils';
	import CaretRightFillIcon from '$lib/icons/CaretRightFillIcon.svelte';
	import { base } from '$app/paths';

	let fleets: { [key: string]: Array<string> } = $state({});

	let hasUpdate: boolean = $state(false);

	const inputs: {
		stockNumber: string;
		doorSide: null | 'U' | 'D' | 'A' | 'B';
		doorNumber: null | 1 | 2 | 3 | 4 | 5;
	} = $state({
		stockNumber: '',
		doorSide: null,
		doorNumber: null
	});

	const results = $derived.by(() => {
		if (inputs.stockNumber.length < 4) {
			return [];
		}

		const matches: Array<keyof typeof lines> = [];
		for (const [line, stocks] of Object.entries(fleets)) {
			for (const stock of stocks) {
				const stockArr = stock.split(/[-\+]+/);
				if (stockArr.includes(inputs.stockNumber)) {
					matches.push(line as keyof typeof lines);
				}
			}
		}

		return matches;
	});

	const alphabetChoices = $derived.by(() => {
		return Array.from(
			new Set(
				Object.values(fleets).flatMap((lines) =>
					lines.flatMap((stock) => {
						return stock.split('-').map((code) => code.charAt(0));
					})
				)
			)
		).sort();
	});

	onMount(() => {
		Fleet.get(false).then((data) => {
			if (data) {
				fleets = data;
			}

			if (Fleet.shouldCheckUpdate()) {
				Fleet.hasUpdate().then((result) => {
					hasUpdate = result.has;
				});
			}
		});
	});

	$effect(() => {
		inputs.stockNumber = inputs.stockNumber.toUpperCase();
	});
</script>

<div class="flex h-full flex-col gap-y-2">
	{#if hasUpdate}
		<div class="rounded-lg bg-white/90 p-2">
			<p class="text-new-orleans-800">🔔有新的編組資料可供更新</p>
		</div>
	{/if}

	<div class="flex h-0 grow flex-col overflow-y-auto rounded-lg bg-white/90 p-2">
		{#each results as line}
			<a
				href={`${base}/result?line=${line}&stockNumber=${inputs.stockNumber}`}
				class="border-new-orleans-900 flex justify-between gap-x-2 py-4 not-first:border-t last:border-b"
			>
				<div class="flex flex-col gap-y-2">
					<div>
						<button
							class="h-6.5 rounded-sm bg-blue-100 px-2 text-nowrap"
							style:background-color={lines[line].color}
							style:color={textColor(lines[line].color)}
						>
							{$t(`line.${line}`)}
						</button>
					</div>

					<p>
						{lines[line]['terminals']['UP'].map((s) => $t(`station.${s}`)).join($t('common./'))} ⇄
						{lines[line]['terminals']['DOWN'].map((s) => $t(`station.${s}`)).join($t('common./'))}
					</p>
				</div>

				<button class="w-6">
					<CaretRightFillIcon></CaretRightFillIcon>
				</button>
			</a>
		{/each}
	</div>

	<div class="flex flex-col gap-y-2 p-2">
		<div>
			<input
				type="text"
				class="h-8 w-full bg-white px-2"
				placeholder="🔎 車廂編號"
				bind:value={inputs.stockNumber}
			/>
		</div>

		<div class="flex h-54 gap-x-2 lg:h-44">
			<div class="flex h-full w-2/3 flex-col gap-y-2 text-xl">
				{#each [['7', '8', '9'], ['4', '5', '6'], ['1', '2', '3']] as numbers}
					<div class="flex grow gap-x-2">
						{#each numbers as number}
							<button
								class="flex-1 rounded-xs bg-white"
								onclick={() => {
									inputs.stockNumber = inputs.stockNumber.concat(number);
								}}
							>
								{number}
							</button>
						{/each}
					</div>
				{/each}

				<div class="flex grow gap-x-2">
					<button
						class="flex-1 rounded-xs bg-white"
						onclick={() => {
							inputs.stockNumber = '';
						}}
					>
						🧹
					</button>
					<button
						class="flex-1 rounded-xs bg-white"
						onclick={() => {
							inputs.stockNumber = inputs.stockNumber.concat('0');
						}}
					>
						0
					</button>
					<button
						class="flex-1 rounded-xs bg-white"
						onclick={() => {
							inputs.stockNumber = inputs.stockNumber.slice(0, -1);
						}}
					>
						⌫
					</button>
				</div>
			</div>

			<div class="grow overflow-y-scroll">
				<div class="grid grow grid-cols-2 gap-1">
					{#each alphabetChoices as alphabet}
						<div>
							<button
								class="h-12 w-full rounded bg-white disabled:bg-gray-200"
								onclick={() => {
									inputs.stockNumber = inputs.stockNumber.concat(alphabet);
								}}
								disabled={/[a-zA-Z]/i.test(inputs.stockNumber)}
							>
								{alphabet}
							</button>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
