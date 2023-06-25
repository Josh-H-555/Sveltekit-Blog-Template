import { db } from '$lib/Services/Database';
import { redirect } from '@sveltejs/kit';
import { CheckValidFile } from '$lib/Services/Helpers';

// grabs all of the blogs from the database on page load
/** @type {import('./$types').PageServerLoad} */
export async function load({ params }: any) {
	// retrieve post data
	let _post = await db.post.findUnique({
		select: {
			id: true,
			createdAt: true,
			updatedAt: true,
			title: true,
			subtitle: true,
			imageName: true,
			imageCDNUrl: true,
			content: true,
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
			slug: params.slug
		}
	});

	// if post doesn't exist, redirect
	if (!_post) {
		throw redirect(301, '/');
	}

	// ensure parent blog is published
	let _blog = await db.blog.findUnique({
		select: {
			active: true
		},
		where: {
			id: _post.parentBlogId
		}
	});

	// retrieve image path, either local or CDN
	let imagePath: string = CheckValidFile(_post);

	// just cast as any to get rid of error adding imagePath
	// as an attribute of the object to make things simpler.
	(_post as any).imagePath = imagePath;

	// if post isn't published, or blog isn't active, redirect
	if (_post.published && _blog?.active) {
		return {
			post: _post
		};
	}
	throw redirect(301, '/');
}
