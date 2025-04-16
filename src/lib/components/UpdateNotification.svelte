<script lang="ts">
	import { Fleet } from '$lib/data';
	import { useRegisterSW } from 'virtual:pwa-register/svelte';

	const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
		async onRegisteredSW(swUrl, registration) {
			if (registration === undefined) return;

			if (registration.installing || !navigator) return;

			if ('connection' in navigator && !navigator.onLine) return;

			const resp = await fetch(swUrl, {
				cache: 'no-store',
				headers: { cache: 'no-store', 'cache-control': 'no-cache' }
			});

			if (resp?.status === 200) {
				await registration.update();
			}
		},
		onRegisterError(error) {
			console.log('Service worker registration error', error);
		}
	});
	const close = () => {
		offlineReady.set(false);
		needRefresh.set(false);
	};

	const show = $derived($offlineReady || $needRefresh);
</script>

{#if show}
	<div class="bg-new-orleans-700 -mt-2 mb-2 flex gap-x-3 rounded py-1">
		<button
			class="grow cursor-pointer"
			onclick={() => {
				Fleet.clear();
				updateServiceWorker(true);
			}}
		>
			有新的版本可供更新，按此更新。
		</button>

		<button class="w-8 cursor-pointer" onclick={close}> ⨯ </button>
	</div>
{/if}
