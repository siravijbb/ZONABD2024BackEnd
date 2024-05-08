import { db } from '$lib/db.server';
import { RateLimiter } from 'sveltekit-rate-limiter/server';
import { error } from '@sveltejs/kit';

const limiter = new RateLimiter({
	IP: [30, 's'], // IP address limiter
	IPUA: [30, 's'], // IP + User Agent limiter
	cookie: {
		// Cookie limiter
		name: 'limiterid', // Unique cookie name for this limiter
		secret: 'SECRETKEY-SERVER-ONLY', // Use $env/static/private
		rate: [5, 's'],
		preflight: false // Require preflight call (see load function)
	}
});

// eslint-disable-next-line no-empty-pattern
export const GET = async (event) => {
	if (await limiter.isLimited(event)) error(429);
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