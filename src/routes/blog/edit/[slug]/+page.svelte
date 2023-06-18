<script lang="ts">
	import type { ActionData } from './$types';
    import { page } from '$app/stores';
	import Header from '$lib/Header.svelte';
	import { enhance } from '$app/forms';
	export let form: ActionData;
</script>

<style>
	img {
    object-fit: contain !important;
    max-width: 100%;
    max-height: 100%;
  }
</style>

<Header photo={'/src/lib/assets/post-bg.jpg'} title={'Blog!'} subtitle={'Edit Blog!'} />
<div class="container px-1 px-lg-5 mx-auto w-75">
	<div class="row gx-4 gx-lg-5 justify-content-center">
		{#if !form?.invalid}
			<form
				method="POST"
				action="?/edit"
				use:enhance>
                <div class="px-2 py-4 py-md-2">
                    <label class="form-label" for="title">Title</label>
                    <input class="form-control rounded" name="title" id="title" type="text" value="{ $page.data.blog.title }" required />
                </div>
                <div class="px-2 py-4 py-md-2">
                    <label class="form-label" for="subtitle">Subtitle</label>
                    <input class="form-control rounded" name="subtitle" id="subtitle" type="text" value="{ $page.data.blog.subtitle }" required />
                </div>
				<div class="px-2 py-4 py-md-2">
                    <label class="form-label" for="image">Blog Image</label>
                    <input class="form-control rounded" name="image" id="image" type="file" accept="image/png, image/jpeg, image/jpg" />
                    <img class="mt-1" alt="" src="/src/lib/assets/{$page.data.blog.image}" height="200px"/>
                </div>
                <div class="px-2 py-4 py-md-2">
                    <label class="form-label" for="active">Blog Active</label>
                    <input class="form-check-input rounded" name="active" id="active" type="checkbox" checked="{ $page.data.blog.active }" />
                </div>
                <button type="submit" class="btn btn-primary ms-2 rounded mb-5 mt-2">Submit</button>
            </form>
		{/if}
		{#if form?.invalid}
			<p class="error">Please ensure all fields are filled out.</p>
		{/if}
	</div>
</div>
