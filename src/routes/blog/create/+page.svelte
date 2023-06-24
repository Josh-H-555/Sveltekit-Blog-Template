<script lang="ts">
	import type { ActionData } from './$types';
	import Header from '$lib/Components/Header.svelte';
	import { enhance } from '$app/forms';
	export let form: ActionData;

	let inputImage: any;
	let showImage = false;
	let image: any;


	let newTitle = '';
	let newSubtitle = '';
	let imageUrl = '/assets/post-bg.jpg';

	$: reactiveTitle = newTitle;
	$: reactiveSubtitle = newSubtitle;
	$: reactiveImage = imageUrl;

	// allows image preview after upload
	// i'm sure there's a way to export this into helpers,
	// but couldn't figure out Sveltekit's object reactivity.
	function previewImage() {
		const file = inputImage.files[0];

		if (file) {
			showImage = true;

			const reader = new FileReader();
			reader.addEventListener('load', function () {
				image.setAttribute('src', reader.result);
				imageUrl = reader.result as string;
			});
			reader.readAsDataURL(file);

			return;
		}
		showImage = false;
	}

</script>

<Header photo={reactiveImage} title={newTitle === '' ? 'Blog!' : reactiveTitle} subtitle={newSubtitle === '' ? 'Create a new blog!' : reactiveSubtitle} />
<div class="container px-1 px-lg-5 mx-auto w-75">
	<div class="row gx-4 gx-lg-5 justify-content-center">
		{#if !form?.invalid}
			<form use:enhance method="POST" action="?/create">
				<div class="px-2 py-4 py-md-2">
					<label class="form-label" for="title">Title</label>
					<input bind:value={newTitle} class="form-control rounded" id="title" name="title" type="text" required />
				</div>
				<div class="px-2 py-4 py-md-2">
					<label class="form-label" for="subtitle">Subtitle</label>
					<input bind:value={newSubtitle} class="form-control rounded" id="subtitle" name="subtitle" type="text" required />
				</div>
				<div class="px-2 py-4 py-md-2">
					<label class="form-label" for="image">Blog Image</label>
					<input
						bind:this={inputImage}
						on:change={previewImage}
						class="form-control rounded"
						id="image"
						name="image"
						type="file"
						accept="image/png, image/jpeg, image/jpg"
						required
					/>
					<img bind:this={image} class="mt-4" alt="" />
				</div>
				<button type="submit" class="btn btn-primary ms-2 rounded mb-5 mt-2">Submit</button>
			</form>
		{/if}
		{#if form?.invalid}
			<p class="alert alert-danger">Please ensure all fields are filled out.</p>
		{/if}
		{#if form?.duplicate}
			<p class="alert alert-danger">Blog exists. Please try a different name.</p>
		{/if}
		{#if form?.uploadFailed}
			<p class="alert alert-danger">Issue with CDN. Please try again.</p>
		{/if}
	</div>
</div>

<style>
	img {
		object-fit: contain !important;
		max-width: 100%;
		max-height: 100%;
	}
</style>
