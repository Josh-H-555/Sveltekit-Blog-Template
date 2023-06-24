<!--This page is for inputting an email to reset a password-->
<script lang="ts">
	import type { ActionData } from './$types';
	import Header from '$lib/Components/Header.svelte';
	import UserForm from '$lib/Components/UserForm.svelte';
	import { enhance } from '$app/forms';
	import { browser } from '$app/environment';
	
	export let form: ActionData;
</script>

<!--This ensures that the script will load every time
	the page is loaded, and therefore the captcha will always load-->
{#if browser}
<script src="https://www.google.com/recaptcha/api.js" defer></script>
{/if}

<Header photo={'/assets/post-bg.jpg'} title={'Welcome!'} subtitle={'Forgot your password?'} />
<div class="container px-4 px-lg-5 mx-auto w-50">
	<div class="row gx-4 gx-lg-5 justify-content-center">
		{#if !form?.invalid}
			<form use:enhance method="POST" action="?/reset">
				<UserForm title={'Reset'} />
			</form>
		{/if}
		{#if form?.invalid}
			<p class="alert alert-danger">Please ensure all fields are filled out.</p>
		{/if}
		{#if form?.emailSent}
			<p class="alert alert-success">Reset email sent! You will receive one if you have an account.</p>
		{/if}
		{#if form?.emailFailed}
			<p class="alert alert-danger">Error sending reset email. Please try again.</p>
		{/if}
	</div>
</div>
