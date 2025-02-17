<script lang="ts">
	import lines from '$lib/data/lines.json';
	import DoorColsedIcon from '$lib/icons/DoorColsedIcon.svelte';
	import TrainLightrailFrontIcon from '$lib/icons/TrainLightrailFrontIcon.svelte';
	import { t } from '$lib/i18n/translations';
	import Line from './components/line.svelte';
	import { onMount } from 'svelte';
	import CarriageInput from './components/CarriageInput.svelte';

	let fleets: { [key: string]: any } = $state({});

	const inputs: {
		carriage: string;
		sides: null | 'U' | 'D' | 'A' | 'B';
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
		for (const [line, stocks] of Object.entries(fleets)) {
			for (const stock of stocks) {
				const stockArr = stock.split(/[-\+]+/);
				if (stockArr.includes(inputs.carriage)) {
					matches.push({
						line: line as keyof typeof lines,
						position: stockArr.indexOf(inputs.carriage) + 1,
						formation: stockArr
					});
				}
			}
		}

		return matches;
	});

	onMount(() => {
		fetch(
			'https://raw.githubusercontent.com/SuperDumbTM/lost-in-mtr/refs/heads/data/fleet.min.json'
		)
			.then((response) => response.json())
			.then((body) => {
				fleets = body;
			});
	});
</script>

<div class="flex h-full flex-col gap-y-4 sm:flex-col-reverse">
	<div class="flex h-0 grow flex-col gap-y-4 overflow-y-auto rounded-lg bg-white/70 p-2">
		{#each results as result}
			<Line {...result} codes={{ ...inputs }}></Line>
		{/each}
	</div>

	<form class="flex h-34 flex-col justify-center gap-y-4 rounded-lg bg-white/70 p-3">
		<div class="grid grid-cols-11">
			<label class="col-span-5 content-center font-medium text-gray-900">
				<i class="inline-block">
					<TrainLightrailFrontIcon></TrainLightrailFrontIcon>
				</i>
				{$t('common.carriageCode')}
			</label>

			<CarriageInput
				bind:value={inputs.carriage}
				options={new Set(
					Object.values(fleets).flatMap((l: Array<string>) => l.flatMap((s) => s.split('-')))
				)}
			></CarriageInput>
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
							class="w-7 rounded border"
							class:bg-new-orleans-700={inputs.sides == side}
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
							class="w-7 rounded border"
							class:bg-new-orleans-700={inputs.door === i}
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
</div>
