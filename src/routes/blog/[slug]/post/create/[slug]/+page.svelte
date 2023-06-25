<script lang="ts">
	import type { ActionData } from './$types';
	import Header from '$lib/Components/Header.svelte';
	import { applyAction, enhance, deserialize } from '$app/forms';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	export let form: ActionData;

	let inputImage: any;
	let showImage = false;
	let image: any;
	let editor: any;
	let quill: any = null;
	

	let newTitle = '';
	let newSubtitle = '';
	let imageUrl = '/assets/post-bg.jpg';

	$: reactiveTitle = newTitle;
	$: reactiveSubtitle = newSubtitle;
	$: reactiveImage = imageUrl;

	//quilljs toolbar options
	export let toolbarOptions = [
		[{ header: [1, 2, 3, false] }], [{size: ['small', false]}, 'link', 'image', 'video'],
		['bold', 'italic', 'underline', 'strike'],
		[{ list: 'ordered' }, { list: 'bullet' }, 'code-block', 'blockquote'],
		[{ align: [] }],
		['clean']
	];

	// quilljs wsywig editor functionality and ensure image src attribute set on load.
	onMount(async () => {
		const { default: Quill } = await import('quill');

		quill = new Quill(editor, {
			modules: {
				toolbar: toolbarOptions
			},
			theme: 'snow',
			placeholder: 'Write your story...'
		});
	});

	// custom submit to grab the quilljs innerHTML data to flow through
	async function handleSubmit(this: any, event: any) {
		event.stopImmediatePropagation();
		const data = new FormData(this);
		data.set('content', quill.root.innerHTML);

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

<Header photo={reactiveImage} title={newTitle === '' ? 'Post!' : reactiveTitle} subtitle={newSubtitle === '' ? 'Create a new blog!' : reactiveSubtitle} />
<div class="container px-1 px-lg-5 mx-auto w-75">
	<div class="row gx-4 gx-lg-5 justify-content-center">
		{#if !form?.invalid}
			<form
				on:submit|once|preventDefault={handleSubmit}
				use:enhance
				method="POST"
				action="?/create"
			>
				<div class="px-2 py-4 py-md-2">
					<label class="form-label" for="title">Title</label>
					<input bind:value={newTitle} class="form-control rounded" id="title" name="title" type="text" required />
				</div>
				<div class="px-2 py-4 py-md-2">
					<label class="form-label" for="subtitle">Subtitle</label>
					<input bind:value={newSubtitle} class="form-control rounded" id="subtitle" name="subtitle" type="text" required />
				</div>
				<div class="px-2 py-4 py-md-2">
					<label class="form-label" for="content">Content</label>
					<div bind:this={editor} id="editor-container" />
				</div>
				<div class="px-2 py-4 py-md-2">
					<label class="form-label" for="image">Post Image</label>
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
				<input
					class="form-control rounded"
					id="content"
					name="content"
					type="textarea"
					style="display: none;"
				/>
			</form>
		{/if}
		{#if form?.invalid}
			<p class="alert alert-danger">Please ensure all fields are filled out.</p>
		{/if}
		{#if form?.uploadFailed}
			<p class="alert alert-danger">Issue with CDN.</p>
		{/if}
	</div>
</div>

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
