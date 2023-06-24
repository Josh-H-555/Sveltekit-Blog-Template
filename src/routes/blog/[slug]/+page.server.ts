import { db } from '$lib/Services/Database';
import { redirect } from '@sveltejs/kit';
import { CheckValidFile } from '$lib/Services/Helpers';

// grabs the correct blog on page load
/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals }: any) {
	let _blog = await db.blog.findUnique({
		select: {
			id: true,
			title: true,
			subtitle: true,
			imageName: true,
			imageCDNUrl: true,
			slug: true,
			active: true
		},
		where: {
			slug: params.slug
		}
	});

	// if blog isn't active and admin isn't logged in, go back to main page
	if (!_blog || (!_blog.active && !(locals.user && locals.user.role === 'ADMIN'))) {
		throw redirect(301, '/');
	}

	let imagePath: string = CheckValidFile(_blog);

	// just cast as any to get rid of error adding imagePath
	// as an attribute of the object to make things simpler.
	(_blog as any).imagePath = imagePath;

	// if logged in, grab all posts, otherwise only grab published posts.
	let _posts: any;
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
			published: locals.user && locals.user.role === 'ADMIN' ? undefined : true
		}
	});

	// sort posts by created date, newest posts appearing at the top.
	let sortedPosts = _posts.sort((a: any, b: any) => {
		return b.createdAt.valueOf() - a.createdAt.valueOf();
	});

	return {
		blog: _blog,
		posts: sortedPosts,
		noFurtherUpdates: true
	};
}
