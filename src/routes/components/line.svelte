<script lang="ts">
	import { t } from '$lib/i18n/translations';
	import { textColor } from '$lib/utils';
	import lines from '$lib/data/lines.json';
	import Door from './door.svelte';
	import ArrowLeftRight from '$lib/icons/ArrowLeftRight.svelte';
	import { fade } from 'svelte/transition';

	let props: {
		line: keyof typeof lines;
		carNumber: number;
		formation: Array<string>;
		codes: {
			carriage: string;
			sides: null | 'U' | 'D' | 'A' | 'B';
			door: null | 1 | 2 | 3 | 4 | 5;
		};
	} = $props();

	const lineColor = lines[props.line]['color'];

	let opposite: boolean = $state(false);

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

<div class="flex flex-col gap-y-2 rounded border border-gray-200 p-2" transition:fade>
	<div class="flex items-center gap-x-3">
		<span
			class="h-6 rounded-sm bg-blue-100 px-2 text-nowrap"
			style:background-color={lineColor}
			style:color={textColor(lineColor)}
		>
			{$t(`line.${props.line}`)}
		</span>

		<div class="flex items-center">
			<button
				class="me-1 h-5 rounded bg-gray-300 px-1 text-center text-gray-600"
				onclick={() => (opposite = !opposite)}
			>
				<ArrowLeftRight width={13} height={13}></ArrowLeftRight>
			</button>

			<p>
				{#if opposite}
					{`${destination(props.line, 'DOWN')} → ${destination(props.line, 'UP')}`}
				{:else}
					{`${destination(props.line, 'UP')} → ${destination(props.line, 'DOWN')}`}
				{/if}
			</p>
		</div>
	</div>

	<div>
		<p class="content-center text-center">
			{$t('common.carNumber', {
				number: opposite
					? props.carNumber
					: ((props.formation.length - props.carNumber) % props.formation.length) + 1
			} as any)}
		</p>

		<div
			class="flex h-34 w-full flex-col justify-between rounded border-y-2 py-1"
			style:border-color={lineColor}
		>
			<div class="flex justify-around">
				{#each doors(props.line as keyof typeof lines, props.codes.carriage).toReversed() as i}
					<Door
						active={(['D', 'A'].includes(props.codes.sides ?? '') && props.codes.door === i) ||
							(!props.codes.sides && props.codes.door === i)}
						color={lineColor}
					></Door>
				{/each}
			</div>

			<!-- direction marker -->
			<div class="flex justify-between text-xs">
				<div class="col-span-2">
					<p>
						<span class="text-glacier-600 font-semibold">
							← {destination(props.line, 'UP')}
						</span>
					</p>
				</div>

				<div class="col-span-2 text-end">
					<p>
						<span class="text-glacier-600 font-semibold">
							{destination(props.line, 'DOWN')} →
						</span>
					</p>
				</div>
			</div>

			<div class="flex justify-around">
				{#each doors(props.line as keyof typeof lines, props.codes.carriage).toReversed() as i}
					<Door
						active={(['U', 'B'].includes(props.codes.sides ?? '') && props.codes.door === i) ||
							(!props.codes.sides && props.codes.door === i)}
						color={lineColor}
					></Door>
				{/each}
			</div>
		</div>
	</div>

	<div class="flex justify-around gap-x-0.5">
		{#each props.formation as stock}
			<button
				class="rounded-xs border px-0.5 font-mono text-[0.7rem]"
				style:background-color={props.codes.carriage == stock ? lineColor : ''}
				style:color={props.codes.carriage == stock ? textColor(lineColor) : ''}
				style:border-color={lineColor}
			>
				{stock}
			</button>
		{/each}
	</div>
</div>
