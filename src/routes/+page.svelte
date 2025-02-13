<script lang="ts">
	import lines from '$lib/data/lines.json';
	import carriage from '$lib/data/carriage.json';
	import DoorColsedIcon from '$lib/icons/DoorColsedIcon.svelte';
	import TrainLightrailFrontIcon from '$lib/icons/TrainLightrailFrontIcon.svelte';
	import { textColor } from '$lib/utils/index';
	import { fade, slide } from 'svelte/transition';

	const inputs: {
		carriage: string;
		sides: null | 'U' | 'D';
		door: null | 1 | 2 | 3 | 4 | 5;
	} = $state({
		carriage: '',
		sides: null,
		door: null
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
	<form class="flex flex-col gap-y-4 p-3 bg-white/70 rounded-lg">
		<div class="flex">
			<label class="flex gap-x-2 items-center w-38 text-sm font-medium text-gray-900" for="name">
				<TrainLightrailFrontIcon></TrainLightrailFrontIcon>
				車廂編號
			</label>
			<input
				type="text"
				name="car_number"
				class="w-full p-1.5 text-sm shadow-xs"
				maxlength="4"
				autocomplete="off"
				required
				bind:value={inputs.carriage}
				oninput={() => {
					inputs.carriage = inputs.carriage.toUpperCase();
				}}
			/>
		</div>

		<div class="flex">
			<label class="flex gap-x-2 items-center w-38 text-sm font-medium text-gray-900" for="name">
				<DoorColsedIcon></DoorColsedIcon>
				車門編號
			</label>

			<div class="flex flex-col gap-y-2 w-full gap-x-2 text-start">
				<div class="flex gap-x-2">
					{#each ['D', 'U'] as side}
						<button
							type="button"
							class="w-7 border border-chestnut-rose-400 rounded"
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
							class="w-7 border border-chestnut-rose-400 rounded"
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
	</form>

	{#if results.length > 0}
		<div class="flex flex-col gap-y-6 p-3 bg-white/70 rounded-lg" transition:slide>
			{#each results as result}
				{@const lineColor = lines[result.line as keyof typeof lines]['color']}

				<div class="flex flex-col gap-y-2">
					<div class="flex justify-center gap-x-4">
						<span
							class="bg-blue-100 px-2 rounded-sm"
							style:background-color={lineColor}
							style:color={textColor(lineColor)}
						>
							{result.line}
						</span>
						<p class="content-center">第{result.carNumber}卡</p>
					</div>

					<div class="flex justify-between">
						<div>
							<p class="text-sm">下行</p>
							<p>
								<span class="text-glacier-600 font-semibold">
									{lines[result.line as keyof typeof lines]['terminals']['DOWN']}
								</span>方向
							</p>
						</div>

						<div>
							<p class="text-sm text-end">上行</p>
							<p>
								<span class="text-glacier-600 font-semibold">
									{lines[result.line as keyof typeof lines]['terminals']['UP']}
								</span>方向
							</p>
						</div>
					</div>

					<div
						class="flex flex-col justify-between w-full h-32 py-1 border-y-2 rounded"
						style:border-color={lineColor}
					>
						{#snippet door(active: boolean)}
							<div class="flex relative" style:background-color={active ? `${lineColor}60` : null}>
								<div
									class="w-4 h-9 border-s border-y rounded-s-xs"
									style:border-color={lineColor}
								></div>
								<div
									class="w-4 h-9 border-e border-y rounded-e-xs"
									style:border-color={lineColor}
								></div>

								<!-- door slit -->
								<div class="absolute left-1/2 w-[1px] h-9" style:background-color={lineColor}></div>
								<!-- window -->
								<div class="absolute top-1 left-1 w-2 h-3.5 border rounded-xs"></div>
								<div class="absolute top-1 right-1 w-2 h-3.5 border rounded-xs"></div>
							</div>
						{/snippet}

						<div class="flex justify-around">
							{#each doors(result.line as keyof typeof lines, inputs.carriage) as i}
								{@render door(
									(inputs.sides == 'U' && inputs.door === i) || (!inputs.sides && inputs.door === i)
								)}
							{/each}
						</div>

						<div class="flex justify-around">
							{#each doors(result.line as keyof typeof lines, inputs.carriage) as i}
								{@render door(
									(inputs.sides == 'D' && inputs.door === i) || (!inputs.sides && inputs.door === i)
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
