<script>
	import { base } from '$app/paths';
	import * as m from '$lib/paraglide/messages';
</script>

<div class="flex h-full flex-col gap-y-4">
	<div class="flex h-0 grow flex-col gap-y-2 overflow-y-auto rounded-lg bg-white/90 p-2">
		<div>
			<h2 class="mb-2 font-bold">{m.car_door_number_q()}</h2>

			<p class="text-sm">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html m.car_door_number_a()}
			</p>
		</div>

		<div>
			<h2 class="mb-2 font-bold">{m.find_car_door_number_q()}</h2>
			<ol class="flex list-decimal flex-col gap-y-3 pl-4 text-sm">
				<li>
					<p>{m.sticker_next_to_door()}</p>

					<img src="{base}/images/c_train_door.webp" alt="" class="p-1" />

					<img src="{base}/images/m_train_door.webp" alt="" class="p-1" />
				</li>

				<li>
					<p>{m.route_map()}</p>

					<img src="{base}/images/m_train_drm.webp" alt="" class="p-1" />

					<img src="{base}/images/ikk_train_drm.webp" alt="" class="p-1" />
				</li>

				<li>
					<p>{m.end_and_lcd()}</p>

					<img src="{base}/images/m_train_end.webp" alt="" class="p-1" />

					<img src="{base}/images/c_train_end.webp" alt="" class="p-1" />
					<p class="text-xs text-gray-400">
						{m.lcd_number_hint()}
					</p>
				</li>

				<li>
					<p>{m.tv()}</p>

					<img src="{base}/images/ikk_train_tv.webp" alt="" class="p-1" />

					<img src="{base}/images/c_train_tv.webp" alt="" class="p-1" />

					<img src="{base}/images/m_train_tv.webp" alt="" class="p-1" />
				</li>
			</ol>
		</div>

		<div>
			<h2 class="mb-2 font-bold">{m.no_result_wrong_result_q()}</h2>

			<p class="text-sm">
				{m.no_result_wrong_result_a()}
			</p>
		</div>
	</div>
</div>
