import { db } from '$lib/database';
import { redirect } from '@sveltejs/kit';

let blogLoad = false;

// grabs all of the blogs from the database on page load
/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals }) {
	let _blog = await db.blog.findUnique({
		where: {
			slug: params.slug
		}
	});

	// if blog isn't active and admin isn't logged in, go back to main page
	if (!_blog || (!_blog.active && !locals.user)) {
		throw redirect(301, '/');
	}

	let _posts: any;
	if (locals.user) {
		_posts = await db.post.findMany({
			select: {
				id: true,
				createdAt: true,
				title: true,
				subtitle: true,
				published: true,
				parentBlogId: true,
				slug: true,
				author: {
					select: {
						name: true
					}
				}
			},
			where: {
				parentBlogId: _blog.id
			}
		});
	} else {
		_posts = await db.post.findMany({
			select: {
				id: true,
				createdAt: true,
				title: true,
				subtitle: true,
				published: true,
				parentBlogId: true,
				slug: true,
				author: {
					select: {
						name: true
					}
				}
			},
			where: {
				parentBlogId: _blog.id,
				published: true
			}
		});
	}

	let sortedPosts = _posts.sort((a: any, b: any) => {
		return b.createdAt.valueOf() - a.createdAt.valueOf();
	});

	return {
		blog: _blog,
		posts: sortedPosts,
		noFurtherUpdates: true
	};
}
