<script lang="ts">
	import Header from '$lib/Header.svelte';
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';
	export let form: ActionData;
</script>

<Header
	photo={'/src/lib/assets/contact-bg.jpg'}
	title={'Contact Me'}
	subtitle={'Always open to chat!'}
/>
<div class="container px-4 px-lg-5 mx-auto w-50">
	<div class="row gx-4 gx-lg-5 justify-content-center">
		{#if !form?.invalid}
			<form
				id="contact-form"
				method="POST"
				action="?/send"
				use:enhance>
                <div class="px-2 py-4 py-md-2 form-floating">
                    <input class="form-control rounded" name="name" id="name" placeholder="Enter your name!" type="text" required />
                    <label class="form-label" for="name">Name</label>
				</div>
                <div class="px-2 py-4 py-md-2 form-floating">
                    <input class="form-control rounded" name="email" id="email" placeholder="Enter your email!" type="email" required />
                    <label class="form-label" for="email">Email Address</label>
				</div>
				<div class="px-2 py-4 py-md-2 form-floating">
                    <input class="form-control rounded" name="number" placeholder="Enter your number!" id="number" type="tel" />
                    <label class="form-label" for="number">Phone Number</label>
                </div>
				<div class="px-2 py-4 py-md-2 form-floating">
                    <textarea class="form-control rounded my-5" placeholder="Enter your message!" rows="6" form="contact-form" name="message" id="message" required />
                    <label class="form-label" for="message">Message</label>
                </div>
                <button type="submit" class="btn btn-primary ms-2 rounded mb-5 mt-2">Submit</button>
			</form>
		{/if}
		{#if form?.invalid}
			<p class="error">Please ensure all fields are filled out.</p>
		{/if}
	</div>
</div>
