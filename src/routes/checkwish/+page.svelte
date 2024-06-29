<script lang="ts">
	import type { ActionData } from './$types';
	let thisForm: HTMLFormElement;
	let loading = false;

	export let form: ActionData;
	function handleSubmit() {
		loading = true;
		setTimeout(() => {
			loading = false;
		}, 5000);
	}
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="robots" content="noindex">

	<script src="https://cdn.tailwindcss.com"></script>

</svelte:head>
<body class="w-full bg-gray-600">
<div class="bg-gray-300 w-full lg:w-1/2 mx-auto rounded-lg">
	<form
		class="my-5  text-xl mx-auto text-center  rounded-lg py-4"
		id="myForm"
		method="POST"
		action="?/check"
	>
		<h1 class="text-center text-4xl">ZONA WISH API Approval</h1>
		<br />
		Authentication Code:
		<input
			class=" p-1 text-sm text-gray-900 bg-gray-400 rounded-lg border border-gray-300"
			type="password"
			name="Auth"
			required
			value=""
		/><br />
		{#if form?.auth === false}
			<p class="text-red-500">Authentication Code ไม่ถูกต้อง</p>
		{:else if form?.auth === true && form?.server === false}
			<p class="text-green-500">Server พัง</p>
		{:else if form?.auth === true && form?.server === true}
			<p class="text-green-500">AUTHENTICATED</p>
		{/if}
		<input
			class="mt-2 px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-lg"
			type="submit"
			value="Submit"
		/><a
			href="http://"
			class="ml-2 mt-2 px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-lg"
			>เช็คยอดหน้าหลัก</a
		>
	</form>

	{#if form?.wish}
		{#if form?.updaterror ===  true}
			<p class="text-red-500 mx-auto text-center">form พัง</p>
		{:else if form?.authUP === true}
			<p class="text-green-500 mx-auto text-center">UPDATED</p>
		{/if}
		<div class="grid grid-cols-2">

		{#each form?.wish as rom}
			<form
				bind:this={thisForm}
				on:submit={handleSubmit}
				class="my-5  text-xl  text-center  rounded-lg mx-4 bg-white"
							 id="myForm2"
							 method="POST"

								>
			<p>ID:<input class="p-2 rounded-lg text-sm bg-gray-500 "   type="text" id="id" name="id" value={rom.id}></p>
			<p>NAME: {rom.name}</p>
			<p class="text-sm">WISH: {rom.comment}</p>

				<button class="bg-green-500 rounded-lg mt-2 p-2 hover:bg-green-500/70 disabled:bg-green-500/30" 									disabled={loading} formaction="?/approve">Approve</button>
				<button class="bg-red-500 rounded-lg mt-2 p-2 hover:bg-red-500/70 disabled:bg-red-500/30" 									disabled={loading} formaction="?/notapp">SPAM</button>

			</form>
			{/each}

		</div>

	{/if}</div>
</body>
