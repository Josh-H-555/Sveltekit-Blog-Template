import { db } from '$lib/Services/Database';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { writeFileSync } from 'fs';
import { UploadToCDN } from '$lib/Services/CDNService';
import { SERVER_TYPE } from '$env/static/private';

let blogId: number;
let userId: number;
let path: string;

// ensures only authenticated users can access.
// note, i don't have to do this in server.ts,
// i can access $page.data.user on the page.svelte
// but this seems more secure to me... not sure if that's true.
/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, params, url }: any) {
	if (!locals.user || locals.user.role != 'ADMIN') {
		throw redirect(302, '/');
	}
	userId = locals.user.id;
	blogId = parseInt(params.slug);
	path = url.pathname;
}

export const actions: Actions = {
	// create post action
	create: async ({ request }) => {
		// retrieves data from corresponding form
		const data = await request.formData();
		const _title = data.get('title');
		const _subtitle = data.get('subtitle');
		const _image = data.get('image');
		const _content = data.get('content');

		// ensures no empty fields
		if (!_title || !_subtitle || !_image || !_content) {
			return fail(400, { invalid: true });
		}

		// ensures no duplicate entries
		const posts = await db.post.findMany();
		if (posts) {
			for (let post of posts) {
				if (post.title.includes(_title as string)) {
					return fail(400, { invalid: true });
				}
			}
		}

		try {
			// correctly turns the image into the correct buffer format to write to
			let base64Image = Buffer.from(await (_image as File).arrayBuffer());

			/*
				Sveltekit does not allow us to read dynamically written files.
				We will use a CDN service (default use is Cloudinary)
				to store photos that are uploaded for blogs and post photos. 
			*/
			let response: any = await UploadToCDN(base64Image, (_image as File)?.name);
			if (!response.success) {
				return fail(400, { uploadFailed: true });
			}

			/* 
				In addition to CDN above, we will write to local /static/assets.
				In the event of a server rebuild, The app is configured
				to prioritize reading files locally instead of through the CDN.
			*/
			if (SERVER_TYPE !== 'serverless') {
				writeFileSync(`/assets/${(_image as File)?.name}`, base64Image, 'base64');
			}

			// create post
			await db.post.create({
				data: {
					title: _title as string,
					subtitle: _subtitle as string,
					content: _content as string,
					imageName: (_image as File)?.name,
					imageCDNUrl: response.result.secure_url,
					slug: (_title as string).replaceAll(' ', '-'),
					published: true,
					authorId: userId,
					parentBlogId: blogId as number
				}
			});
		} catch (error: any) {
			console.error(error);
		}

		// redirect to corresponding blog
		throw redirect(301, path.substring(0, path.indexOf('/post')));
	}
};
