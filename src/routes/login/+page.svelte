<script lang="ts">
	import Header from '$lib/Components/Header.svelte';
	import UserForm from '$lib/Components/UserForm.svelte';
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { browser } from '$app/environment';

	export let form: ActionData;
</script>

<!--This ensures that the script will load every time
	the page is loaded, and therefore the captcha will always load-->
{#if browser}
<script src="https://www.google.com/recaptcha/api.js" defer></script>
{/if}

<Header photo={'/assets/post-bg.jpg'} title={'Welcome!'} subtitle={'Please log in'} />
<div class="container px-4 px-lg-5 mx-auto w-50">
	<div class="row gx-4 gx-lg-5 justify-content-center">
		<form use:enhance method="POST" action="?/login">
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
