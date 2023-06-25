import { db } from '$lib/Services/Database';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { writeFileSync } from 'fs';
import { UploadToCDN } from '$lib/Services/CDNService';
import { SERVER_TYPE } from '$env/static/private';

// ensures only authenticated users can access.
// note, i don't have to do this in server.ts,
// i can access $page.data.user on the page.svelte
// but this seems more secure to me... not sure if that's true.
/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, params }: any) {
	if (!locals.user || locals.user.role != 'ADMIN') {
		throw redirect(302, '/');
	}
}

export const actions: Actions = {
	// create blog action
	create: async ({ request }) => {
		// retrieves data from corresponding form
		const data = await request.formData();
		const _title = data.get('title');
		const _subtitle = data.get('subtitle');
		const _image = data.get('image');

		// ensures no empty fields
		if (!_title || !_subtitle || !_image) {
			return fail(400, { invalid: true });
		}

		// ensures no duplicate entries
		const blogs = await db.blog.findMany();
		if (blogs) {
			for (let blog of blogs) {
				if (blog.title.includes(_title as string)) {
					return fail(400, { duplicate: true });
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

			// create blog
			await db.blog.create({
				data: {
					title: _title as string,
					subtitle: _subtitle as string,
					imageName: (_image as File)?.name,
					imageCDNUrl: response.result.secure_url,
					slug: (_title as string).replaceAll(' ', '-'),
					active: true
				}
			});
		} catch (error: any) {
			console.error(error);
		}

		throw redirect(303, '/');
	}
};
