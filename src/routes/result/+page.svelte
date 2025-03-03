<script lang="ts">
	import lines from '$lib/data/lines.json';
	import { t } from '$lib/i18n/translations';
	import ArrowLeftRightIcon from '$lib/icons/ArrowLeftRightIcon.svelte';
	import ClipboardIcon from '$lib/icons/ClipboardIcon.svelte';
	import DoorColsedIcon from '$lib/icons/DoorColsedIcon.svelte';
	import SymmetryVerticalIcon from '$lib/icons/SymmetryVerticalIcon.svelte';
	import TelegramIcon from '$lib/icons/TelegramIcon.svelte';
	import WhatsappIcon from '$lib/icons/WhatsappIcon.svelte';
	import { textColor } from '$lib/utils';
	import Door from './Door.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	/** Train driection, `true` means up/inbound direction otherwise down/outbound direction */
	let inbound: boolean = $state(false);

	let flip: boolean = $state(false);

	const door: { side: null | 'U' | 'D' | 'A' | 'B'; number: null | 1 | 2 | 3 | 4 | 5 } = $state({
		side: null,
		number: null
	});

	const lineColor = lines[data.params.line as keyof typeof lines]['color'];

	const doors = $derived.by(() => {
		if (
			(data.params.line == 'EAL' && data.params.stockNumber.includes('F')) ||
			data.params.line == 'AEL'
		) {
			return [2, 1];
		} else if (data.params.line == 'DRL') {
			return [3, 2, 1];
		} else {
			return [5, 4, 3, 2, 1];
		}
	});

	const doorNumber = $derived.by(() => {
		if (!door.number || door.number > doors.length) {
			return null;
		}

		return inbound ? ((5 - door.number) % 5) + 1 : door.number;
	});

	const position = data.formation.indexOf(data.params.stockNumber) + 1;

	const carNumber = $derived.by(() => {
		return inbound ? position : ((data.formation.length - position) % data.formation.length) + 1;
	});

	const destination = $derived.by(() => {
		return lines[data.params.line as keyof typeof lines]['terminals'][inbound ? 'UP' : 'DOWN']
			.map((s) => $t(`station.${s}`))
			.join($t('common./'));
	});

	const description = $derived(
		`${$t('common.positionDescrTxt', { name: destination, car: carNumber, door: doorNumber || -1 } as any)}`
	);
</script>

<div class="flex h-full flex-col gap-y-3">
	<div class="flex h-0 grow flex-col gap-y-5 overflow-y-auto rounded bg-white p-2">
		<div class="flex items-center justify-between gap-x-3">
			<div class="flex min-w-0 gap-x-2">
				<span
					class="h-6 rounded-sm bg-blue-100 px-2 text-nowrap"
					style:background-color={lineColor}
					style:color={textColor(lineColor)}
				>
					{$t(`line.${data.params.line}`)}
				</span>

				<div class="flex min-w-0 items-center">
					<button
						class="me-1 h-5 rounded bg-gray-300 px-1 text-center text-gray-600"
						onclick={() => (inbound = !inbound)}
					>
						<ArrowLeftRightIcon width={13} height={13}></ArrowLeftRightIcon>
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
			<div>
				<p class="content-center text-center">
					{$t('common.carNumber', { number: carNumber } as any)}
				</p>

				<div
					class="flex h-50 w-full flex-col justify-between rounded border-y-2 px-2 py-1"
					class:flex-col-reverse={flip}
					class:border-s-2={position == 1}
					class:border-e-2={position == data.formation.length}
					style:border-color={lineColor}
				>
					<div class="flex justify-around" class:flex-row-reverse={flip}>
						{#each doors as i}
							<Door
								active={(['D', 'B'].includes(door.side ?? '') && door.number === i) ||
									(!door.side && door.number === i)}
								color={lineColor}
							></Door>
						{/each}
					</div>

					<!-- direction marker -->
					<div class="text-battleship-gray-700 flex items-center justify-between gap-x-2">
						<span>←</span>

						<div
							class="flex grow justify-between"
							class:flex-row-reverse={flip}
							class:text-end={flip}
						>
							<div class="col-span-2">
								<p class="text-xs">{$t('common.upDirection')}</p>
								<p>
									<span class=" font-semibold">
										{lines[data.params.line as keyof typeof lines]['terminals']['UP']
											.map((s) => $t(`station.${s}`))
											.join($t('common./'))}
									</span>
								</p>
							</div>

							<div class="col-span-2 text-end" class:text-start={flip}>
								<p class="text-xs">{$t('common.downDirection')}</p>
								<p>
									<span class="font-semibold">
										{lines[data.params.line as keyof typeof lines]['terminals']['DOWN']
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
								active={(['U', 'A'].includes(door.side ?? '') && door.number === i) ||
									(!door.side && door.number === i)}
								color={lineColor}
							></Door>
						{/each}
					</div>
				</div>
			</div>

			<div class="mt-2 flex justify-around gap-x-0.5 overflow-y-auto" class:flex-row-reverse={flip}>
				{#each data.formation as stock}
					<button
						class="rounded-xs border px-0.5 font-mono text-[0.7rem]"
						style:background-color={data.params.stockNumber == stock ? lineColor : ''}
						style:color={data.params.stockNumber == stock ? textColor(lineColor) : ''}
						style:border-color={lineColor}
					>
						{stock}
					</button>
				{/each}
			</div>
		</div>

		<hr class="border-new-orleans-300" />

		<div class="flex flex-col gap-x-3">
			<p class="text-battleship-gray-600">
				<span class="font-bold">㊢&nbsp;</span>
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

	<div class="flex min-h-24 items-center justify-between gap-x-2 rounded bg-white p-2">
		<label class="font-medium text-gray-900">
			<i class="inline-block">
				<DoorColsedIcon></DoorColsedIcon>
			</i>
			{$t('common.doorNo')}
		</label>

		<div class="flex min-w-44 flex-col gap-y-3 text-start">
			<div class="flex gap-x-2">
				{#each ['U', 'D', 'A', 'B'] as side}
					<button
						type="button"
						class="w-7 rounded border"
						class:bg-new-orleans-700={door.side == side}
						class:text-white={door.side == side}
						onclick={() => {
							door.side = door.side == side ? null : (side as typeof door.side);
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
						class:bg-new-orleans-700={door.number === i}
						class:text-white={door.number === i}
						onclick={() => {
							door.number = door.number == i ? null : (i as typeof door.number);
						}}
					>
						{i}
					</button>
				{/each}
			</div>
		</div>
	</div>
</div>
