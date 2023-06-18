<!--This page is for inputting an email to reset a password-->

<script lang="ts">
	import type { ActionData } from './$types';
	import Header from '$lib/Header.svelte';
	import UserForm from '$lib/UserForm.svelte';
	import { enhance } from '$app/forms';
	export let form: ActionData;
</script>

<Header photo={'/src/lib/assets/post-bg.jpg'} title={'Welcome!'} subtitle={'Reset your password!'} />
<div class="container px-4 px-lg-5 mx-auto w-50">
	<div class="row gx-4 gx-lg-5 justify-content-center">
		{#if !form?.invalid}
			<form
				method="POST"
				action="?/reset"
				use:enhance>
				<UserForm title={'Reset'} />
			</form>
		{:else}
			<h1>Email sent!</h1>
			<h2><a href="/login">Login</a></h2>
		{/if}
		{#if form?.invalid}
			<p class="error">Please ensure all fields are filled out.</p>
		{/if}
		{#if form?.credentials}
			<p class="error">Email in use. Please try another.</p>
		{/if}
	</div>
</div>
