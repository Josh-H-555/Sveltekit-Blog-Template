import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/database';
import { TWILIO_KEY, DEV_URL, EMAIL, SITE } from '$env/static/private';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export const actions: Actions = {
	send: async ({ request }) => {
		const data = await request.formData();
		const _email = await data.get('email');
		const _name = await data.get('name');
		const _number = await data.get('number');
		const _message = await data.get('message');

		// twilio sendgrid's api to send an email, uses .env variables
		const sgMail = require('@sendgrid/mail');
		sgMail.setApiKey(TWILIO_KEY);
		const msg = {
			to: `${EMAIL}`,
			from: `${SITE}`,
			subject: `${_name} has sent you a message from your blog!`,
			text: `
			${_name}'s message: 
			${_message}
			
			Return email: ${_email}
			Return number: ${_number?.length > 0 ? _number : 'None'}`
		};
		sgMail
			.send(msg)
			.then(() => {
				console.log('Contact email sent');
				return { messageSent: true };
			})
			.catch((error: any) => {
				console.error(error);
				return { messageSent: false };
			});
	}
};
