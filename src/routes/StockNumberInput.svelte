<div class="flex flex-col gap-y-2 p-2">
	<div>
		<input type="text" />
	</div>

	<div class="flex h-54 gap-x-2">
		<div class="flex h-full w-2/3 flex-col gap-y-2 text-xl lg:h-36">
			<div class="flex grow gap-x-2">
				<button class="grow rounded-xs bg-white">7</button>
				<button class="grow rounded-xs bg-white">8</button>
				<button class="grow rounded-xs bg-white">9</button>
			</div>
			<div class="flex grow gap-x-2">
				<button class="grow rounded-xs bg-white">4</button>
				<button class="grow rounded-xs bg-white">5</button>
				<button class="grow rounded-xs bg-white">6</button>
			</div>
			<div class="flex grow gap-x-2">
				<button class="grow rounded-xs bg-white">1</button>
				<button class="grow rounded-xs bg-white">2</button>
				<button class="grow rounded-xs bg-white">3</button>
			</div>
			<div class="flex grow gap-x-2">
				<button class="grow rounded-xs bg-white">C</button>
				<button class="grow rounded-xs bg-white">0</button>
				<button class="grow rounded-xs bg-white">D</button>
			</div>
		</div>

		<div class="grow overflow-y-scroll">
			<div class="grid grow grid-cols-2 gap-1">
				{#each [] as alphabet}
					<div>
						<button class="h-12 w-full rounded bg-white">{alphabet}</button>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
