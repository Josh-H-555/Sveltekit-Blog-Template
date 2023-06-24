<script lang="ts">
	import { page } from '$app/stores';
	import Navbar from '$lib/Components/Navbar.svelte';
	import Footer from '$lib/Components/Footer.svelte';

	let scrollPosition: any;

	// Hides the navbar upon scrolling down a sufficient amount
	function handleNavbarScroll() {
		const mainNav: any = document.getElementById('mainNav');
		const newScrollPosition: number = window.scrollY;
		const visibility: number = newScrollPosition - scrollPosition;
		scrollPosition = newScrollPosition;
		mainNav.classList[visibility > 0 && scrollPosition > 200 ? 'add' : 'remove']('hide');
	};
</script>

<svelte:window bind:scrollY={scrollPosition} on:scroll={handleNavbarScroll} />

<body>
	<!-- Navigation-->
	<Navbar user={$page.data.user} />
	<!-- Main Content-->
	<slot />
	<!-- Footer-->
	<Footer />
</body>
