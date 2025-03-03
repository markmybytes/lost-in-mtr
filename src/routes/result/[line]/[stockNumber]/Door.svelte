<script lang="ts">
	let props: {
		active: boolean;
		color: string;
	} = $props();
</script>

<div class="relative flex" style:background-color={props.active ? `${props.color}60` : null}>
	<div class="h-12 w-5 rounded-s-xs border-y border-s" style:border-color={props.color}></div>
	<div class="h-12 w-5 rounded-e-xs border-y border-e" style:border-color={props.color}></div>

	<!-- door slit -->
	<div class="absolute left-1/2 h-12 w-[1px]" style:background-color={props.color}></div>
	<!-- window -->
	<div class="absolute top-1 left-1 h-5.5 w-3 rounded-xs border"></div>
	<div class="absolute top-1 right-1 h-5.5 w-3 rounded-xs border"></div>
</div>
