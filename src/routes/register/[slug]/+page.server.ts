import type { PageServerLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/Services/Database';
import { EMAIL } from '$env/static/private';
import bcrypt from 'bcrypt';

let registeringUser: any;

// on load, ensures the slug used is one that has been generated by the site
// in addition, if user is already registered, redirect to login
export const load = (async ({ params }) => {
	const validUserToRegister = await db.user.findUnique({
		where: {
			registerSlug: params.slug
		}
	});

	// if no user, user is registered, or the slug is the CONSUMED flag, redirect
	if (
		!validUserToRegister ||
		validUserToRegister.email ||
		validUserToRegister.registerSlug === 'CONSUMED'
	) {
		throw redirect(301, '/login');
	}

	registeringUser = validUserToRegister;

	return;
}) satisfies PageServerLoad;

export const actions: Actions = {
	// register account action
	register: async ({ request }) => {
		// retrieves data from corresponding form
		const data = await request.formData();
		const _name = data.get('name');
		const _password = data.get('password');
		const _email = data.get('email');
		const _provider = 'email';
		const _role = _email == `${EMAIL}` ? 'ADMIN' : 'USER';

		// ensures values are strings and not empty
		if (
			typeof _name !== 'string' ||
			typeof _password !== 'string' ||
			!_name ||
			!_password ||
			!_email
		) {
			return fail(400, { invalid: true });
		}

		try {
			// attempts to update the user, set slug to CONSUMED
			await db.user.update({
				data: {
					name: _name,
					email: _email as string,
					providerId: _provider,
					role: _role,
					userAuthToken: crypto.randomUUID(),
					registerSlug: 'CONSUMED',
					password: await bcrypt.hash(_password, 10)
				},
				where: { id: registeringUser.id }
			});
		} catch {
			return fail(400, { credentials: true });
		}

		throw redirect(301, '/login');
	}
};
