import type { PageServerLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/database';
import bcrypt from 'bcrypt';

let resettingUser: any;

// ensures the slug in the URL is attached to a user
export const load = (async ({ params }) => {
	const validUserToRegister = await db.user.findUnique({
		where: {
			registerSlug: params.slug
		}
	});

	if (!validUserToRegister || validUserToRegister.registerSlug == 'CONSUMED') {
		throw redirect(301, '/login');
	}

	resettingUser = validUserToRegister;

	return;
}) satisfies PageServerLoad;

// change action ensures the password and confirmation are both equal, then
// attempts to update the user's password in the database.
export const actions: Actions = {
	change: async ({ request }) => {
		const data = await request.formData();
		const _password = data.get('password');
		const _confirm = data.get('confirm');

		// ensures values are strings and not empty
		if (typeof _password !== 'string' || typeof _confirm !== 'string' || !_password || !_confirm) {
			return fail(400, { invalid: true });
		}

		if (_password !== _confirm) {
			return fail(400, { credentials: true });
		}

		try {
			// attempts to update the user
			await db.user.update({
				where: { id: resettingUser.id },
				data: {
					password: await bcrypt.hash(_password, 10),
					registerSlug: 'CONSUMED'
				}
			});
		} catch {
			return fail(400, { credentials: true });
		}

		throw redirect(301, '/login');
	}
};
