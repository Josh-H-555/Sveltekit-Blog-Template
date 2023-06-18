import { db } from '$lib/database';
import { fail, redirect } from '@sveltejs/kit';
import { Actions } from '@sveltejs/kit';
import { writeFileSync } from 'fs';

let blogId: number;
let userId: number;

// ensures only authenticated users can access.
// note, i don't have to do this in server.ts,
// i can access $page.data.user on the page.svelte
// but this seems more secure to me... not sure if that's true.
/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, params }) {
	if (!locals.user || locals.user.role != 'ADMIN') {
		throw redirect(302, '/');
	}
	userId = locals.user.id;
	blogId = parseInt(params.slug);
}

export const actions: Actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const _title = data.get('title');
		const _subtitle = data.get('subtitle');
		const _image = data.get('image');
		const _content = data.get('content');

		const posts = await db.post.findMany();

		if (posts) {
			posts.forEach((post) => {
				if (post.title.includes(_title as string)) {
					return fail(400, { invalid: true });
				}
			});
		}

		try {
			await db.post.create({
				data: {
					title: _title as string,
					subtitle: _subtitle as string,
					content: _content as string,
					image: _image?.name,
					slug: (_title as string).replaceAll(' ', '-'),
					published: true,
					authorId: userId,
					parentBlogId: blogId as number
				}
			});

			// correctly turns the image into the correct buffer format to write to
			let base64Image = Buffer.from(await (_image as File).arrayBuffer());

			writeFileSync(`./src/lib/assets/${_image.name}`, base64Image, 'base64');
		} catch (error: any) {
			console.error(error);
		}

		throw redirect(301, '/');
	}
};
