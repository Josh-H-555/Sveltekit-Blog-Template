<!--This page is the actual password reset page.-->

<script lang="ts">
	import type { ActionData } from './$types';
	import Header from '$lib/Header.svelte';
	import UserForm from '$lib/UserForm.svelte';
	import { enhance } from '$app/forms';
	export let form: ActionData;
</script>

<Header photo={'/src/lib/assets/post-bg.jpg'} title={'Welcome!'} subtitle={'Finish resetting your password!'} />
<div class="container px-4 px-lg-5 mx-auto w-50">
	<div class="row gx-4 gx-lg-5 justify-content-center">
		{#if !form?.invalid}
			<form
				method="POST"
				action="?/change"
				use:enhance>
				<UserForm title={'Change'} />
			</form>
		{:else}
			<h1>Password Reset!</h1>
			<h2><a href="/login">Login</a></h2>
		{/if}
		{#if form?.invalid}
			<p class="error">Please ensure all fields are filled out.</p>
		{/if}
		{#if form?.credentials}
			<p class="error">Passwords don't match. Please try again.</p>
		{/if}
	</div>
</div>
