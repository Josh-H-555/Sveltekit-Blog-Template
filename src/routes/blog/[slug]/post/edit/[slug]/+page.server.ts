import { db } from '$lib/database';
import { fail, redirect } from '@sveltejs/kit';
import { Actions } from '@sveltejs/kit';
import { writeFileSync } from 'fs';

interface PostData {
	id: number;
	image: string;
}

let postData: PostData = {};

let blogId: number;
let userId: number;
let path: string;

// ensures only authenticated users can access.
// note, i don't have to do this in server.ts,
// i can access $page.data.user on the page.svelte
// but this seems more secure to me... not sure if that's true.
/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, params, url }) {
	if (!locals.user || locals.user.role != 'ADMIN') {
		throw redirect(302, '/');
	}
	userId = locals.user.id;
	blogId = parseInt(params.slug);
	path = url.pathname;
	const _post = await db.post.findUnique({
		where: {
			slug: params.slug
		},
		select: {
			id: true,
			title: true,
			subtitle: true,
			published: true,
			image: true,
			content: true
		}
	});
	postData.id = _post?.id as number;
	postData.image = _post?.image as string;
	return { post: _post };
}

export const actions: Actions = {
	edit: async ({ request }) => {
		const data = await request.formData();
		const _title = data.get('title');
		const _subtitle = data.get('subtitle');
		const _image = data.get('image');
		const _content = data.get('content');
		const _published = data.get('published');

		const posts = await db.post.findMany();
		if (posts) {
			posts.forEach((post) => {
				if (post.title.includes(_title as string) && post.id !== postData.id) {
					return fail(400, { invalid: true });
				}
			});
		}

		try {
			await db.post.update({
				where: {
					id: postData.id
				},
				data: {
					title: _title as string,
					subtitle: _subtitle as string,
					content: _content as string,
					image: (_image?.name as string).includes('undefined') ? postData.image : _image?.name,
					slug: (_title as string).replaceAll(' ', '-'),
					published: _published === null ? false : true
				}
			});

			// correctly turns the image into the correct buffer format to write to
			if (!(_image?.name as string).includes('undefined')) {
				let base64Image = Buffer.from(await (_image as File).arrayBuffer());
				writeFileSync(`./src/lib/assets/${_image?.name}`, base64Image, 'base64');
			}
		} catch (error: any) {
			console.error(error);
		}

		throw redirect(301, path.substring(0, path.indexOf('/post')));
	}
};
