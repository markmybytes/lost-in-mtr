<script lang="ts">
	import lines from '$lib/data/lines.json';
	import carriage from '$lib/data/carriage.json';
	import DoorColsedIcon from '$lib/icons/DoorColsedIcon.svelte';
	import TrainLightrailFrontIcon from '$lib/icons/TrainLightrailFrontIcon.svelte';
	import { textColor } from '$lib/utils/index';
	import { fade, slide } from 'svelte/transition';
	import { t } from '$lib/i18n/translations';
	import ArrowLeftRight from '$lib/icons/ArrowLeftRight.svelte';

	const inputs: {
		carriage: string;
		sides: null | 'U' | 'D' | 'A' | 'B';
		door: null | 1 | 2 | 3 | 4 | 5;
		flip: boolean;
	} = $state({
		carriage: '',
		sides: null,
		door: null,
		flip: false
	});

	const results = $derived.by(() => {
		if (inputs.carriage.length < 4) {
			return [];
		}

		const matches = [];
		for (const [line, stocks] of Object.entries(carriage)) {
			for (const stock of stocks) {
				const stockArr = stock.split(/[-\+]+/);
				if (stockArr.includes(inputs.carriage)) {
					matches.push({
						line: line,
						carNumber: stockArr.indexOf(inputs.carriage) + 1,
						stock: stockArr
					});
				}
			}
		}

		return matches;
	});

	function doors(line: keyof typeof lines, carriage: string) {
		if ((line == 'EAL' && carriage.includes('F')) || line == 'AEL') {
			return [1, 2];
		} else {
			return [1, 2, 3, 4, 5];
		}
	}

	function destination(line: string, direction: 'DOWN' | 'UP') {
		return lines[line as keyof typeof lines]['terminals'][direction]
			.map((s) => $t(`station.${s}`))
			.join('／');
	}
</script>

<div class="flex flex-col gap-y-4 p-2">
	<form class="flex flex-col gap-y-4 rounded-lg bg-white/70 p-3">
		<div class="grid grid-cols-11">
			<label class="col-span-5 content-center font-medium text-gray-900">
				<i class="inline-block">
					<TrainLightrailFrontIcon></TrainLightrailFrontIcon>
				</i>
				{$t('common.carriageCode')}
			</label>

			<input
				type="text"
				class="col-span-6 p-0.5"
				maxlength="4"
				autocomplete="off"
				required
				bind:value={inputs.carriage}
				oninput={() => {
					inputs.carriage = inputs.carriage.toUpperCase();
				}}
			/>
		</div>

		<div class="grid grid-cols-11">
			<label class="col-span-5 content-center font-medium text-gray-900">
				<i class="inline-block">
					<DoorColsedIcon></DoorColsedIcon>
				</i>
				{$t('common.doorCode')}
			</label>

			<div class="col-span-6 flex flex-col gap-2 text-start">
				<div class="flex gap-x-2">
					{#each ['D', 'U', 'A', 'B'] as side}
						<button
							type="button"
							class="border-chestnut-rose-400 w-7 rounded border"
							class:bg-chestnut-rose-400={inputs.sides == side}
							class:text-white={inputs.sides == side}
							onclick={() => {
								inputs.sides = inputs.sides == side ? null : (side as typeof inputs.sides);
							}}
						>
							{side}
						</button>
					{/each}
				</div>

				<div class="flex gap-x-2">
					{#each [1, 2, 3, 4, 5] as i}
						<button
							type="button"
							class="border-chestnut-rose-400 w-7 rounded border"
							class:bg-chestnut-rose-400={inputs.door === i}
							class:text-white={inputs.door === i}
							onclick={() => {
								inputs.door = inputs.door == i ? null : (i as typeof inputs.door);
							}}
						>
							{i}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<div class="grid grid-cols-11">
			<label class="col-span-5 content-center font-medium text-gray-900">
				<i class="inline-block">
					<ArrowLeftRight></ArrowLeftRight>
				</i>
				{$t('common.flipDirection')}
			</label>

			<div class="col-span-6">
				<input type="checkbox" bind:checked={inputs.flip} />
			</div>
		</div>
	</form>

	{#if results.length > 0}
		<div class="flex flex-col gap-y-4 rounded-lg bg-white/70 p-2" transition:slide>
			{#each results as result}
				{@const lineColor = lines[result.line as keyof typeof lines]['color']}

				<div class="flex flex-col gap-y-2 rounded border border-gray-200 p-2">
					<div class="flex items-center gap-x-4">
						<span
							class="h-6 rounded-sm bg-blue-100 px-2 text-nowrap"
							style:background-color={lineColor}
							style:color={textColor(lineColor)}
						>
							{$t(`line.${result.line}`)}
						</span>

						<p>
							{#if inputs.flip}
								{`${destination(result.line, 'DOWN')} → ${destination(result.line, 'UP')}`}
							{:else}
								{`${destination(result.line, 'UP')} → ${destination(result.line, 'DOWN')}`}
							{/if}
						</p>
					</div>

					<div>
						<p class="content-center text-center">
							{$t('common.carNumber', {
								number: inputs.flip
									? result.carNumber
									: result.stock.length - (result.carNumber % 8) + 1
							} as any)}
						</p>

						<div
							class="flex h-34 w-full flex-col justify-between rounded border-y-2 py-1"
							style:border-color={lineColor}
						>
							{#snippet door(active: boolean)}
								<div
									class="relative flex"
									style:background-color={active ? `${lineColor}60` : null}
								>
									<div
										class="h-9 w-4 rounded-s-xs border-y border-s"
										style:border-color={lineColor}
									></div>
									<div
										class="h-9 w-4 rounded-e-xs border-y border-e"
										style:border-color={lineColor}
									></div>

									<!-- door slit -->
									<div
										class="absolute left-1/2 h-9 w-[1px]"
										style:background-color={lineColor}
									></div>
									<!-- window -->
									<div class="absolute top-1 left-1 h-3.5 w-2 rounded-xs border"></div>
									<div class="absolute top-1 right-1 h-3.5 w-2 rounded-xs border"></div>
								</div>
							{/snippet}

							<div class="flex justify-around">
								{#each doors(result.line as keyof typeof lines, inputs.carriage).toReversed() as i}
									{@render door(
										(['D', 'A'].includes(inputs.sides ?? '') && inputs.door === i) ||
											(!inputs.sides && inputs.door === i)
									)}
								{/each}
							</div>

							<!-- direction marker -->
							<div class="flex justify-between text-xs">
								<div class="col-span-2">
									<p>
										<span class="text-glacier-600 font-semibold">
											← {destination(result.line, 'UP')}
										</span>
									</p>
								</div>

								<div class="col-span-2 text-end">
									<p>
										<span class="text-glacier-600 font-semibold">
											{destination(result.line, 'DOWN')} →
										</span>
									</p>
								</div>
							</div>

							<div class="flex justify-around">
								{#each doors(result.line as keyof typeof lines, inputs.carriage).toReversed() as i}
									{@render door(
										(['U', 'B'].includes(inputs.sides ?? '') && inputs.door === i) ||
											(!inputs.sides && inputs.door === i)
									)}
								{/each}
							</div>
						</div>
					</div>

					<div class="flex justify-around gap-x-0.5">
						{#each result.stock as stock}
							<button
								class="rounded-xs border px-0.5 font-mono text-[0.7rem]"
								style:background-color={inputs.carriage == stock ? lineColor : ''}
								style:color={inputs.carriage == stock ? textColor(lineColor) : ''}
								style:border-color={lineColor}
							>
								{stock}
							</button>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
