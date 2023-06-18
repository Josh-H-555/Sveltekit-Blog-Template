<script lang="ts">
	import type { ActionData } from './$types';
	import Header from '$lib/Header.svelte';
	import { applyAction, enhance, deserialize } from '$app/forms';
	import { onMount } from "svelte";
	import { invalidateAll } from '$app/navigation';
	export let form: ActionData;

	let inputImage: any;
	let showImage = false;
	let image: any;
    let editor: any;
	let quill: any = null;
	
	export let toolbarOptions = [
		[{ header: 1 }, { header: 2 }, "blockquote", "link", "image", "video"],
		["bold", "italic", "underline", "strike"],
		[{ list: "ordered" }, { list: "ordered" }],
		[{ align: [] }],
		["clean"]
	];
	
	onMount(async () => {
		const { default: Quill } = await import("quill");
		
		quill = new Quill(editor, {
			modules: {
				toolbar: toolbarOptions
			},
				theme: "snow",
				placeholder: "Write your story..."
			});
	});

	async function handleSubmit(event: any) {
		event.stopImmediatePropagation();
		const data = new FormData(this);
		data.set("content", quill.root.innerHTML);

		const response = await fetch('?/create', {
			method: 'POST',
			body: data
		});

		const result = deserialize(await response.text());
		
		if (result.type === 'success') {
			await invalidateAll();
		}

		applyAction(result);
	}

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
	@import 'https://cdn.quilljs.com/1.3.6/quill.snow.css';

	#editor-container {
    max-height: 400px !important;
    overflow: auto !important;
  }

  /* ===== Scrollbar CSS ===== */
  /* Firefox */
  * {
    scrollbar-width: auto;
    scrollbar-color: #000000 #ffffff;
  }

  /* Chrome, Edge, and Safari */
  *::-webkit-scrollbar {
    width: 16px;
  }

  *::-webkit-scrollbar-track {
    background: #ffffff;
  }

  *::-webkit-scrollbar-thumb {
    background-color: #000000;
    border-radius: 10px;
    border: 3px solid #ffffff;
  }

  img {
	object-fit: contain !important;
	max-width: 100%;
	max-height: 100%;
  }

</style>

<Header photo={'/src/lib/assets/post-bg.jpg'} title={'Post!'} subtitle={'New Post!'} />
<div class="container px-1 px-lg-5 mx-auto w-75">
	<div class="row gx-4 gx-lg-5 justify-content-center">
		{#if !form?.invalid}
			<form
				method="POST"
				action="?/create"
				on:submit|once|preventDefault={handleSubmit}
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
                    <label class="form-label" for="content">Content</label>
					<div id="editor-container" bind:this={editor} />
                </div>
				<div class="px-2 py-4 py-md-2">
                    <label class="form-label" for="image">Post Image</label>
                    <input bind:this={inputImage} on:change={previewImage} class="form-control rounded" name="image" id="image" type="file" accept="image/png, image/jpeg, image/jpg" required />
					<img class="mt-4" bind:this={image} src="" alt="" />
				</div>
                <button type="submit" class="btn btn-primary ms-2 rounded mb-5 mt-2">Submit</button>
				<input style="display: none;" class="form-control rounded" name="content" id="content" type="textarea" />
			
			</form>
		{/if}
		{#if form?.invalid}
			<p class="error">Please ensure all fields are filled out.</p>
		{/if}
	</div>
</div>