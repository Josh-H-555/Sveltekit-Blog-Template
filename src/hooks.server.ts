import { db } from '$lib/database';
import { TWILIO_KEY, DEV_URL, EMAIL, SITE } from '$env/static/private';
import { createRequire } from 'module';
import type { Handle } from '@sveltejs/kit';

//needed for sendgrid mail
const require = createRequire(import.meta.url);

// checks if there are any users in the database on startup.
const getStartupUser: object | null = await db.user.findMany({
	select: {
		email: true
	}
});

// why am i using Object.keys??? i have no idea. i wrote this a while ago.
// either way, if there are no users, send an email to specified admin email from env
if (!Object.keys(getStartupUser).length) {
	const registrationSlug: string = generateRegisterSlug();

	try {
		await db.user.create({
			data: {
				name: '',
				email: '',
				password: '',
				providerId: '',
				userAuthToken: '',
				registerSlug: registrationSlug
			}
		});
	} catch {
		console.log('Error sending initial startup email');
	}

	// sends the from SITE to EMAIL email with a generated slugs
	const sgMail = require('@sendgrid/mail');
	sgMail.setApiKey(TWILIO_KEY);
	const msg = {
		to: `${EMAIL}`,
		from: `${SITE}`,
		subject: 'Initial Startup Login',
		text: `Use this link to register! ${DEV_URL + 'register/' + registrationSlug}`
	};
	sgMail
		.send(msg)
		.then(() => {
			console.log('Initial startup email sent');
		})
		.catch((error: any) => {
			console.error(error);
		});
}

/**
 * Generates and returns a randomized string of characters for a slug
 * Probably not necessary, but was fun to build. :)
 * @returns randomized string of characters
 */
function generateRegisterSlug() {
	const randomCharacters: string = '123456790qwertyuiopasdfghjklzxxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
	let tempSlug: string = '';

	for (let i = 0; i < 16; ++i) {
		let randomNumber: number = Math.round(Math.random() * (randomCharacters.length - 1));
		tempSlug += randomCharacters[randomNumber];
	}

	const slug: string = tempSlug;

	return slug;
}

// handles cookies to ensure the local user is persisted
export const handle: Handle = async ({ event, resolve }) => {
	const session = event.cookies.get('session');

	// loads the page like normal if there is no session
	if (!session) {
		return await resolve(event);
	}

	const user = await db.user.findUnique({
		where: { userAuthToken: session },
		select: { id: true, name: true, role: true }
	});

	if (user) {
		event.locals.user = {
			id: user.id,
			name: user.name,
			role: user.role
		};
	}

	return await resolve(event);
};
