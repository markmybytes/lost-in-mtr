<script lang="ts">
	import lines from '$lib/data/lines.json';
	import { t } from '$lib/i18n/translations';
	import ArrowLeftRightIcon from '$lib/icons/ArrowLeftRightIcon.svelte';
	import ClipboardIcon from '$lib/icons/ClipboardIcon.svelte';
	import SymmetryVerticalIcon from '$lib/icons/SymmetryVerticalIcon.svelte';
	import TelegramIcon from '$lib/icons/TelegramIcon.svelte';
	import WhatsappIcon from '$lib/icons/WhatsappIcon.svelte';
	import { textColor } from '$lib/utils';
	import Door from '$lib/components/result/Door.svelte';
	import type { PageProps } from './$types';
	import { Fleet } from '$lib/data';
	import { slide, fly } from 'svelte/transition';

	let { data }: PageProps = $props();

	let inbound: boolean = $state(data.params.inbound);

	let flip: boolean = $state(false);

	let showSticker: boolean = $state(false);

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
		return terminal(inbound ? 'UP' : 'DOWN');
	});

	const doorPosition = $derived.by(() => {
		if (door.number === null || door.side === null || door.number > doorCount) {
			return null;
		}

		if (
			!['AEL', 'DRL', 'EAL', 'TCL', 'TML'].includes(data.params.line) &&
			((data.stockName == '現代化列車' && [1, 4, 7].includes(carNumberAbs)) ||
				(data.stockName == '南港島綫中國長春製列車' && carNumberAbs == 3) ||
				(data.stockName != '現代化列車' && [1, 2, 4, 6].includes(carNumberAbs)))
		) {
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

	function terminal(direction: 'UP' | 'DOWN') {
		return lines[data.params.line]['terminals'][direction]
			.map((s) => $t(`station.${s}`))
			.join($t('common./'));
	}
</script>

<div class="flex h-full flex-col gap-y-3">
	<div class="flex h-full min-h-72 flex-col gap-y-3 rounded bg-white p-2">
		<div class="flex h-0 grow flex-col gap-y-5 overflow-y-auto">
			<div class="flex items-center justify-between gap-x-3">
				<div class="flex min-w-0 gap-x-2">
					<span
						class="h-6 rounded-sm bg-blue-100 px-2 text-nowrap"
						style:background-color={lineColor}
						style:color={textColor(lineColor)}
					>
						{$t(`line.${data.params.line}`)}
					</span>

					<p class=" min-w-0 items-center truncate">
						{`${$t('common.to')} ${destination}`}
					</p>
				</div>
			</div>
			{#if !showSticker}
				<div in:slide>
					<div>
						<p class="content-center text-center">
							{$t('common.carNumber', { number: carNumber } as any)}
						</p>

						<div
							class="flex h-50 w-full flex-col justify-between rounded border-2 px-2 py-1"
							class:flex-col-reverse={flip}
							style:border-color={lineColor}
							style:border-left-color={carNumberAbs == (flip ? data.formation.length : 1)
								? lineColor
								: 'transparent'}
							style:border-right-color={carNumberAbs == (flip ? 1 : data.formation.length)
								? lineColor
								: 'transparent'}
						>
							<div class="flex justify-around" class:flex-row-reverse={flip}>
								{#each Array(doorCount).keys() as i}
									<Door
										active={doorPosition?.side == 'L' && doorPosition.index == i}
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
												{terminal('UP')}
											</span>
										</p>
									</div>

									<div class="col-span-2 text-end" class:text-start={flip}>
										<p class="text-xs">{$t('common.downDirection')}</p>
										<p>
											<span class="font-semibold">
												{terminal('DOWN')}
											</span>
										</p>
									</div>
								</div>

								<span>→</span>
							</div>

							<div class="flex justify-around" class:flex-row-reverse={flip}>
								{#each Array(doorCount).keys() as i}
									<Door
										active={doorPosition?.side == 'R' && doorPosition.index == i}
										color={lineColor}
									></Door>
								{/each}
							</div>
						</div>
					</div>

					<div
						class="mt-2 flex justify-around gap-x-0.5 overflow-y-auto"
						class:flex-row-reverse={flip}
					>
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
			{:else}
				<div class="w-full max-w-sm self-center" in:fly>
					<div
						class="relative flex h-72 items-center justify-center rounded-t-xl bg-[#e8e8e8] font-bold text-[#0e253a]"
					>
						<p>
							<span class="text-[198px]">{carNumber}</span>
							<span class="text-[168px]">-</span>
							<span class="text-[148px]">{doorPosition ? doorPosition.index + 1 : 'x'}</span>
						</p>
					</div>
					<div
						class="flex flex-col items-center justify-center rounded-b-xl bg-[#0e253a] py-3 text-[#e8e8e8]"
					>
						<p class="flex w-full text-5xl">
							<span class="w-2/5 text-end">車廂</span>
							<span class="w-1/5 text-center">—</span>
							<span class="w-2/5">車門</span>
						</p>
						<p class="flex w-full justify-center text-4xl">
							<span class="w-2/5 text-end">Car</span>
							<span class="w-1/5 text-center">—</span>
							<span class="w-2/5">Door</span>
						</p>
					</div>
				</div>
			{/if}
		</div>

		<div class="border-t border-gray-200 pt-3 pb-1">
			<div class="flex flex-wrap justify-between text-sm">
				<div>
					<div class="inline-flex items-center gap-2">
						<label for="switch-component-on" class="cursor-pointer text-sm text-slate-600">
							{$t('common.carriage')}
						</label>

						<div class="relative inline-block h-5 w-11">
							<input
								id="switch-component-on"
								type="checkbox"
								class="peer checked:bg-new-orleans-300 h-5 w-11 cursor-pointer appearance-none rounded-full bg-slate-100 transition-colors duration-500"
								onchange={() => (showSticker = !showSticker)}
							/>
							<label
								for="switch-component-on"
								class="absolute top-0 left-0 h-5 w-5 cursor-pointer rounded-full border border-slate-300 bg-white shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800"
							>
							</label>
						</div>

						<label for="switch-component-on" class="cursor-pointer text-sm text-slate-600">
							{$t('common.platformDoorSticker')}
						</label>
					</div>
				</div>

				<div class="flex gap-x-4">
					<button
						class="bg-new-orleans-300 flex h-6 items-center gap-x-2 rounded px-1 text-center text-gray-800"
						onclick={() => (inbound = !inbound)}
					>
						<ArrowLeftRightIcon width={13} height={13}></ArrowLeftRightIcon> 調頭
					</button>

					<button
						class="bg-new-orleans-300 flex h-6 items-center gap-x-2 rounded px-1.5 text-center text-gray-800"
						onclick={() => (flip = !flip)}
					>
						<SymmetryVerticalIcon width={13} height={13}></SymmetryVerticalIcon>
					</button>
				</div>
			</div>
		</div>
	</div>

	<div class="flex min-h-24 flex-col justify-center gap-y-3 rounded bg-white p-2">
		<div class="grid grid-cols-10 items-center gap-2">
			<div class="col-span-4 flex">
				<p class="flex items-center gap-x-2 font-medium text-gray-900">
					{$t('common.doorNo')}
				</p>
			</div>

			<div class="col-span-6 flex flex-col gap-y-2">
				<div class="flex gap-x-2">
					{#each ['EAL', 'TML'].includes(data.params.line) ? ['U', 'D'] : ['A', 'B'] as side}
						<button
							type="button"
							class="h-6.5 w-7 rounded border"
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
							class="h-6.5 w-7 rounded border"
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
</div>
