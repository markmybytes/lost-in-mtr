<script>
	import { base } from '$app/paths';
	import { t } from '$lib/i18n/translations';
</script>

<div class="flex h-full flex-col gap-y-4">
	<div class="flex h-0 grow flex-col gap-y-2 overflow-y-auto rounded-lg bg-white/90 p-2">
		<div>
			<h2 class="mb-2 font-bold">{$t('qna.carDoorNumberQ')}</h2>

			<p class="text-sm">
				{@html $t('qna.carDoorNumberA')}
			</p>
		</div>

		<div>
			<h2 class="mb-2 font-bold">{$t('qna.findCarDoorNumberQ')}</h2>
			<ol class="flex list-decimal flex-col gap-y-3 pl-4 text-sm">
				<li>
					<p>{$t('qna.stickerNextToDoor')}</p>

					<img src="{base}/images/c_train_door.webp" alt="" class="p-1" />

					<img src="{base}/images/m_train_door.webp" alt="" class="p-1" />
				</li>

				<li>
					<p>{$t('qna.routeMap')}</p>

					<img src="{base}/images/m_train_drm.webp" alt="" class="p-1" />

					<img src="{base}/images/ikk_train_drm.webp" alt="" class="p-1" />
				</li>

				<li>
					<p>{$t('qna.endAndLcd')}</p>

					<img src="{base}/images/m_train_end.webp" alt="" class="p-1" />

					<img src="{base}/images/c_train_end.webp" alt="" class="p-1" />
					<p class="text-xs text-gray-400">
						{$t('qna.lcdNumberHint')}
					</p>
				</li>

				<li>
					<p>{$t('qna.tv')}</p>

					<img src="{base}/images/ikk_train_tv.webp" alt="" class="p-1" />

					<img src="{base}/images/c_train_tv.webp" alt="" class="p-1" />

					<img src="{base}/images/m_train_tv.webp" alt="" class="p-1" />
				</li>
			</ol>
		</div>

		<div>
			<h2 class="mb-2 font-bold">{$t('qna.noResultWrongResultQ')}</h2>

			<p class="text-sm">
				{$t('qna.noResultWrongResultA')}
			</p>
		</div>
	</div>
</div>
