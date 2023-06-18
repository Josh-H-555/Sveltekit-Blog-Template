<script lang="ts">
	import type { ActionData } from './$types';
	import Header from '$lib/Header.svelte';
	import { enhance } from '$app/forms';
	export let form: ActionData;
	let inputImage: any;
	let showImage = false;
	let image: any;

	function previewImage() {
		const file = inputImage.files[0];

		if (file) {
			showImage = true;

			const reader = new FileReader();
			reader.addEventListener("load", function () {
				image.setAttribute("src", reader.result);
			});
			reader.readAsDataURL(file);

			return;
		}
		showImage = false;
	}


</script>

<style>
	img {
	object-fit: contain !important;
	max-width: 100%;
	max-height: 100%;
  }
</style>

<Header photo={'/src/lib/assets/post-bg.jpg'} title={'Blog!'} subtitle={'New Blog!'} />
<div class="container px-1 px-lg-5 mx-auto w-75">
	<div class="row gx-4 gx-lg-5 justify-content-center">
		{#if !form?.invalid}
			<form
				method="POST"
				action="?/create"
				use:enhance>
                <div class="px-2 py-4 py-md-2">
                    <label class="form-label" for="title">Title</label>
                    <input class="form-control rounded" name="title" id="title" type="text" required />
                </div>
                <div class="px-2 py-4 py-md-2">
                    <label class="form-label" for="subtitle">Subtitle</label>
                    <input class="form-control rounded" name="subtitle" id="subtitle" type="text" required />
                </div>
				<div class="px-2 py-4 py-md-2">
                    <label class="form-label" for="image">Blog Image</label>
                    <input bind:this={inputImage} on:change={previewImage} class="form-control rounded" name="image" id="image" type="file" accept="image/png, image/jpeg, image/jpg" required />
					<img class="mt-4" bind:this={image} src="" alt="" />
				</div>
                <button type="submit" class="btn btn-primary ms-2 rounded mb-5 mt-2">Submit</button>
			</form>
		{/if}
		{#if form?.invalid}
			<p class="error">Please ensure all fields are filled out.</p>
		{/if}
	</div>
</div>
