import type { PageLoad } from './$types';
import lines from '$lib/data/lines.json';
import { error } from '@sveltejs/kit';
import { Fleet } from '$lib/data';

export const load: PageLoad = async ({ url }) => {
	if (url.searchParams.get('line') === null || url.searchParams.get('stockNumber') === null) {
		error(404);
	} else if (!(url.searchParams.get('line')!.toUpperCase() in lines)) {
		error(404);
	}

	const fleets = await Fleet.get(false);
	if (fleets === null) {
		error(500);
	}

	const params = {
		line: url.searchParams.get('line')!.toUpperCase() as keyof typeof lines,
		stockNumber: url.searchParams.get('stockNumber')!.toUpperCase()
	};

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
