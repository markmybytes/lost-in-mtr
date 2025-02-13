<script lang="ts">
	import lines from '$lib/data/lines.json';
	import carriage from '$lib/data/carriage.json';
	import DoorColsedIcon from '$lib/icons/DoorColsedIcon.svelte';
	import TrainLightrailFrontIcon from '$lib/icons/TrainLightrailFrontIcon.svelte';
	import { textColor } from '$lib/utils/index';
	import { fade, slide } from 'svelte/transition';
	import { t } from '$lib/i18n/translations';

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
				if (stock.split(/[-\+]+/).includes(inputs.carriage)) {
					matches.push({
						line: line,
						carNumber: stock.split(/[-\+]+/).indexOf(inputs.carriage) + 1,
						stock: stock
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
</script>

<div class="flex flex-col gap-y-4 p-2">
	<form class="flex flex-col gap-y-4 rounded-lg bg-white/70 p-3">
		<div class="flex gap-x-2">
			<label class="flex w-38 items-center gap-x-2 text-sm font-medium text-gray-900" for="name">
				<TrainLightrailFrontIcon></TrainLightrailFrontIcon>
				{$t('common.carriageCode')}
			</label>
			<input
				type="text"
				name="car_number"
				class="grow p-1.5 text-sm shadow-xs"
				maxlength="4"
				autocomplete="off"
				required
				bind:value={inputs.carriage}
				oninput={() => {
					inputs.carriage = inputs.carriage.toUpperCase();
				}}
			/>
		</div>

		<div class="flex gap-x-2">
			<label class="flex w-38 items-center gap-x-2 text-sm font-medium text-gray-900" for="name">
				<DoorColsedIcon></DoorColsedIcon>
				{$t('common.doorCode')}
			</label>

			<div class="flex grow flex-col gap-x-2 gap-y-2 text-start">
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

		<div class="flex gap-x-2">
			<label class="flex w-38 items-center gap-x-2 text-sm font-medium text-gray-900">
				<TrainLightrailFrontIcon></TrainLightrailFrontIcon>
				{$t('common.flipDirection')}
			</label>

			<div class="grow">
				<input type="checkbox" name="flip_direction" class="" bind:checked={inputs.flip} />
			</div>
		</div>
	</form>

	{#if results.length > 0}
		<div class="flex flex-col gap-y-6 rounded-lg bg-white/70 p-3" transition:slide>
			{#each results as result}
				{@const lineColor = lines[result.line as keyof typeof lines]['color']}

				<div class="flex flex-col gap-y-2">
					<div class="flex justify-center gap-x-4">
						<span
							class="rounded-sm bg-blue-100 px-2"
							style:background-color={lineColor}
							style:color={textColor(lineColor)}
						>
							{$t(`line.${result.line}`)}
						</span>
						<p class="content-center">
							{$t('common.carNumber', { number: result.carNumber } as any)}
						</p>
					</div>

					<div class="flex justify-between" class:flex-row-reverse={inputs.flip}>
						<div>
							<p class="text-sm" class:text-end={inputs.flip}>{$t('common.outbound')}</p>
							<p>
								<span class="text-glacier-600 font-semibold">
									{lines[result.line as keyof typeof lines]['terminals']['DOWN']
										.map((s) => $t(`station.${s}`))
										.join('／')}
								</span>{$t('common.direction')}
							</p>
						</div>

						<div>
							<p class="text-sm" class:text-end={!inputs.flip}>{$t('common.inbound')}</p>
							<p>
								<span class="text-glacier-600 font-semibold">
									{lines[result.line as keyof typeof lines]['terminals']['UP']
										.map((s) => $t(`station.${s}`))
										.join('／')}
								</span>{$t('common.direction')}
							</p>
						</div>
					</div>

					<div
						class="flex h-32 w-full flex-col justify-between rounded border-y-2 py-1"
						style:border-color={lineColor}
					>
						{#snippet door(active: boolean)}
							<div class="relative flex" style:background-color={active ? `${lineColor}60` : null}>
								<div
									class="h-9 w-4 rounded-s-xs border-y border-s"
									style:border-color={lineColor}
								></div>
								<div
									class="h-9 w-4 rounded-e-xs border-y border-e"
									style:border-color={lineColor}
								></div>

								<!-- door slit -->
								<div class="absolute left-1/2 h-9 w-[1px]" style:background-color={lineColor}></div>
								<!-- window -->
								<div class="absolute top-1 left-1 h-3.5 w-2 rounded-xs border"></div>
								<div class="absolute top-1 right-1 h-3.5 w-2 rounded-xs border"></div>
							</div>
						{/snippet}

						<div class="flex justify-around" class:flex-row-reverse={inputs.flip}>
							{#each doors(result.line as keyof typeof lines, inputs.carriage) as i}
								{@render door(
									(['U', 'B'].includes(inputs.sides ?? '') && inputs.door === i) ||
										(!inputs.sides && inputs.door === i)
								)}
							{/each}
						</div>

						<div class="flex justify-around" class:flex-row-reverse={inputs.flip}>
							{#each doors(result.line as keyof typeof lines, inputs.carriage) as i}
								{@render door(
									(['D', 'A'].includes(inputs.sides ?? '') && inputs.door === i) ||
										(!inputs.sides && inputs.door === i)
								)}
							{/each}
						</div>
					</div>

					<div class="text-xs">
						列車編組：{result.stock}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
