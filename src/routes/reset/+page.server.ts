import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/database';
import { TWILIO_KEY, DEV_URL, EMAIL, SITE } from '$env/static/private';
import { createRequire } from 'module';
import { reset } from '__sveltekit/paths';

const require = createRequire(import.meta.url);

let resettingUser: any;

// reset action makes sure the user already has an email and valid password by checking
// if the slug was consumed. then, send an email from SITE to EMAIL like register.
export const actions: Actions = {
	reset: async ({ request }) => {
		const data = await request.formData();
		const _email = await data.get('email');

		resettingUser = await db.user.findUnique({
			where: {
				email: _email as string
			},
			select: {
				email: true,
				registerSlug: true
			}
		});

		let userEmail = resettingUser.email;

		// if registerSlug is not consumed, the user either isn't registered, or already
		// sent a reset email
		if (resettingUser && resettingUser.registerSlug.includes('CONSUMED')) {
			const registrationSlug = generateRegisterSlug();
			resettingUser = await db.user.update({
				where: {
					email: _email as string
				},
				data: {
					registerSlug: registrationSlug
				}
			});
			const sgMail = require('@sendgrid/mail');
			sgMail.setApiKey(TWILIO_KEY);
			const msg = {
				to: `${userEmail}`,
				from: `${SITE}`,
				subject: 'Password Reset',
				text: `Use this link to reset your password! ${DEV_URL + 'reset/' + registrationSlug}`
			};
			sgMail
				.send(msg)
				.then(() => {
					console.log('Password reset email sent');
				})
				.catch((error: any) => {
					console.error(error);
				});
		}

		throw redirect(301, '/login');
	}
};

/**
 * Generates and returns a randomized string of characters for a slug
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
