<script lang="ts">
	let {
		value = $bindable(''),
		options
	}: {
		value: string;
		options: Array<string> | Set<string>;
	} = $props();

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
</script>

<div
	class="relative col-span-6"
	onfocusin={() => {
		focused = true;
	}}
	onfocusout={() => setTimeout(() => (focused = false))}
	tabindex="-2"
>
	<input
		type="text"
		class="peer w-full p-0.5"
		maxlength="4"
		autocomplete="off"
		required
		bind:value
	/>

	<div
		class="absolute top-full right-0 left-0 max-h-22 overflow-y-auto rounded
         bg-white py-1 {focused ? 'inline-block' : 'hidden'}"
		tabindex="-1"
	>
		{#each filtered as option}
			<button
				type="button"
				class="text-glacier-600 hover:bg-glacier-50 rounded px-2"
				onclick={() => {
					value = option;
				}}
			>
				{option}
			</button>
		{/each}
	</div>
</div>
