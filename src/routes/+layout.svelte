<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<nav class="bg-chestnut-rose-300 rounded border-gray-200">
	<div class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between px-4 py-2">
		<a href="https://flowbite.com/" class="flex items-center space-x-3 rtl:space-x-reverse">
			<img src="https://flowbite.com/docs/images/logo.svg" class="h-7" alt="Flowbite Logo" />
			<span class="self-center text-lg font-semibold whitespace-nowrap"> 迷失港鐵 </span>
		</a>
		<button
			data-collapse-toggle="navbar-default"
			type="button"
			class="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 focus:outline-none md:hidden"
			aria-controls="navbar-default"
			aria-expanded="false"
		>
			<span class="sr-only">Open main menu</span>
			<svg
				class="h-5 w-5"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 17 14"
			>
				<path
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M1 1h15M1 7h15M1 13h15"
				/>
			</svg>
		</button>

		<div class="hidden w-full md:block md:w-auto" id="navbar-default">
			<ul
				class="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0 rtl:space-x-reverse"
			>
				<li>
					<a
						href="/"
						class="block rounded-sm bg-blue-700 px-3 py-2 text-white md:bg-transparent md:p-0 md:text-blue-700"
						aria-current="page">Home</a
					>
				</li>
				<li>
					<a
						href="/"
						class="block rounded-sm px-3 py-2 text-gray-900 hover:bg-gray-100 md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700"
						>About</a
					>
				</li>
			</ul>
		</div>
	</div>
</nav>

<main>
	{@render children()}
</main>
