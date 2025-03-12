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
	import { Fleet } from '$lib/data';

	let { data }: PageProps = $props();

	let inbound: boolean = $state(data.params.inbound);

	let flip: boolean = $state(false);

	const door: TrainDoor = $state(data.params.door);

	const lineColor = lines[data.params.line]['color'];

	const doorCount = Fleet.doorCount(data.params.line, data.params.vehicleNumber);

	/** The absolute car number of the target vehicle, starting from 1 at the "up" side. */
	const carNumberAbs = data.formation.indexOf(data.params.vehicleNumber) + 1;

	/** A derived value representing the adjusted car number based on the vehicle's direction (inbound or outbound). */
	const carNumber = $derived.by(() => {
		return inbound
			? carNumberAbs
			: ((data.formation.length - carNumberAbs) % data.formation.length) + 1;
	});

	const destination = $derived.by(() => {
		return lines[data.params.line]['terminals'][inbound ? 'UP' : 'DOWN']
			.map((s) => $t(`station.${s}`))
			.join($t('common./'));
	});

	const doorPosition = $derived.by(() => {
		const flipped =
			!['EAL', 'TML', 'TCL'].includes(data.params.line) &&
			((data.stockName == '現代化列車' && [1, 3, 4, 6, 7].includes(carNumberAbs)) ||
				(data.stockName == '南港島綫中國長春製列車' && carNumberAbs == 3) ||
				(data.stockName != '現代化列車' && [1, 2, 4, 6].includes(carNumberAbs)));

		if (door.number === null || door.side === null || door.number > doorCount) {
			return null;
		}

		if (flipped) {
			return {
				side: ['U', 'A'].includes(door.side) ? 'L' : 'R',
				index: door.number - 1
			};
		} else {
			return {
				side: ['U', 'A'].includes(door.side) ? 'R' : 'L',
				index: doorCount - door.number
			};
		}
	});

	const description = $derived.by(() => {
		let d = -1;
		if (doorPosition !== null) {
			d = inbound ? doorPosition.index + 1 : doorCount - doorPosition.index;
		}
		return `${$t('common.positionDescrTxt', { name: destination, car: carNumber, door: d } as any)}`;
	});
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
					class="flex h-50 w-full flex-col justify-between rounded border-2 px-2 py-1"
					class:flex-col-reverse={flip}
					style:border-color={lineColor}
					style:border-left-color={carNumberAbs == (flip ? data.formation.length : 0)
						? lineColor
						: 'transparent'}
					style:border-right-color={carNumberAbs == (flip ? 0 : data.formation.length)
						? lineColor
						: 'transparent'}
				>
					<div class="flex justify-around" class:flex-row-reverse={flip}>
						{#each Array(doorCount).keys() as i}
							<Door active={doorPosition?.side == 'L' && doorPosition.index == i} color={lineColor}
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
										{lines[data.params.line]['terminals']['UP']
											.map((s) => $t(`station.${s}`))
											.join($t('common./'))}
									</span>
								</p>
							</div>

							<div class="col-span-2 text-end" class:text-start={flip}>
								<p class="text-xs">{$t('common.downDirection')}</p>
								<p>
									<span class="font-semibold">
										{lines[data.params.line]['terminals']['DOWN']
											.map((s) => $t(`station.${s}`))
											.join($t('common./'))}
									</span>
								</p>
							</div>
						</div>

						<span>→</span>
					</div>

					<div class="flex justify-around" class:flex-row-reverse={flip}>
						{#each Array(doorCount).keys() as i}
							<Door active={doorPosition?.side == 'R' && doorPosition.index == i} color={lineColor}
							></Door>
						{/each}
					</div>
				</div>
			</div>

			<div class="mt-2 flex justify-around gap-x-0.5 overflow-y-auto" class:flex-row-reverse={flip}>
				{#each data.formation as stock}
					<button
						class="rounded-xs border px-0.5 font-mono text-[0.7rem]"
						style:background-color={data.params.vehicleNumber == stock ? lineColor : ''}
						style:color={data.params.vehicleNumber == stock ? textColor(lineColor) : ''}
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
				<span class="me-1 font-bold select-none">㊢</span>
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

	<div class="flex min-h-28 items-center justify-between gap-x-2 rounded bg-white p-2">
		<label class="font-medium text-gray-900">
			<i class="inline-block">
				<DoorColsedIcon></DoorColsedIcon>
			</i>
			{$t('common.doorNo')}
		</label>

		<div class="flex min-w-48 flex-col gap-y-3 text-start">
			<div class="flex gap-x-2">
				{#each ['EAL', 'TML'].includes(data.params.line) ? ['U', 'D'] : ['A', 'B'] as side}
					<button
						type="button"
						class="h-7.5 w-8 rounded border"
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
				<!-- Safari does not support .map calls on ArrayIterator -->
				{#each Array.from(Array(doorCount).keys()).map((c) => c + 1) as i}
					<button
						type="button"
						class="h-7.5 w-8 rounded border"
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
