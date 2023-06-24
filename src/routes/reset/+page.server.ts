import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/Services/Database';
import { TWILIO_KEY, DEV_URL, PROD_URL, ENV, SITE } from '$env/static/private';
import { createRequire } from 'module';
import { CheckCaptcha, GenerateRegisterSlug } from '$lib/Services/Helpers';

const require = createRequire(import.meta.url);

let resettingUser: any;

// reset action makes sure the user already has an email and valid password by checking
// if the slug was consumed. then, send an email from SITE to EMAIL like register.
export const actions: Actions = {
	// reset password action
	reset: async ({ request }) => {
		// retrieves data from corresponding form
		const data = await request.formData();
		const _email = await data.get('email');

		// google recaptcha token
		const _recaptcha_token = await data.get('g-recaptcha-response');

		if (!_email) {
			return fail(400, { invalid: true });
		}

		// check and retrieve user associated with email to reset password for
		resettingUser = await db.user.findUnique({
			select: {
				email: true,
				registerSlug: true
			},
			where: {
				email: _email as string
			}
		});

		// some trickery to throw people off.
		// not foolproof since we return 400 code,
		// but necessary to return fail for captcha
		if (!resettingUser) {
			return fail(400, { emailSent: true });
		}

		// if registerSlug is not consumed, the user either isn't registered, or already
		// sent a reset email
		if (resettingUser.registerSlug.includes('CONSUMED')) {
			// grab correct site url for the email link
			let siteURL;
			if (ENV === 'DEV') {
				siteURL = DEV_URL;
			} else {
				siteURL = PROD_URL;
			}

			// checks for valid captcha response, redirect if invalid
			const response = await CheckCaptcha(_recaptcha_token);
			if (!response.success) {
				throw redirect(303, '/');
			}

			// re-use the registration slug for the reset URL.
			// this is safe, because we check if an email exists
			// in the register server load.
			const registrationSlug = GenerateRegisterSlug();
			resettingUser = await db.user.update({
				data: {
					registerSlug: registrationSlug
				},
				where: {
					email: _email as string
				}
			});

			//attempt to send the password reset email via Twilio SendGrid's API.
			const sgMail = require('@sendgrid/mail');
			sgMail.setApiKey(TWILIO_KEY);
			const msg = {
				to: `${resettingUser.email}`,
				from: `${SITE}`,
				subject: 'Password Reset',
				text: `Use this link to reset your password! ${siteURL + 'reset/' + registrationSlug}`
			};
			try {
				await sgMail.send(msg);
				return { emailSent: true };
			} catch (error: any) {
				console.error(error);
				return fail(400, { emailFailed: true });
			}
		}
	}
};
