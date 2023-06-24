<script lang="ts">
	import { PUBLIC_GOOGLE_SITE_KEY } from '$env/static/public';
	export let title: string;

	let innerWidth: any;
</script>

<svelte:window bind:innerWidth />

<h1>{title}</h1>

<!--lots of if conditions, but allows a real easy reuse for pages with forms-->

{#if title.toLowerCase().includes('register') && !title.toLowerCase().includes('reset')}
	<div class="px-2 py-4 py-md-2">
		<label class="form-label" for="name">Name</label>
		<input class="form-control rounded" id="name" name="name" type="text" required />
	</div>
{/if}
{#if !title.toLowerCase().includes('change')}
<div class="px-2 py-4 py-md-2">
	<label class="form-label" for="email">Email</label>
	<input class="form-control rounded" id="email" name="email" type="email" required />
</div>
{/if}
{#if !title.toLowerCase().includes('reset')}
<div class="px-2 py-4 py-md-2">
	<label class="form-label" for="password">Password</label>
	<input class="form-control rounded" id="password" name="password" type="password" required />
</div>
{/if}
{#if title.toLowerCase().includes('change')}
<div class="px-2 py-4 py-md-2">
	<label class="form-label" for="confirm">Confirm Password</label>
	<input class="form-control rounded" id="confirm" name="confirm" type="password" required />
</div>
{/if}
{#if title.toLowerCase().includes('login') || title.toLowerCase().includes('reset')}
<div class="px-2 py-4 py-md-2">
	<div class="g-recaptcha" data-sitekey={PUBLIC_GOOGLE_SITE_KEY} data-size={innerWidth > 992 ? 'normal' : 'compact'}></div>
</div>
{/if}
<button type="submit" class="btn btn-primary ms-2 rounded mb-5 mt-2">{title}</button>
