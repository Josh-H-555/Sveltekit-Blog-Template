import { db } from '$lib/database';
import { fail, redirect } from '@sveltejs/kit';
import { Actions } from '@sveltejs/kit';
import { writeFileSync } from 'fs';

interface BlogData {
	id: number;
	image: string;
}

let blogData: BlogData = {};

// ensures only authenticated users can access.
// note, i don't have to do this in server.ts,
// i can access $page.data.user on the page.svelte
// but this seems more secure to me... not sure if that's true.
/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, params }) {
	if (!locals.user || locals.user.role != 'ADMIN') {
		throw redirect(302, '/');
	}
	const _blog = await db.blog.findUnique({
		where: {
			slug: params.slug
		},
		select: {
			id: true,
			title: true,
			subtitle: true,
			active: true,
			image: true
		}
	});
	blogData.id = _blog?.id as number;
	blogData.image = _blog?.image as string;
	return { blog: _blog };
}

// action to edit a blog
export const actions: Actions = {
	edit: async ({ request }) => {
		const data = await request.formData();
		const _title = data.get('title');
		const _subtitle = data.get('subtitle');
		const _image = data.get('image');
		const _active = data.get('active');

		const blogs = await db.blog.findMany();

		// ensures no duplicate blog titles
		if (blogs) {
			blogs.forEach((blog) => {
				if (blog.title.includes(_title as string) && blog.id !== blogData.id) {
					return fail(400, { invalid: true });
				}
			});
		}

		try {
			await db.blog.update({
				where: {
					id: blogData.id
				},
				data: {
					title: _title as string,
					subtitle: _subtitle as string,
					image: (_image?.name as string).includes('undefined') ? blogData.image : _image?.name,
					slug: (_title as string).replaceAll(' ', '-'),
					active: _active === null ? false : true
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

		throw redirect(301, '/');
	}
};
