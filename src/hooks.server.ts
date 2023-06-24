import { db } from '$lib/Services/Database';
import { TWILIO_KEY, DEV_URL, PROD_URL, ENV, EMAIL, SITE } from '$env/static/private';
import { createRequire } from 'module';
import type { Handle } from '@sveltejs/kit';
import { GenerateRegisterSlug } from '$lib/Services/Helpers';

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
	const registrationSlug: string = GenerateRegisterSlug();

	// create an empty user with a unique registration slug.
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
		console.log('Error creating startup user');
	}

	// use correct URL depending on environment.
	let siteURL;
	if (ENV === 'DEV') {
		siteURL = DEV_URL;
	} else {
		siteURL = PROD_URL;
	}

	// sends email from SITE to EMAIL with a generated slug for registration.
	const sgMail = require('@sendgrid/mail');

	sgMail.setApiKey(TWILIO_KEY);
	const msg = {
		to: `${EMAIL}`,
		from: `${SITE}`,
		subject: 'Initial Startup Login',
		text: `Use this link to register! ${siteURL + 'register/' + registrationSlug}`
	};
	try {
		await sgMail.send(msg);
		console.log('Initial startup email sent');
	} catch (error: any) {
		console.error(error);
		console.log('Error sending initial startup email');
	}
}

// handles cookies to ensure the local user is persisted
export const handle: Handle = async ({ event, resolve }) => {
	const session = event.cookies.get('session');

	// loads the page like normal if there is no session
	if (!session) {
		return await resolve(event);
	}

	const user = await db.user.findUnique({
		select: { id: true, name: true, role: true },
		where: { userAuthToken: session }
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
