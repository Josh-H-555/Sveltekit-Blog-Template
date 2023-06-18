<script>
	import { page } from '$app/stores';
	import Navbar from '$lib/Navbar.svelte';
	import Footer from '$lib/Footer.svelte';
</script>

<body>
	<!-- Navigation-->
	<Navbar user={$page.data.user} />
	<!-- Main Content-->
	<slot />
	<!-- Footer-->
	<Footer />
</body>
