<script>
	import Header from '$lib/Components/Header.svelte';
	import { page } from '$app/stores';
</script>

<Header
	photo={encodeURI($page.data.post.imagePath)}
	title={$page.data.post.title}
	subtitle={$page.data.post.subtitle}
	postAuthorInfo={`Posted by ${$page.data.post.author.name} on ${$page.data.post.createdAt.toLocaleDateString()}`}
	postUpdateInfo={$page.data.post.createdAt.toLocaleDateString() ===
	$page.data.post.updatedAt.toLocaleDateString()
		? ''
		: `Updated on ${$page.data.post.updatedAt.toLocaleDateString()}`}
/>
<!-- Post Content-->
<article class="mb-4 postBody">
	<div class="container px-4 px-lg-5">
		<div class="row gx-4 gx-lg-5 justify-content-center">
			<div class="col-md-10 col-lg-10 col-xl-9">
				{@html $page.data.post.content}
			</div>
			<div class="col-md-5 col-lg-4 col-xl-5 mt-4 flex-column align-self-center">
				<p class="mb-0">Liked this post? Check out more!</p>
			</div>
			<div class="col-md-5 col-lg-4 col-xl-4 mt-4 justify-content-end" style="display: flex;">
				<a
					class="btn btn-primary btn-rounded"
					href={$page.url.pathname.substring(0, $page.url.pathname.indexOf('/post'))}
				>
					Go Back
				</a>
			</div>
		</div>
	</div>
</article>
