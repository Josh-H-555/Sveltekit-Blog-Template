import { db } from '$lib/database';
import { redirect } from '@sveltejs/kit';

// grabs all of the blogs from the database on page load
/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	let _post = await db.post.findUnique({
		select: {
			id: true,
			createdAt: true,
			updatedAt: true,
			title: true,
			subtitle: true,
			image: true,
			content: true,
			published: true,
			slug: true,
			author: {
				select: {
					name: true
				}
			}
		},
		where: {
			slug: params.slug
		}
	});

	if (_post.published) {
		return {
			post: _post
		};
	}
	throw redirect(301, '/');
}
