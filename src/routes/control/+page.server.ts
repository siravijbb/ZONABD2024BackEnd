//event page
/* eslint-disable */

import type { Actions } from '@sveltejs/kit';
import { db } from '$lib/db.server';

export const actions: Actions = {
	add: async ({ request }) => {
		const frontdata = await request.formData();
		const Auth = frontdata.get("Auth") as string;
		let Recived = frontdata.get('Recived') as unknown as number;
		let Needed = frontdata.get('Needed') as unknown as number ?? 60000;
		const AuthCode = await db.invitedUser.findFirst({
			where: {
				invitecode: Auth,
			},
		});
		if(!AuthCode){
			console.log("no")
			return {
				auth: false
			}}
		else{
			Recived = parseFloat(String(Recived));
			Needed = parseFloat(String(Needed));
			const ReadDonateData = await db.donateData.findFirst({
				where: {
					id: "1",
				}
			})
			if(!ReadDonateData || !Recived || !Needed){
				return {
					auth: true,
					server: false
				}
			}
			const CombinedDonate = ReadDonateData.TotalDonated + Recived;
			console.debug("C:" +CombinedDonate)
			await db.donateData.update({
				where: {
					id: "1",
				},
				data: {
					TotalNeed: Needed,
					TotalDonated: CombinedDonate,
				},
			});
			const VerifyDonateData = await db.donateData.findFirst({
				where: {
					id: "1",
				},
				select: {
					TotalDonated: true,
					TotalNeed: true,
				},
			})
			if(!VerifyDonateData){
				return {
					auth: true,
					server: false
				}
			}
			console.error(Recived)
			return {
				auth: true,
				server: true,
				total: Recived,
				donated: VerifyDonateData.TotalDonated,
				needed: VerifyDonateData.TotalNeed

			}

		}

	}
	}