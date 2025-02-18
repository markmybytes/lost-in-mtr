<script lang="ts">
	import { isMobileUA } from '$lib/utils';

	let {
		value = $bindable(''),
		options
	}: {
		value: string;
		options: Array<string> | Set<string>;
	} = $props();

	const isMobile = isMobileUA();

	let focused = $state(false);

	let filtered = $derived.by(() => {
		if (value == '') {
			return options;
		}

		const matches: Array<string> = [];

		options.forEach((s) => {
			if (s.startsWith(value)) {
				matches.push(s);
			}
		});
		return matches;
	});

	$effect(() => {
		value = value.toUpperCase();
	});
</script>

<div
	class="relative col-span-6"
	onfocusin={() => {
		focused = true;
	}}
	onfocusout={() => {
		setTimeout(
			() => {
				focused = false;
			},
			isMobile ? 0 : 100
		);
	}}
>
	<input
		type="search"
		class="peer w-full p-0.5"
		maxlength="4"
		autocomplete="off"
		required
		bind:value
	/>

	<div
		class="absolute top-full right-0 left-0 max-h-22 overflow-y-auto rounded
         bg-white py-1 {focused ? 'inline-block' : 'hidden'}"
	>
		{#each filtered as option}
			<button
				type="button"
				class="hover:bg-battleship-gray-100 text-battleship-gray-700 rounded border-0 px-2"
				onclick={() => {
					value = option;
					focused = false;
				}}
			>
				{option}
			</button>
		{/each}
	</div>
</div>
