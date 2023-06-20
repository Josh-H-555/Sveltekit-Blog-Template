<script lang="ts">
	import Header from '$lib/Header.svelte';
	// $page.data.blogs contains the blogs returned from server.ts
	import { page } from '$app/stores';
</script>

<Header
	photo={'/src/lib/assets/home-bg.jpg'}
	title={'Games & Tech!'}
	subtitle={'Plenty of blogs. Pick one below!'}
/>
<!-- Main Content-->
<div class="container px-4 px-lg-5 mx-auto">

	<div class="row gx-4 gx-lg-4 justify-content-center">

		{#if $page.data.blogs}
		{#each $page.data.blogs as blog}
		{#if $page.data.user}

		<!--Admin card-->
		<div class="col mt-5" style={blog.active ? "" : "opacity: 50%;"}>
			<div class="card mx-auto">
				<img src="/src/lib/assets/{blog.image}" alt="" class="card-img-top" />
				<div class="card-body">
					<h5 class="card-title">{ blog.title }</h5>
					<p class="card-text">{ blog.subtitle }</p>
					<a href="/blog/{blog.slug}" class="btn btn-primary rounded-pill">Go</a>
					<a href="/blog/edit/{blog.slug}" class="btn btn-secondary float-end rounded-pill">Edit</a>
				</div>
			</div>
		</div>

		{:else}

		<!--Removes the buttons and instead makes the entire card a link
			This is a more fluid implementation for a user in my opinion,
			while admins have the buttons to enable editing-->
		<div class="col mt-5">
			<a href="/blog/{blog.slug}" class="card mx-auto card-anchor">
				<img src="/src/lib/assets/{blog.image}" alt="" class="card-img-top" />
				<div class="card-body">
					<h5 class="card-title">{ blog.title }</h5>
					<p class="card-text">{ blog.subtitle }</p>
				</div>
			</a>
		</div>

		{/if}
		{/each}
		{/if}

		<!--Allows admin to create new blog-->
		{#if $page.data.user}
		<div class="col mt-5">
			<div class="card mx-auto">
				<img src="/src/lib/assets/home-bg.jpg" alt="" class="card-img-top" />
				<div class="card-body">
					<h5 class="card-title">New Blog</h5>
					<p class="card-text">Create a new blog!</p>
					<a href="/blog/create" class="btn btn-primary rounded-pill">Go</a>
				</div>
			</div>
		</div>
		{/if}
	</div>

</div>

<style>
	.card {
		width: 20rem;
	}
</style>
