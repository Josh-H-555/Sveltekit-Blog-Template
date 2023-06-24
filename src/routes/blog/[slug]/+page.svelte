<script lang="ts">
	import Header from '$lib/Components/Header.svelte';
	import { page } from '$app/stores';
</script>

<Header
	photo={encodeURI($page.data.blog.imagePath)}
	title={$page.data.blog.title}
	subtitle={$page.data.blog.subtitle}
/>
<!-- Main Content-->
<!-- Post preview-->
<div class="container px-4 px-lg-5 mx-auto">
	{#if $page.data.posts}
		{#each $page.data.posts as post}
			<div class="post-preview" style={post.published ? '' : 'opacity: 50%;'}>
				<a href="{$page.data.blog.slug}/post/{post.slug}">
					<h2 class="post-title">{post.title}</h2>
					<h3 class="post-subtitle">
						{post.subtitle}
						{#if $page.data.user}
							<a class="btn btn-secondary float-end rounded-pill" 
								href="{$page.data.blog.slug}/post/edit/{post.slug}" 
								style="opacity: 100%;"
							>
								Edit
							</a>
						{/if}
					</h3>
				</a>
				<p class="post-meta">
					Posted by
					<a href="/about">{post.author.name}</a>
					on {post.createdAt.toLocaleDateString()}
				</p>
			</div>

			<!-- Divider-->
			<hr class="my-4" />
		{/each}
	{/if}
	<!-- Pager-->
	<div class="d-flex justify-content-end mb-4">
		{#if $page.data.user}
			<a
				class="btn btn-primary text-uppercase"
				href="{$page.data.blog.slug}/post/create/{$page.data.blog.id}">New Post</a
			>
		{/if}
	</div>
</div>
