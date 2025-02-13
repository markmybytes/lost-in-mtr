<script lang="ts">
	import { t } from '$lib/i18n/translations';
	import { textColor } from '$lib/utils';
	import lines from '$lib/data/lines.json';
	import Door from './door.svelte';
	import ArrowLeftRight from '$lib/icons/ArrowLeftRight.svelte';
	import { fade } from 'svelte/transition';
	import ClipboardIcon from '$lib/icons/ClipboardIcon.svelte';

	let props: {
		line: keyof typeof lines;
		position: number;
		formation: Array<string>;
		codes: {
			carriage: string;
			sides: null | 'U' | 'D' | 'A' | 'B';
			door: null | 1 | 2 | 3 | 4 | 5;
		};
	} = $props();

	const lineColor = lines[props.line]['color'];

	/** Train driection, `true` means up/inbound direction otherwise down/outbound direction */
	let inbound: boolean = $state(false);

	let doors = $derived.by(() => {
		if ((props.line == 'EAL' && props.codes.carriage.includes('F')) || props.line == 'AEL') {
			return [1, 2];
		} else {
			return [1, 2, 3, 4, 5];
		}
	});

	let doorNumber = $derived.by(() => {
		if (!props.codes.door) {
			return null;
		}

		return inbound ? ((5 - props.codes.door) % 5) + 1 : props.codes.door;
	});

	let carNumber = $derived(
		inbound
			? props.position
			: ((props.formation.length - props.position) % props.formation.length) + 1
	);

	let destination = $derived.by(() => {
		return lines[props.line]['terminals'][inbound ? 'UP' : 'DOWN']
			.map((s) => $t(`station.${s}`))
			.join('／');
	});
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
				onclick={() => (inbound = !inbound)}
			>
				<ArrowLeftRight width={13} height={13}></ArrowLeftRight>
			</button>

			<p>
				{`${$t('common.to')} ${destination}`}
			</p>
		</div>
	</div>

	<div>
		<p class="content-center text-center">
			{$t('common.carNumber', { number: carNumber } as any)}
		</p>

		<div
			class="flex h-34 w-full flex-col justify-between rounded border-y-2 px-2 py-1"
			class:border-s-2={props.position == 1}
			class:border-e-2={props.position == props.formation.length}
			style:border-color={lineColor}
		>
			<div class="flex justify-around">
				{#each doors.toReversed() as i}
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
							← {$t(`station.${lines[props.line]['terminals']['UP']}`)}
						</span>
					</p>
				</div>

				<div class="col-span-2 text-end">
					<p>
						<span class="text-glacier-600 font-semibold">
							{$t(`station.${lines[props.line]['terminals']['DOWN']}`)} →
						</span>
					</p>
				</div>
			</div>

			<div class="flex justify-around">
				{#each doors.toReversed() as i}
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

	<div class="mt-3 flex gap-x-3">
		<p class="text-glacier-500/80 text-xs md:text-sm">
			<span>㊢ </span>
			<span>
				{`${$t('common.positionDescrTxt', { name: destination, car: carNumber, door: doorNumber || -1 } as any)}`}
			</span>
		</p>

		<button
			type="button"
			onclick={() => {
				navigator.clipboard.writeText(
					`${$t('common.positionDescrTxt', { name: destination, car: carNumber, door: doorNumber || -1 } as any)}`
				);
			}}
		>
			<ClipboardIcon width={12} height={12}></ClipboardIcon>
		</button>
	</div>
</div>
