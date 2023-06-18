import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/database';
import bcrypt from 'bcrypt';
import { ENV } from '$env/static/private';

// if user is logged in, redirect
export const load: PageServerLoad = async ({ locals }) => {
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

		if (typeof _password !== 'string' || !_password || !_email) {
			return fail(400, { invalid: true });
		}

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

		const passwordCompare = await bcrypt.compare(_password, user.password);

		if (!passwordCompare) {
			return fail(400, { credentials: true });
		}

		// sets a cookie for the authenticated user
		try {
			const authenticatedUser = await db.user.update({
				where: { email: user.email },
				data: { userAuthToken: crypto.randomUUID() }
			});

			cookies.set('session', authenticatedUser.userAuthToken, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: ENV == 'PROD',
				maxAge: 60 * 60 * 24 * 30
			});
		} catch {
			console.log('Unknown issue logging in');
		}

		throw redirect(303, '/');
	}
};
