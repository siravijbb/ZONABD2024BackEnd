import { db } from '$lib/db.server';
import { RateLimiter } from 'sveltekit-rate-limiter/server';
import { error } from '@sveltejs/kit';

let OverideFormAccepting = true;

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
	let ReadableDateTime = '2024-07-29T00:30:00';
	let formClose = '2024-07-29T17:00:00';

	const DBconfig = await db.formConfig.findFirst({
		where: {
			id: '665901f5b37d6e6b9dc3a33b'
		},
		select: {
			ReadableDateTime: true,
			formClose: true
		}
	});
	if (DBconfig) {
		ReadableDateTime = DBconfig.ReadableDateTime;
		formClose = DBconfig.formClose;
	}

	// Get the current date and time in UTC
	const currentDateTime = new Date();
	let currentDateTimeUTC = new Date(currentDateTime.toISOString());
	currentDateTimeUTC.setUTCHours(currentDateTimeUTC.getUTCHours() + 7);

	// Convert the predefined date and time to UTC
	const predefinedDateTimeObject = new Date(ReadableDateTime + 'Z');
	const formCloseObject = new Date(formClose + 'Z');

	console.log('NOW :', currentDateTime.getTime());
	console.log('RELEASE :', predefinedDateTimeObject.getTime());
	let FormAccepting: boolean;
	let Readable: boolean;
	let FormCloseDate: string;
	// Get the date part
	const datePart = currentDateTime.toLocaleDateString();
	let releaseDate = new Date(predefinedDateTimeObject.toUTCString());

	// Get the time part
	const timePart = currentDateTime.toLocaleTimeString('en-th', { hourCycle: 'h23' });
	let releaseTime = new Date(predefinedDateTimeObject.toUTCString() );
	try {
		let DBOveridecheck = await db.overrideAccept.findFirst({
			where: {
				id: '66590009b37d6e6b9dc3a339'
			},
			select: {
				status: true
			}
		});
		if (!DBOveridecheck?.status) {
			OverideFormAccepting = false;
		} else if (DBOveridecheck.status == true) {
			OverideFormAccepting = true;
		}

		if (
			currentDateTimeUTC.getTime() <= predefinedDateTimeObject.getTime() &&
			currentDateTimeUTC.getTime() <= formCloseObject.getTime() && !OverideFormAccepting
		) {
			console.log('Today is before the predefined date, But will open for count');
			let count = await db.wishes.count({});
			console.log('Code Closed (x count)', count);
			FormAccepting = true;
			Readable = false;

			return new Response(
				JSON.stringify({
					message: 'Success',
					body: {
						accepting: FormAccepting,
						canreadnow: Readable,
						count: count,
						openDate: releaseDate.toLocaleDateString('en-th', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
							weekday: 'long'
						}),
						openTime: releaseTime.toLocaleTimeString('en-th', { hourCycle: 'h23' }),
						formCloseDate: formCloseObject.toLocaleDateString('en-th', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
							weekday: 'long'
						}),
						formCloseTime: formCloseObject.toLocaleTimeString('en-th', { hourCycle: 'h23' })
					}
				})
			);
		} else if (
			currentDateTimeUTC.getTime() <= predefinedDateTimeObject.getTime() &&
			currentDateTimeUTC.getTime() > formCloseObject.getTime() &&
			!OverideFormAccepting
		) {
			console.log('Today is before the predefined date and closed form, But will open for count');
			let count = await db.wishes.count();
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
						canreadnow: Readable,
						count: count,
						openDate: releaseDate.toLocaleDateString('en-th', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
							weekday: 'long'
						}),
						openTime: releaseTime.toLocaleTimeString('en-th', { hour12: false }),
						formCloseDate: formCloseObject.toLocaleDateString('en-th', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
							weekday: 'long'
						}),
						formCloseTime: formCloseObject.toLocaleTimeString('en-th', { hour12: false })
					}
				})
			);
		} else if (
			currentDateTimeUTC.getTime() > predefinedDateTimeObject.getTime() &&
			!OverideFormAccepting
		) {
			FormAccepting = false;
			Readable = true;
			let count = await db.wishes.count();

			return new Response(
				JSON.stringify({
					message: 'Success',
					body: {
						accepting: FormAccepting,
						canreadnow: Readable,
						count: count,
						wish: await db.wishes.findMany({
							where: {
								approved: true,
							},
							orderBy: {
								count: 'asc'
							}
						})
					}
				})
			);
		} else if (
			OverideFormAccepting
		) {
			FormAccepting = true;
			Readable = true;
			let count = await db.wishes.count();

			return new Response(
				JSON.stringify({
					message: 'Success',
					body: {
						accepting: FormAccepting,
						canreadnow: Readable,
						count: count,
						wish: await db.wishes.findMany({
							where: {
								approved: true,
							},
							orderBy: {
								count: 'asc'
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
