import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import { PRIVATE_GOOGLE_SECRET_KEY } from '$env/static/private';

/* 
    Checks if the photo can be read. If the app has been rebuilt
    after uploading the photos, we will set the source to the
    assets folder. Otherwise, we will use the image CDN.
*/
export function CheckValidFile(item: any) {
	// creates a path that will allow us to read from Sveltekit's
	// generated assets folder.
	const _filename = fileURLToPath(import.meta.url);
	let outputPath = _filename.substring(0, _filename.indexOf('\\output'));

	let imagePath: string;
	try {
		readFileSync(`${outputPath}/output/client/assets/${item.imageName}`, {
			encoding: 'utf8',
			flag: 'r'
		});

		return `/assets/${item.imageName}`;
	} catch {
		return item.imageCDNUrl;
	}
}

/**
 * Given a token, make a POST request to Google's reCAPTCHA API to
 * validate the given token. Used in login and password reset.
 * @param token
 * @returns JSON response
 */
export async function CheckCaptcha(token: any) {
	const response = await fetch(
		`https://www.google.com/recaptcha/api/siteverify?secret=${PRIVATE_GOOGLE_SECRET_KEY}&response=${token}`,
		{
			method: 'POST'
		}
	);

	return await response.json();
}

/**
 * Generates and returns a randomized string of characters for a slug
 * @returns randomized string of characters
 */
export function GenerateRegisterSlug() {
	const randomCharacters: string = '123456790qwertyuiopasdfghjklzxxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
	let tempSlug: string = '';

	for (let i = 0; i < 48; ++i) {
		let randomNumber: number = Math.round(Math.random() * (randomCharacters.length - 1));
		tempSlug += randomCharacters[randomNumber];
	}

	const slug: string = tempSlug;

	return slug;
}
