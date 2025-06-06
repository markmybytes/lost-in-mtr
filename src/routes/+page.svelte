<script lang="ts">
	import lines from '$lib/data/lines.json';
	import { t } from '$lib/i18n/translations';
	import { onMount } from 'svelte';
	import { Fleet } from '$lib/data';
	import { textColor } from '$lib/utils';
	import CaretRightFillIcon from '$lib/icons/CaretRightFillIcon.svelte';
	import { base } from '$app/paths';

	let fleets: Fleet.Fleets = $state({});

	let hasUpdate: boolean = $state(false);

	const inputs: {
		stockNumber: string;
		doorSide: null | 'U' | 'D' | 'A' | 'B';
		doorNumber: null | 1 | 2 | 3 | 4 | 5;
		allUrbanLines: boolean;
	} = $state({
		stockNumber: '',
		doorSide: null,
		doorNumber: null,
		allUrbanLines: false
	});

	const results = $derived.by(() => {
		if (inputs.stockNumber.length < 4) {
			return [];
		}

		const matches: Array<keyof typeof lines> = [];
		for (const [line, stocks] of Object.entries(fleets)) {
			for (const stock of Object.values(stocks).flat()) {
				const stockArr = stock.split(/[-\+]+/);
				if (stockArr.includes(inputs.stockNumber)) {
					matches.push(line as keyof typeof lines);
				}
			}
		}

		return matches;
	});

	const extendedResults = $derived.by(() => {
		if (inputs.allUrbanLines && results.some((l) => Fleet.ubranLines.includes(l))) {
			return {
				reference: results.filter((l) => Fleet.ubranLines.includes(l))[0],
				lines: Fleet.ubranLines.filter((l) => !results.includes(l))
			};
		}
		return null;
	});

	const alphabetChoices = $derived.by(() => {
		return Array.from(
			new Set(
				Object.values(fleets).flatMap((stocks) =>
					Object.values(stocks)
						.flat()
						.flatMap((stock) => {
							return stock.split('-').map((code) => code.charAt(0));
						})
				)
			)
		).sort();
	});

	onMount(() => {
		Fleet.get(false)
			.then((data) => {
				fleets = data ?? {};
			})
			.finally(() => {
				if (!Fleet.shouldCheckUpdate()) {
					return;
				}

				Fleet.hasUpdate().then((result) => {
					if (!result.has) {
						return;
					}

					if (Fleet.isAutoUpdate()) {
						Fleet.get(true).then((data) => {
							fleets = data ?? {};
						});
					} else {
						hasUpdate = true;
					}
				});
			});
	});

	$effect(() => {
		inputs.allUrbanLines = false;
		inputs.stockNumber = inputs.stockNumber.toUpperCase();
	});
</script>

<div class="flex h-full flex-col gap-y-3">
	{#if hasUpdate}
		<a href={`${base}/setting`} class="rounded-lg bg-white/90 p-2">
			<p class="text-new-orleans-900">🔔 {$t('common.fleetUpdateAvailable')}</p>
		</a>
	{/if}

	<div class="flex h-0 grow flex-col overflow-y-auto rounded-lg bg-white/90 p-2">
		{#each [...results, ...(extendedResults?.lines ?? [])] as line}
			{#each ['UP', 'DOWN'] as const as direction}
				<a
					href={results.includes(line)
						? `${base}/result?l=${line}&vn=${inputs.stockNumber}&u=${direction == 'UP'}`
						: `${base}/result?l=${line}&rl=${extendedResults!.reference}&vn=${inputs.stockNumber}&u=${direction == 'UP'}`}
					class="border-new-orleans-900 flex justify-between gap-x-2 py-2 not-first:border-t last:border-b"
				>
					<div class="flex flex-col gap-1.5">
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
							{`${$t('common.to')} ${lines[line]['terminals'][direction].map((s) => $t(`station.${s}`)).join($t('common./'))}`}
						</p>
					</div>

					<button class="w-6">
						<CaretRightFillIcon></CaretRightFillIcon>
					</button>
				</a>
			{/each}
		{/each}

		{#if results.some((l) => Fleet.ubranLines.includes(l)) && !inputs.allUrbanLines}
			<div class="border-new-orleans-900 flex justify-end border-t py-4 text-xs md:text-sm">
				<button
					class="bg-new-orleans-400 cursor-pointer rounded p-1"
					onclick={() => {
						inputs.allUrbanLines = true;
					}}
				>
					{$t('common.showUrbanLine')}
				</button>
			</div>
		{/if}
	</div>

	<div class="flex flex-col gap-y-2 rounded">
		<div>
			<input
				type="text"
				class="h-8 w-full bg-white px-2"
				placeholder={`🔎 ${$t('common.carNo')}`}
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
