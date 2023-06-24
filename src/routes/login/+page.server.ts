import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/Services/Database';
import bcrypt from 'bcrypt';
import { ENV } from '$env/static/private';
import { CheckCaptcha } from '$lib/Services/Helpers';

// if user is logged in, redirect
export const load: PageServerLoad = async ({ locals }: any) => {
	if (locals.user) {
		throw redirect(302, '/');
	}
};

// action to login, uses 'manual' encryption with bcrypt
export const actions: Actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const _password = data.get('password');
		const _email = data.get('email');
		const _provider = 'email';

		// google recaptcha token
		const _recaptcha_token = data.get('g-recaptcha-response');

		// ensure no empty values
		if (typeof _password !== 'string' || !_password || !_email) {
			return fail(400, { invalid: true });
		}

		// checks if user exists, if not, return generic login failure.
		const user = await db.user.findUnique({
			select: {
				email: true,
				password: true
			},
			where: {
				email: _email as string
			}
		});

		if (!user) {
			return fail(400, { credentials: true });
		}

		//check if the encrypted password is correct.
		const passwordCompare = await bcrypt.compare(_password, user.password);

		if (!passwordCompare) {
			return fail(400, { credentials: true });
		}

		// checks for valid captcha response, redirect if invalid
		const response = await CheckCaptcha(_recaptcha_token);
		if (!response.success) {
			throw redirect(303, '/');
		}

		// sets a cookie for the authenticated user, http only for security
		try {
			const authenticatedUser = await db.user.update({
				data: { userAuthToken: crypto.randomUUID() },
				where: { email: user.email }
			});

			cookies.set('session', authenticatedUser.userAuthToken, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: ENV == 'PROD',
				maxAge: 60 * 60 * 24 * 30
			});
		} catch {
			console.log('Issue logging in');
		}

		throw redirect(303, '/');
	}
};
