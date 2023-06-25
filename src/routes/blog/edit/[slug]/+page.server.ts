import { db } from '$lib/Services/Database';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { writeFileSync } from 'fs';
import { UploadToCDN } from '$lib/Services/CDNService';
import { CheckValidFile } from '$lib/Services/Helpers';
import { SERVER_TYPE } from '$env/static/private';

interface BlogData {
	id: number;
	imageName: string;
	imageCDNUrl: string;
}

// holds onto previous blog data for comparison and persistence
let blogData: BlogData = {} as BlogData;

// ensures only authenticated users can access.
// note, i don't have to do this in server.ts,
// i can access $page.data.user on the page.svelte
// but this seems more secure to me... not sure if that's true.
/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, params }: any) {
	if (!locals.user || locals.user.role != 'ADMIN') {
		throw redirect(302, '/');
	}

	// retrieves current blog content
	const _blog = await db.blog.findUnique({
		select: {
			id: true,
			title: true,
			subtitle: true,
			active: true,
			imageName: true,
			imageCDNUrl: true
		},
		where: {
			slug: params.slug
		}
	});

	// return either local photo path or CDN photo path
	let imagePath: string = CheckValidFile(_blog);

	// sets blog data for use in the page, as well as persistence when updating.
	blogData.id = _blog?.id as number;
	blogData.imageName = _blog?.imageName as string;
	blogData.imageCDNUrl = _blog?.imageCDNUrl as string;

	// just cast as any to get rid of error adding imagePath
	// as an attribute of the object to make things simpler.
	(_blog as any).imagePath = imagePath;

	return { blog: _blog };
}

export const actions: Actions = {
	// edit blog action
	edit: async ({ request }) => {
		// retrieves data from corresponding form
		const data = await request.formData();
		const _title = data.get('title');
		const _subtitle = data.get('subtitle');
		const _image = data.get('image');
		const _active = data.get('active');

		// ensures no empty required fields
		if (!_title || !_subtitle) {
			return fail(400, { invalid: true });
		}

		// ensures no duplicate blog titles
		const blogs = await db.blog.findMany();
		if (blogs) {
			for (let blog of blogs) {
				if (blog.title.includes(_title as string) && blog.id != blogData.id) {
					return fail(400, { duplicate: true });
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
				if (SERVER_TYPE !== 'serverless') {
					writeFileSync(`/assets/${(_image as File)?.name}`, base64Image, 'base64');
				}
			}

			// update database values
			await db.blog.update({
				data: {
					title: _title as string,
					subtitle: _subtitle as string,
					imageName: ((_image as File)?.name as string).includes('undefined')
						? blogData.imageName
						: (_image as File)?.name,
					imageCDNUrl: !response ? blogData.imageCDNUrl : response.result.secure_url,
					slug: (_title as string).replaceAll(' ', '-'),
					active: _active === null ? false : true
				},
				where: {
					id: blogData.id
				}
			});
		} catch (error: any) {
			console.error(error);
		}

		throw redirect(301, '/');
	}
};
