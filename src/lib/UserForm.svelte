<script lang="ts">
	export let title: string;
</script>

<h1>{title}</h1>

<!--lots of if conditions, but allows a real easy reuse for other components-->

{#if title.toLowerCase().includes('register') && !title.toLowerCase().includes('reset')}
	<div class="px-2 py-4 py-md-2">
		<label class="form-label" for="name">Name</label>
		<input class="form-control rounded" name="name" id="name" type="text" required />
	</div>
{/if}
{#if !title.toLowerCase().includes('change')}
<div class="px-2 py-4 py-md-2">
	<label class="form-label" for="email">Email</label>
	<input class="form-control rounded" type="email" name="email" id="email" required />
</div>
{/if}
{#if !title.toLowerCase().includes('reset')}
<div class="px-2 py-4 py-md-2">
	<label class="form-label" for="password">Password</label>
	<input class="form-control rounded" name="password" id="password" type="password" required />
</div>
{/if}
{#if title.toLowerCase().includes('change')}
<div class="px-2 py-4 py-md-2">
	<label class="form-label" for="confirm">Confirm Password</label>
	<input class="form-control rounded" name="confirm" id="confirm" type="password" required />
</div>
{/if}
<button type="submit" class="btn btn-primary ms-2 rounded mb-5 mt-2">{title}</button>
