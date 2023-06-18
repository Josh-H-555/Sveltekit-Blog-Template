import type { LayoutServerLoad } from './$types';

// since layout is on each page, a simple way to propagate the user to other pages
export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		user: locals.user
	};
};
