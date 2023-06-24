import { db } from '$lib/Services/Database';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { writeFileSync } from 'fs';
import { UploadToCDN } from '$lib/Services/CDNService';
import { CheckValidFile } from '$lib/Services/Helpers';

interface PostData {
	id: number;
	imageName: string;
	imageCDNUrl: string;
}

// holds onto previous blog data for comparison and persistence
let postData: PostData = {} as PostData;
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

	// grabs path to redirect to upon edit completion
	path = url.pathname;

	// retrieves current post content
	const _post = await db.post.findUnique({
		select: {
			id: true,
			title: true,
			subtitle: true,
			published: true,
			imageName: true,
			imageCDNUrl: true,
			content: true
		},
		where: {
			slug: params.slug
		}
	});

	// return either local photo path or CDN photo path
	let imagePath: string = CheckValidFile(_post);

	// sets post data for use in the page, as well as persistence when updating.
	postData.id = _post?.id as number;
	postData.imageName = _post?.imageName as string;
	postData.imageCDNUrl = _post?.imageCDNUrl as string;

	// just cast as any to get rid of error adding imagePath
	// as an attribute of the object to make things simpler.
	(_post as any).imagePath = imagePath;

	return { post: _post };
}

export const actions: Actions = {
	// edit post action
	edit: async ({ request }) => {
		// retrieves data from corresponding form
		const data = await request.formData();
		const _title = data.get('title');
		const _subtitle = data.get('subtitle');
		const _image = data.get('image');
		const _content = data.get('content');
		const _published = data.get('published');

		if (!_title || !_subtitle || !_content) {
			return fail(400, { invalid: true });
		}

		// ensures no duplicate blog titles
		const posts = await db.post.findMany();
		if (posts) {
			for (let post of posts) {
				if (post.title.includes(_title as string) && post.id !== postData.id) {
					return fail(400, { invalid: true });
				}
			}
		}

		try {
			let response: any;

			// Only upload and write image if a new image has been uploaded.
			if (!((_image as File)?.name as string).includes('undefined')) {
				// correctly turns the image into the correct buffer format to write to
				let base64Image = Buffer.from(await (_image as File).arrayBuffer());

				/*
					Sveltekit does not allow us to read dynamically written files.
					We will use a CDN service (default use is Cloudinary)
					to store photos that are uploaded for blogs and post photos. 
				*/
				response = await UploadToCDN(base64Image, (_image as File)?.name);
				if (!response.success) {
					return fail(400, { uploadFailed: true });
				}

				/* 
					In addition to CDN above, we will write to local /static/assets.
				 	In the event of a server rebuild, The app is configured
				 	to prioritize reading files locally instead of through the CDN.
				*/
				writeFileSync(`./static/assets/${(_image as File)?.name}`, base64Image, 'base64');
			}

			// update database values
			await db.post.update({
				data: {
					title: _title as string,
					subtitle: _subtitle as string,
					content: _content as string,
					imageName: ((_image as File)?.name as string).includes('undefined')
						? postData.imageName
						: (_image as File)?.name,
					imageCDNUrl: !response ? postData.imageCDNUrl : response.result.secure_url,
					slug: (_title as string).replaceAll(' ', '-'),
					published: _published === null ? false : true
				},
				where: {
					id: postData.id
				}
			});
		} catch (error: any) {
			console.error(error);
		}

		// return to associated blog page
		throw redirect(301, path.substring(0, path.indexOf('/post')));
	}
};
