import { db } from '$lib/database';

// grabs all of the blogs from the database on page load
/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	let _blogs: any;

	if (locals.user) {
		_blogs = await db.blog.findMany({
			select: {
				id: true,
				title: true,
				subtitle: true,
				image: true,
				slug: true,
				active: true
			}
		});
	} else {
		_blogs = await db.blog.findMany({
			select: {
				id: true,
				title: true,
				subtitle: true,
				image: true,
				slug: true,
				active: true
			},
			where: {
				active: true
			}
		});
	}

	return {
		blogs: _blogs
	};
}
