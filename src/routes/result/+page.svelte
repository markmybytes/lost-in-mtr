<script lang="ts">
	import lines from '$lib/data/lines.json';
	import * as m from '$lib/paraglide/messages';
	import ArrowLeftRightIcon from '$lib/icons/ArrowLeftRightIcon.svelte';
	import ClipboardIcon from '$lib/icons/ClipboardIcon.svelte';
	import SymmetryVerticalIcon from '$lib/icons/SymmetryVerticalIcon.svelte';
	import TelegramIcon from '$lib/icons/TelegramIcon.svelte';
	import WhatsappIcon from '$lib/icons/WhatsappIcon.svelte';
	import { textColor } from '$lib/utils';
	import Door from '$lib/components/result/Door.svelte';
	import type { PageProps } from './$types';
	import { slide, fly } from 'svelte/transition';

	let { data }: PageProps = $props();

	const form = $state({
		inbound: data.params.inbound,
		door: data.params.door,
		flip: false,
		showSticker: false
	});

	/**
	 * The absolute car number of the target vehicle, starting from 1 at the "up" side.
	 */
	const carNumberAbs = data.formation.indexOf(data.params.vehicleNumber) + 1;

	/**
	 * Adjusted car number based on direction.
	 */
	const carNumber = $derived.by(() => {
		return form.inbound
			? carNumberAbs
			: ((data.formation.length - carNumberAbs) % data.formation.length) + 1;
	});

	const destination = $derived.by(() => {
		return terminal(form.inbound ? 'UP' : 'DOWN');
	});

	const doorPosition = $derived.by(() => {
		if (form.door.number === null || form.door.side === null || form.door.number > data.doorCount) {
			return null;
		}

		if (
			!['AEL', 'DRL', 'EAL', 'TCL', 'TML'].includes(data.params.line) &&
			((data.stockName == '現代化列車' && [1, 4, 7].includes(carNumberAbs)) ||
				(data.stockName == '南港島綫中國長春製列車' && carNumberAbs == 3) ||
				(data.stockName != '現代化列車' && [1, 2, 4, 6].includes(carNumberAbs)))
		) {
			const index = form.door.number - 1;
			return {
				side: ['U', 'A'].includes(form.door.side) ? 'L' : 'R',
				index: index,
				platform: form.inbound ? index + 1 : data.doorCount - index
			};
		} else {
			const index = data.doorCount - form.door.number;
			return {
				side: ['U', 'A'].includes(form.door.side) ? 'R' : 'L',
				index: data.doorCount - form.door.number,
				platform: form.inbound ? index + 1 : data.doorCount - index
			};
		}
	});

	const description = $derived.by(() => {
		const dir = m.position_direction({ name: destination });
		const car = m.position_car({ car: carNumber });
		const doorPlatform = doorPosition?.platform ?? -1;
		const door = doorPlatform > 0 ? m.position_door({ door: doorPlatform }) : '';
		return `${dir} | ${car}${door}`;
	});

	function terminal(direction: 'UP' | 'DOWN') {
		return (
			lines[data.params.line]['terminals'][direction]
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				.map((s) => m[`station_${s.toLowerCase()}`]?.() ?? s)
				.join(m.slash())
		);
	}
</script>

<div class="flex h-full flex-col gap-y-3">
	<div class="flex h-full min-h-72 flex-col gap-y-3 rounded bg-white p-2">
		<div class="flex h-0 grow flex-col gap-y-5 overflow-y-auto">
			<div class="flex items-center justify-between gap-x-3">
				<div class="flex min-w-0 gap-x-2">
					<span
						class="h-6 rounded-sm bg-blue-100 px-2 text-nowrap"
						style:background-color={data.lineColor}
						style:color={textColor(data.lineColor)}
					>
						{m[`line_${data.params.line.toLowerCase()}`]?.() ?? data.params.line}
					</span>

					<p class=" min-w-0 items-center truncate">
						{`${m.to()} ${destination}`}
					</p>
				</div>
			</div>

			{#if !form.showSticker}
				<div in:slide>
					<div>
						<p class="content-center text-center">
							{m.car_number({ number: carNumber })}
						</p>

						<div
							class="flex h-50 w-full flex-col justify-between rounded border-2 px-2 py-1"
							class:flex-col-reverse={form.flip}
							style:border-color={data.lineColor}
							style:border-left-color={carNumberAbs == (form.flip ? data.formation.length : 1)
								? data.lineColor
								: 'transparent'}
							style:border-right-color={carNumberAbs == (form.flip ? 1 : data.formation.length)
								? data.lineColor
								: 'transparent'}
						>
							<div class="flex justify-around" class:flex-row-reverse={form.flip}>
								{#each Array(data.doorCount).keys() as i (i)}
									<Door
										active={doorPosition?.side == 'L' && doorPosition.index == i}
										color={data.lineColor}
									/>
								{/each}
							</div>

							<!-- direction marker -->
							<div class="flex items-center justify-between gap-x-2 text-battleship-gray-700">
								<span>←</span>

								<div
									class="flex grow justify-between"
									class:flex-row-reverse={form.flip}
									class:text-end={form.flip}
								>
									<div class="col-span-2">
										<p class="text-xs">{m.up_direction()}</p>
										<p>
											<span class="font-semibold">
												{terminal('UP')}
											</span>
										</p>
									</div>

									<div class="col-span-2 text-end" class:text-start={form.flip}>
										<p class="text-xs">{m.down_direction()}</p>
										<p>
											<span class="font-semibold">
												{terminal('DOWN')}
											</span>
										</p>
									</div>
								</div>

								<span>→</span>
							</div>

							<div class="flex justify-around" class:flex-row-reverse={form.flip}>
								{#each Array(data.doorCount).keys() as i (i)}
									<Door
										active={doorPosition?.side == 'R' && doorPosition.index == i}
										color={data.lineColor}
									/>
								{/each}
							</div>
						</div>
					</div>

					<div
						class="mt-2 flex justify-around gap-x-0.5 overflow-y-auto"
						class:flex-row-reverse={form.flip}
					>
						{#each data.formation as stock, i (i)}
							<button
								class="rounded-xs border px-0.5 font-mono text-[0.7rem]"
								style:background-color={data.params.vehicleNumber == stock ? data.lineColor : ''}
								style:color={data.params.vehicleNumber == stock ? textColor(data.lineColor) : ''}
								style:border-color={data.lineColor}
							>
								{stock}
							</button>
						{/each}
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
							<span class="text-[148px]">{doorPosition?.platform ?? 'x'}</span>
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

			<hr class="border-new-orleans-300" />

			<div class="flex flex-col gap-x-3">
				<p class="text-battleship-gray-600">
					<span class="me-1 font-bold select-none">㊢</span>
					<span>{description}</span>
				</p>

				<div class="flex justify-end gap-x-5 p-1">
					<a href={`whatsapp://send?text=${encodeURIComponent(description)}`}>
						<WhatsappIcon />
					</a>

					<a href={`tg://msg?text=${encodeURIComponent(description)}`}>
						<TelegramIcon />
					</a>

					<button
						type="button"
						class="cursor-pointer"
						onclick={() => {
							navigator.clipboard.writeText(description);
						}}
					>
						<ClipboardIcon />
					</button>
				</div>
			</div>
		</div>

		<div class="border-t border-gray-200 pt-3 pb-1">
			<div class="flex flex-wrap justify-between text-sm">
				<div>
					<div class="inline-flex items-center gap-2">
						<label for="switch-component-on" class="cursor-pointer text-sm text-slate-600">
							{m.carriage()}
						</label>

						<div class="relative inline-block h-5 w-11">
							<input
								id="switch-component-on"
								type="checkbox"
								class="peer h-5 w-11 cursor-pointer appearance-none rounded-full bg-slate-100 transition-colors duration-500 checked:bg-new-orleans-300"
								checked={form.showSticker}
								onchange={() => (form.showSticker = !form.showSticker)}
							/>
							<label
								for="switch-component-on"
								class="absolute top-0 left-0 h-5 w-5 cursor-pointer rounded-full border border-slate-300 bg-white shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800"
							></label>
						</div>

						<label for="switch-component-on" class="cursor-pointer text-sm text-slate-600">
							{m.platform_door_sticker()}
						</label>
					</div>
				</div>

				<div class="flex gap-x-4">
					<button
						class="flex h-6 items-center gap-x-2 rounded bg-new-orleans-300 px-1 text-center text-gray-800"
						onclick={() => (form.inbound = !form.inbound)}
					>
						<ArrowLeftRightIcon width={13} height={13} />
						{m.opposite_direction()}
					</button>

					<button
						class="flex h-6 items-center gap-x-2 rounded bg-new-orleans-300 px-1.5 text-center text-gray-800"
						onclick={() => (form.flip = !form.flip)}
					>
						<SymmetryVerticalIcon width={13} height={13} />
					</button>
				</div>
			</div>
		</div>
	</div>

	<div class="flex min-h-24 flex-col justify-center gap-y-3 rounded bg-white p-2">
		<div class="grid grid-cols-10 items-center gap-2">
			<div class="col-span-4 flex">
				<p class="flex items-center gap-x-2 font-medium text-gray-900">
					{m.door_no()}
				</p>
			</div>

			<div class="col-span-6 flex flex-col gap-y-2">
				<div class="flex gap-x-2">
					{#each ['EAL', 'TML'].includes(data.params.line) ? ['U', 'D'] : ['A', 'B'] as side, i (i)}
						<button
							type="button"
							class="h-6.5 w-7 rounded border"
							class:bg-new-orleans-700={form.door.side == side}
							class:text-white={form.door.side == side}
							onclick={() => {
								form.door.side = form.door.side == side ? null : (side as typeof form.door.side);
							}}
						>
							{side}
						</button>
					{/each}
				</div>

				<div class="flex gap-x-2">
					{#each Array.from(Array(data.doorCount).keys()).map((c) => c + 1) as i (i)}
						<button
							type="button"
							class="h-6.5 w-7 rounded border"
							class:bg-new-orleans-700={form.door.number === i}
							class:text-white={form.door.number === i}
							onclick={() => {
								form.door.number = form.door.number == i ? null : (i as typeof form.door.number);
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
