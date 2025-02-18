<script lang="ts">
	import { t } from '$lib/i18n/translations';
	import { textColor } from '$lib/utils';
	import lines from '$lib/data/lines.json';
	import Door from './Door.svelte';
	import ArrowLeftRight from '$lib/icons/ArrowLeftRight.svelte';
	import { fade } from 'svelte/transition';
	import ClipboardIcon from '$lib/icons/ClipboardIcon.svelte';
	import WhatsappIcon from '$lib/icons/WhatsappIcon.svelte';
	import TelegramIcon from '$lib/icons/TelegramIcon.svelte';
	import SymmetryVerticalIcon from '$lib/icons/SymmetryVerticalIcon.svelte';

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

	/** Train driection, `true` means up/inbound direction otherwise down/outbound direction */
	let inbound: boolean = $state(false);

	let flip: boolean = $state(false);

	// if matching results are updated and the fade-out transition is still in progress,
	// the DOM component will be reused, which the line color will not be updated.
	//
	// use $derived can make svelete react to the update
	const lineColor = $derived(lines[props.line]['color']);

	const doors = $derived.by(() => {
		if ((props.line == 'EAL' && props.codes.carriage.includes('F')) || props.line == 'AEL') {
			return [2, 1];
		} else if (props.line == 'DRL') {
			return [3, 2, 1];
		} else {
			return [5, 4, 3, 2, 1];
		}
	});

	const doorNumber = $derived.by(() => {
		if (!props.codes.door || props.codes.door > doors.length) {
			return null;
		}

		return inbound ? ((5 - props.codes.door) % 5) + 1 : props.codes.door;
	});

	const carNumber = $derived(
		inbound
			? props.position
			: ((props.formation.length - props.position) % props.formation.length) + 1
	);

	const destination = $derived.by(() => {
		return lines[props.line]['terminals'][inbound ? 'UP' : 'DOWN']
			.map((s) => $t(`station.${s}`))
			.join($t('common./'));
	});

	const description = $derived(
		`${$t('common.positionDescrTxt', { name: destination, car: carNumber, door: doorNumber || -1 } as any)}`
	);

	function appenArrow(direction: 'UP' | 'DOWN') {
		let text = lines[props.line]['terminals'][direction]
			.map((s) => $t(`station.${s}`))
			.join($t('common./'));

		if (!flip) {
			return direction == 'UP' ? `← ${text}` : `${text} →`;
		} else {
			return direction == 'UP' ? `${text} →` : `← ${text}`;
		}
	}
</script>

<div class="flex flex-col gap-y-2 rounded border border-gray-200 p-2" transition:fade>
	<div class="flex items-center justify-between gap-x-3">
		<div class="flex min-w-0 gap-x-2">
			<span
				class="h-6 rounded-sm bg-blue-100 px-2 text-nowrap"
				style:background-color={lineColor}
				style:color={textColor(lineColor)}
			>
				{$t(`line.${props.line}`)}
			</span>

			<div class="flex min-w-0 items-center">
				<button
					class="me-1 h-5 rounded bg-gray-300 px-1 text-center text-gray-600"
					onclick={() => (inbound = !inbound)}
				>
					<ArrowLeftRight width={13} height={13}></ArrowLeftRight>
				</button>

				<p class="truncate">
					{`${$t('common.to')} ${destination}`}
				</p>
			</div>
		</div>

		<button type="button" onclick={() => (flip = !flip)}>
			<SymmetryVerticalIcon></SymmetryVerticalIcon>
		</button>
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
			<div class="flex justify-around" class:flex-row-reverse={flip}>
				{#each doors as i}
					<Door
						active={(['D', 'B'].includes(props.codes.sides ?? '') && props.codes.door === i) ||
							(!props.codes.sides && props.codes.door === i)}
						color={lineColor}
					></Door>
				{/each}
			</div>

			<!-- direction marker -->
			<div class="text-battleship-gray-700 flex justify-between gap-x-1 text-xs">
				<span>←</span>

				<div class="flex grow justify-between" class:flex-row-reverse={flip}>
					<div class="col-span-2">
						<p>
							<span class=" font-semibold">
								{lines[props.line]['terminals']['UP']
									.map((s) => $t(`station.${s}`))
									.join($t('common./'))}
							</span>
						</p>
					</div>

					<div class="col-span-2 text-end">
						<p>
							<span class="font-semibold">
								{lines[props.line]['terminals']['DOWN']
									.map((s) => $t(`station.${s}`))
									.join($t('common./'))}
							</span>
						</p>
					</div>
				</div>

				<span>→</span>
			</div>

			<div class="flex justify-around" class:flex-row-reverse={flip}>
				{#each doors as i}
					<Door
						active={(['U', 'A'].includes(props.codes.sides ?? '') && props.codes.door === i) ||
							(!props.codes.sides && props.codes.door === i)}
						color={lineColor}
					></Door>
				{/each}
			</div>
		</div>
	</div>

	<div class="flex justify-around gap-x-0.5 overflow-y-auto" class:flex-row-reverse={flip}>
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

	<div class="mt-1 flex flex-col gap-x-3">
		<p class="text-battleship-gray-400 text-[0.8rem] md:text-sm">
			<span>㊢ </span>
			<span>
				{description}
			</span>
		</p>

		<div class="flex justify-end gap-x-5 p-1">
			<a href={`whatsapp://send?text=${encodeURIComponent(description)}`}>
				<WhatsappIcon></WhatsappIcon>
			</a>

			<a href={`tg://msg?text=${encodeURIComponent(description)}`}>
				<TelegramIcon></TelegramIcon>
			</a>

			<button
				type="button"
				class="cursor-pointer"
				onclick={() => {
					navigator.clipboard.writeText(description);
				}}
			>
				<ClipboardIcon></ClipboardIcon>
			</button>
		</div>
	</div>
</div>
