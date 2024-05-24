import { db } from '$lib/db.server';
import { RateLimiter } from 'sveltekit-rate-limiter/server';
import { error } from '@sveltejs/kit';

const predefinedDate = '2024-01-29';

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
	// Predefined date and time in the format "YYYY-MM-DDTHH:mm:ss" in ISO time
	// this code make faster by chatGPT, Sory im not good javascript dev
	const predefinedDateTime = '2024-01-29T13:30:00';
	const formClose = '2024-01-29T17:00:00';
	// Get the current date and time in UTC
	const currentDateTime = new Date();
	const currentDateTimeUTC = new Date(currentDateTime.toISOString());
	const offsetMilliseconds = 7 * 60 * 60 * 1000;

	// Convert the predefined date and time to UTC
	const predefinedDateTimeObject = new Date(predefinedDateTime + 'Z');
	const formCloseObject = new Date(formClose + 'Z');

	console.log('NOW :', currentDateTime.getTime());
	console.log('RELEASE :', predefinedDateTimeObject.getTime());
	let FormAccepting: boolean;
	let Readable: boolean;
	let FormCloseDate: string;
	// Get the date part
	const datePart = currentDateTime.toLocaleDateString();
	const releaseDate = new Date(predefinedDateTimeObject.getTime() + offsetMilliseconds);
	// Get the time part
	const timePart = currentDateTime.toLocaleTimeString();
	const releaseTime = new Date(predefinedDateTimeObject.getTime() + offsetMilliseconds);

	try {
		if (
			currentDateTimeUTC.getTime() <= predefinedDateTimeObject.getTime() &&
			currentDateTimeUTC.getTime() <= formCloseObject.getTime()
		) {
			console.log('Today is before the predefined date, But will open for count');
			let count = db.wishes.count();
			console.log('Code Closed (return count)');
			FormAccepting = true;
			Readable = false;

			return new Response(
				JSON.stringify({
					message: 'Success',
					body: {
						accepting: FormAccepting,
						readable: Readable,
						count: count,
						openDate: releaseDate.toLocaleDateString('en-TH', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
							weekday: 'long'
						}),
						openTime: releaseTime.toLocaleTimeString(),
						formCloseDate: formCloseObject.toLocaleDateString('en-TH', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
							weekday: 'long'
						}),
						formCloseTime: formCloseObject.toLocaleTimeString()
					}
				})
			);
		} else if (
			currentDateTimeUTC.getTime() <= predefinedDateTimeObject.getTime() &&
			currentDateTimeUTC.getTime() > formCloseObject.getTime()
		) {
			console.log('Today is before the predefined date, But will open for count');
			let count = db.wishes.count();
			FormAccepting = false;
			Readable = false;

			console.log('Code Closed (return count)');
			const Releasehours =
				Number(String(predefinedDateTimeObject.getUTCHours()).padStart(2, '0')) + 7;

			return new Response(
				JSON.stringify({
					message: 'Success',
					body: {
						accepting: FormAccepting,
						readable: Readable,
						count: count,
						openDate: releaseDate.toLocaleDateString('en-TH', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
							weekday: 'long'
						}),
						openTime: releaseTime.toLocaleTimeString(),
						formCloseDate: formCloseObject.toLocaleDateString('en-TH', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
							weekday: 'long'
						}),
						formCloseTime: formCloseObject.toLocaleTimeString()
					}
				})
			);
		} else if (currentDateTimeUTC.getTime() > predefinedDateTimeObject.getTime()) {
			FormAccepting = false;
			Readable = true;
			return new Response(
				JSON.stringify({
					message: 'Success',
					body: {
						accepting: FormAccepting,
						readable: Readable,
						wish: await db.wishes.findMany({
							orderBy: {
								count: 'desc'
							}
						})
					}
				})
			);
		}
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({
				message: 'Success',
				body: {
					message: `Server Broken , ${error}`
				}
			}),
			{ status: 200 }
		);
	}
};
