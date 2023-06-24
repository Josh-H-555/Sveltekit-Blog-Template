// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

// interface locals gives access to the user from hooks / layout
/// <reference types="@sveltejs/kit" />
declare namespace App {
	interface Locals {
		user: {
			id: number;
			name: string;
			role: string;
		};
	}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}

declare module 'bcrypt';
declare module 'quill';
