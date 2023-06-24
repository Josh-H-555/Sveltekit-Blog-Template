<script lang="ts">
	import Header from '$lib/Components/Header.svelte';
	// $page.data.blogs contains the blogs returned from server.ts
	import { page } from '$app/stores';
</script>

<Header
	photo={'/assets/home-bg.jpg'}
	title={'TODO'}
	subtitle={'TODO'}
/>
<!-- Main Content-->
<div class="container px-4 px-lg-5 mx-auto">
	<div class="row gx-4 gx-lg-4 justify-content-center">
		{#if $page.data.blogs}
			{#each $page.data.blogs as blog}
				{#if $page.data.user}
					<!--Admin card-->
					<div class="col mt-5" style={blog.active ? '' : 'opacity: 50%;'}>
						<div class="card mx-auto">
							<img src={blog.imagePath} alt="" class="card-img-top" />
							<div class="card-body">
								<h5 class="card-title">{blog.title}</h5>
								<p class="card-text">{blog.subtitle}</p>
								<a class="btn btn-primary rounded-pill" href="/blog/{blog.slug}">Go</a>
								<a class="btn btn-secondary float-end rounded-pill" href="/blog/edit/{blog.slug}" >Edit</a>
							</div>
						</div>
					</div>
				{:else}
					<!--Removes the buttons and instead makes the entire card a link
			This is a more fluid implementation for a user in my opinion,
			while admins have the buttons to enable editing-->
					<div class="col mt-5">
						<a class="card mx-auto card-anchor" href="/blog/{blog.slug}">
							<img class="card-img-top" src={blog.imagePath} alt="" />
							<div class="card-body">
								<h5 class="card-title">{blog.title}</h5>
								<p class="card-text">{blog.subtitle}</p>
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
					<img src="/assets/home-bg.jpg" alt="" class="card-img-top" />
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
