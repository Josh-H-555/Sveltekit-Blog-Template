<script lang="ts">
	import Header from '$lib/Header.svelte';
	import { page } from '$app/stores';
</script>

<Header photo={"/src/lib/assets/" + encodeURI($page.data.blog.image)} title={'Welcome!'} subtitle={'This is a blog!'} />
<!-- Main Content-->
<!-- Post preview-->
<div class="container px-4 px-lg-5 mx-auto">
	{#if $page.data.posts}
	{#each $page.data.posts as post}
	<div class="post-preview">
		<a href="{$page.data.blog.slug}/post/{post.slug}">
			<h2 class="post-title">{post.title}</h2>
			<h3 class="post-subtitle">{post.subtitle}
				{#if $page.data.user}
				<a href="{$page.data.blog.slug}/post/edit/{post.slug}" class="btn btn-secondary float-end rounded-pill">Edit</a>
				{/if}
			</h3>
		</a>
		<p class="post-meta">
			Posted by
			<a href="/about">{post.author.name}</a>
			on {post.createdAt.toLocaleDateString()}
		</p>
	</div>
	{/each}
	{/if}
	<!-- Divider-->
	<hr class="my-4" />
	<!-- Pager-->
	<div class="d-flex justify-content-end mb-4">
		{#if $page.data.user}
		<a class="btn btn-primary text-uppercase" href="{$page.data.blog.slug}/post/create/{$page.data.blog.id}">New Post</a>
		{/if}
	</div>
</div>
