<script lang="ts">
	import Header from '$lib/Components/Header.svelte';
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { browser } from '$app/environment';
	import { PUBLIC_GOOGLE_SITE_KEY } from '$env/static/public';
	export let form: ActionData;

	let innerWidth: any;


</script>

<!--This ensures that the script will load every time
	the page is loaded, and therefore the captcha will always load-->
{#if browser}
<script src="https://www.google.com/recaptcha/api.js" defer></script>
{/if}

<svelte:window bind:innerWidth />


<Header photo={'/assets/contact-bg.jpg'} title={'Contact Me'} subtitle={'Always open to chat!'} />
<div class="container px-4 px-lg-5 mx-auto w-50">
	<div class="row gx-4 gx-lg-5 justify-content-center">
		{#if !form?.invalid}
			<!--Contact form does not use UserForm due to floating labels.
				UserForm would become VERY gross accounting for these.-->
			<form use:enhance id="contact-form" method="POST" action="?/send">
				<div class="px-2 py-4 py-md-2 form-floating">
					<input class="form-control rounded" id="name" name="name" type="text" placeholder="Enter your name!" required />
					<label class="form-label" for="name">Name</label>
				</div>
				<div class="px-2 py-4 py-md-2 form-floating">
					<input class="form-control rounded" id="email" name="email" type="email" placeholder="Enter your email!" required />
					<label class="form-label" for="email">Email</label>
				</div>
				<div class="px-2 py-4 py-md-2 form-floating">
					<input class="form-control rounded" id="number" name="number" type="tel" placeholder="Enter your number!" />
					<label class="form-label" for="number">Phone Number (Optional)</label>
				</div>
				<div class="px-2 py-4 py-md-2 form-floating">
					<textarea
						class="form-control rounded my-5"
						rows="6"
						id="message"
						name="message"
						form="contact-form"
						placeholder="Enter your message!"
						required
					/>
					<label class="form-label" for="message">Message</label>
				</div>
				<div class="px-2 py-4 py-md-2">
					<div class="g-recaptcha" data-sitekey={PUBLIC_GOOGLE_SITE_KEY} data-size={innerWidth > 992 ? 'normal' : 'compact'}></div>
				</div>
				<button type="submit" class="btn btn-primary ms-2 rounded mb-5 mt-2">Contact</button>
			</form>
		{/if}
		{#if form?.invalid}
			<p class="alert alert-danger">Please ensure all fields are filled out.</p>
		{/if}
		{#if form?.messageSent}
			<p class="alert alert-success">Email sent! Thanks for reaching out!</p>
		{/if}
		{#if form?.messageFailed}
			<p class="alert alert-danger">Error sending email. Please try again.</p>
		{/if}
	</div>
</div>
