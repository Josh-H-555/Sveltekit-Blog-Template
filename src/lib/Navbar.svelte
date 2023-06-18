<script lang="ts">
	import { enhance } from "$app/forms";

	export let user: any;

	// we bind innerWidth and use it to dynamically set the data-bs-toggle attribute
	// without the dynamic data-bs-toggle, the navbar acts strangely on desktop.
	let innerWidth: any;

</script>

<svelte:window bind:innerWidth />

<nav class="navbar navbar-expand-lg navbar-light" id="mainNav">
	<div class="container px-4 px-lg-5">
		<a class="navbar-brand" href="/">GTG</a>
		{#if user}
		<ul class="navbar-nav ms-auto py-4 py-lg-0">
			<li class="nav-item">
				<a class="nav-link px-lg-3 py-3 py-lg-4 nav-username">Hello, {user.name}</a>
			</li>
		</ul>
		{/if}
		<button
			class="navbar-toggler"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#navbarResponsive"
			aria-controls="navbarResponsive"
			aria-expanded="false"
			aria-label="Toggle navigation"
		>
			Menu
			<i class="fas fa-bars" />
		</button>
		<div class="collapse navbar-collapse" id="navbarResponsive">
			<ul class="navbar-nav ms-auto py-4 py-lg-0">
				<li class="nav-item">
					<a class="nav-link px-lg-3 py-3 py-lg-4" href="/"><span data-bs-toggle={innerWidth > 992 ? '' : 'collapse'} data-bs-target="#navbarResponsive">Home</span></a>
				</li>
				<li class="nav-item">
					<a class="nav-link px-lg-3 py-3 py-lg-4" href="/about"><span data-bs-toggle={innerWidth > 992 ? '' : 'collapse'} data-bs-target="#navbarResponsive">About</span></a>
				</li>
				<li class="nav-item">
					<a class="nav-link px-lg-3 py-3 py-lg-4" href="/contact"><span data-bs-toggle={innerWidth > 992 ? '' : 'collapse'} data-bs-target="#navbarResponsive">Contact</span></a>
				</li>
				{#if user}
					<li class="nav-item">
						<!--hacky way to get the the logout button to have the same styling as nav-items-->
						<a id="logoutButton" onclick="document.getElementById('logoutForm').submit()" class="nav-link px-lg-3 py-3 py-lg-4" href="/">Logout</a>
						<form id="logoutForm" class="nav-item px-lg-3 py-3 py-lg-3" action="/logout" method="POST" use:enhance>
						</form>
					</li>
				{/if}
			</ul>
		</div>
	</div>
</nav>
