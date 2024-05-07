<svelte:head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<script src="https://cdn.tailwindcss.com"></script>
</svelte:head>
<script lang="ts">
	import type {  ActionData } from '../../../.svelte-kit/types/src/routes';


	export let form: ActionData;
</script>
<body class="w-full bg-gray-600">

<form class="my-5 w-full lg:w-1/2 text-xl mx-auto text-center bg-gray-300 rounded-lg py-4" id="myForm" method="POST" action="?/add">
	<h1 class="text-center text-4xl ">Aisha Donate API Editer</h1>
	<p class="inline"> รับมา(เฉพาะยอดใหม่): <input class="w-auto inline p-1  text-sm text-gray-900 bg-gray-400 rounded-lg border border-gray-300" type="number" step="0.01" name="Recived" value="">บาท</p><br>
	<p class="inline">ยอดทั้งหมด(ไม่ต้องแก้): <input class="w-auto w-fit p-1  text-sm text-gray-900 bg-gray-400 rounded-lg border border-gray-300" type="number" step="0.01" name="Needed" value=20000>บาท</p><br>
	Authentication Code: <input class=" p-1  text-sm text-gray-900 bg-gray-400 rounded-lg border border-gray-300" type="password" name="Auth" value=""><br>
		{#if form?.auth === false}
			<p class="text-red-500">Authentication Code ไม่ถูกต้อง</p>
		{:else if form?.auth === true && form?.server === false}
			<p class="text-green-500">Server พัง</p>
		{:else if form?.auth === true && form?.server === true}
			<p class="text-green-500">ส่งเรียบร้อย</p>
			<p class="text-green-500">ยอดใหม่ทั้งหมด: {form?.total} บาท</p>
			<p class="text-green-500">ยอดเงินมีแล้ว: {form?.donated} บาท</p>
			<p class="text-green-500">ยอดต้องการ: {form?.needed} บาท</p>

		{/if}
	<input class="mt-2 px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-lg" type="submit" value="Submit" ><a href="http://" class="ml-2 mt-2 px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-lg">เช็คยอดหน้าหลัก</a>
</form>
</body>