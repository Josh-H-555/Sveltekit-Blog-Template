import { db } from '$lib/Services/Database';
import { CheckValidFile } from '$lib/Services/Helpers';

// grabs all of the blogs from the database on page load
/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	// grab all blogs if logged in, otherwise grab only active blogs
	let _blogs: any;
	_blogs = await db.blog.findMany({
		select: {
			id: true,
			title: true,
			subtitle: true,
			imageName: true,
			imageCDNUrl: true,
			createdAt: true,
			slug: true,
			active: true
		},
		where: {
			active: locals.user && locals.user.role === 'ADMIN' ? undefined : true
		}
	});

	// grabs the correct image path for each blog card
	let _blogsArray = [];
	let imagePath: string;
	for (let blog of _blogs) {
		imagePath = CheckValidFile(blog);
		blog.imagePath = imagePath;
		_blogsArray.push(blog);
	}

	// sorts by when the blog was first created, from left to right.
	let sortedBlogs = _blogsArray.sort((a: any, b: any) => {
		return a.createdAt.valueOf() - b.createdAt.valueOf();
	});

	return {
		blogs: sortedBlogs
	};
}
