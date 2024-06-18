//event page
/* eslint-disable */

import type { Actions } from '@sveltejs/kit';
import { db } from '$lib/db.server';

export const actions: Actions = {
	check: async ({ request }) => {
		const frontdata = await request.formData();
		const Auth = frontdata.get('Auth') as string;
		let Recived = frontdata.get('Recived') as unknown as number;
		let Needed = frontdata.get('Needed') as unknown as number;
		const AuthCode = await db.invitedUser.findFirst({
			where: {
				invitecode: Auth
			}
		});
		if (!AuthCode) {
			console.log('no');
			return {
				auth: false
			};
		} else {
			const wishdata = await db.wishes.findMany({
				orderBy: {
					count: 'asc'
				},
				select: {
					count: false,
					id: true,
					name: true,
					comment: true,
				}});


			return {
				auth: true,
				server: true,
				wish: wishdata
				}
			};
		},
	approve: async ({ request }) => {
		const wishdata = await request.formData();
		const id = wishdata.get('id') ;
		console.log(wishdata)
		if(!id){
		return	{updaterror: true}
		}

		const update = await db.wishes.update(
			{
				where: { id: id, },
				data: {
					approved: true
				}
			}

		)
		const returnwishdata = await db.wishes.findMany({
			orderBy: {
				count: 'asc'
			},
			select: {
				count: false,
				id: true,
				name: true,
				comment: true,
			}});

		return {
			authUP: true,
			serverUP: true,
			wish: returnwishdata
		}

	},
	notapp: async ({ request }) => {
		const wishdata = await request.formData();
		const id = wishdata.get('id') ;
		console.log(wishdata)
		if(!id){
			return	{updaterror: true}
		}

		const update = await db.wishes.update(
			{
				where: { id: id, },
				data: {
					approved: false
				}
			}

		)
		const returnwishdata = await db.wishes.findMany({
			orderBy: {
				count: 'asc'
			},
			select: {
				count: false,
				id: true,
				name: true,
				comment: true,
			}});

		return {
			authUP: true,
			serverUP: true,
			wish: returnwishdata
		}

	}

	}

