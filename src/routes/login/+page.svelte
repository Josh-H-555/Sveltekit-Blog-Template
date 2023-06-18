<script lang="ts">
	import Header from '$lib/Header.svelte';
	import UserForm from '$lib/UserForm.svelte';
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';

	export let form: ActionData;
</script>

<Header photo={'/src/lib/assets/post-bg.jpg'} title={'Welcome!'} subtitle={'Please log in'} />
<div class="container px-4 px-lg-5 mx-auto w-50">
	<div class="row gx-4 gx-lg-5 justify-content-center">
		<form
			method="POST"
			action="?/login"
			use:enhance>
			<UserForm title={'Login'} />
			{#if form?.invalid}
				<p class="alert alert-danger">Email and password required</p>
			{/if}
			{#if form?.credentials}
				<p class="alert alert-danger">Invalid email or password</p>
			{/if}
		</form>
	</div>
</div>
