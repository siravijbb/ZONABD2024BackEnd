import { db } from '$lib/db.server';

// eslint-disable-next-line no-empty-pattern
export const GET = async ({}) => {
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
		return new Response(
			JSON.stringify({
				message: 'Success',
				body: {
					"message": `Server Broken`
				},}),{ status: 200 });}


	return new Response(
		JSON.stringify({
			message: 'Success',
			body: {
				"Donated": VerifyDonateData.TotalDonated,
				"Needed": VerifyDonateData.TotalNeed
			}
		}),
		{ status: 200 });
};