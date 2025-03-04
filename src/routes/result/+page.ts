import type { PageLoad } from './$types';
import lines from '$lib/data/lines.json';
import { error } from '@sveltejs/kit';
import { Fleet } from '$lib/data';

function parseDoorParams(params: URLSearchParams): TrainDoor {
	const door: TrainDoor = { side: null, number: null };

	if (['U', 'D', 'A', 'B'].includes(params.get('ds') || '')) {
		door.side = params.get('ds')!.toUpperCase() as TrainDoor['side'];
	}

	if (['1', '2', '3', '4', '5'].includes(params.get('dn') || '')) {
		door.number = parseInt(params.get('dn')!) as TrainDoor['number'];
	}

	return door;
}

export const load: PageLoad = async ({ url }) => {
	if (url.searchParams.get('l') === null || url.searchParams.get('sn') === null) {
		error(404);
	} else if (!(url.searchParams.get('l')!.toUpperCase() in lines)) {
		error(404);
	}

	const fleets = await Fleet.get(false);
	if (fleets === null) {
		error(500);
	}

	const params = {
		line: url.searchParams.get('l')!.toUpperCase() as keyof typeof lines,
		stockNumber: url.searchParams.get('sn')!.toUpperCase(),
		door: parseDoorParams(url.searchParams),
		/** Train driection, `true` means up/inbound direction otherwise down/outbound direction */
		inbound: url.searchParams.get('u')?.toLocaleLowerCase() === 'true'
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
