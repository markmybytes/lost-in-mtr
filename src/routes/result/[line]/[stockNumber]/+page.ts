import type { PageLoad } from './$types';
import lines from '$lib/data/lines.json';
import { error } from '@sveltejs/kit';
import { Fleet } from '$lib/data';

export const load: PageLoad = async ({ params }) => {
	if (!(params.line in lines)) {
		error(404);
	}

	const fleets = await Fleet.get(false);
	if (fleets === null) {
		error(500);
	}

	for (const stock of fleets[params.line]) {
		const cars = stock.split(/[-\+]+/);
		if (cars.includes(params.stockNumber)) {
			return {
				fleets: fleets,
				formation: cars,
				params: params
			};
		}
	}

	error(404);
};
