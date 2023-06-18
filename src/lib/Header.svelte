<script lang="ts">
	// allows easy reuse and customization of each page's header.
	export let photo: string;
	export let title: string;
	export let subtitle: string;
	export let postAuthorInfo: string = '';
	export let postUpdateInfo: string = '';
</script>

<!-- Page Header-->
<header class="masthead" style="background-image: url({photo});">
	<div class="container position-relative px-4 px-lg-5">
		<div class="row gx-4 gx-lg-5 justify-content-center">
			<div class="col-md-10 col-lg-10 col-xl-10">
				<div class="site-heading">
					<h1>{title}</h1>
					<h2 class="subheading">{subtitle}</h2>
					<span class="meta">
						{postAuthorInfo}
						<br>
						{postUpdateInfo}
					</span>
				</div>
			</div>
		</div>
	</div>
</header>

<style>
	.site-heading .subheading {
		font-size: 2rem;
	}
	.meta {
		font-size: 1rem;
	}
</style>
