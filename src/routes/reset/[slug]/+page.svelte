<!--This page is the actual password reset page.-->

<script lang="ts">
	import type { ActionData } from './$types';
	import Header from '$lib/Components/Header.svelte';
	import UserForm from '$lib/Components/UserForm.svelte';
	import { enhance } from '$app/forms';
	export let form: ActionData;
</script>

<Header
	photo={'/assets/post-bg.jpg'}
	title={'Almost Done!'}
	subtitle={'Finish resetting your password!'}
/>
<div class="container px-4 px-lg-5 mx-auto w-50">
	<div class="row gx-4 gx-lg-5 justify-content-center">
		{#if !form?.invalid}
			<form use:enhance method="POST" action="?/change">
				<UserForm title={'Change'} />
			</form>
		{/if}
		{#if form?.invalid}
			<p class="alert alert-danger">Please ensure all fields are filled out.</p>
		{/if}
		{#if form?.credentials}
			<p class="alert alert-danger">Passwords don't match. Please try again.</p>
		{/if}
		{#if form?.updateFailed}
			<p class="alert alert-danger">Issue updating user. Please try again.</p>
		{/if}
	</div>
</div>
