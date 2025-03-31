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
	if (url.searchParams.get('l') === null || url.searchParams.get('vn') === null) {
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
		referenceLine: url.searchParams.get('rl')?.toUpperCase() as null | keyof typeof lines,
		vehicleNumber: url.searchParams.get('vn')!.toUpperCase(),
		door: parseDoorParams(url.searchParams),
		/** Train driection, `true` means up/inbound direction otherwise down/outbound direction */
		inbound: url.searchParams.get('u')?.toLocaleLowerCase() === 'true'
	};

	for (const [stockName, stocks] of Object.entries(fleets[params.referenceLine ?? params.line])) {
		for (const stock of stocks) {
			const cars = stock.split(/[-\+]+/);
			if (cars.includes(params.vehicleNumber)) {
				return {
					stockName: stockName,
					fleets: fleets,
					formation: cars,
					params: params
				};
			}
		}
	}

	error(404);
};
