import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { TWILIO_KEY, EMAIL, SITE } from '$env/static/private';
import { createRequire } from 'module';
import { CheckCaptcha } from '$lib/Services/Helpers';
import { MailService } from '@sendgrid/mail';

const require = createRequire(import.meta.url);

export const actions: Actions = {
	// send email action
	send: async ({ request }) => {
		// retrieves data from corresponding form
		const data = await request.formData();
		const _email = await data.get('email');
		const _name = await data.get('name');
		const _number = await data.get('number');
		const _message = await data.get('message');

		// google recaptcha token
		const _recaptcha_token = data.get('g-recaptcha-response');

		// ensure all fields are filled out.
		if (!_email || !_name || !_message) {
			return fail(400, { invalid: true });
		}

		// checks for valid captcha response, redirect if invalid
		const response = await CheckCaptcha(_recaptcha_token);
		if (!response.success) {
			throw redirect(303, '/');
		}

		// twilio sendgrid's api to send an email, uses .env variables
		// send email from SITE to EMAIL, with content provided by user.
		const sgMail = new MailService();
		sgMail.setApiKey(TWILIO_KEY);
		const msg = {
			to: `${EMAIL}`,
			from: `${SITE}`,
			subject: `${_name} has sent you a message from your blog!`,
			text: `
			${_name}'s message: 
			${_message}
			
			Return email: ${_email}
			Return number: ${!_number || _number?.length > 0 ? _number : 'None'}`
		};
		try {
			await sgMail.send(msg);
			return { messageSent: true };
		} catch (error: any) {
			console.error(error);
			return fail(400, { messageFailed: false });
		}
	}
};
