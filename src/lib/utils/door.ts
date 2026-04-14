/**
 * Calculates the absolute car number (1-based position in formation).
 *
 * @param vehicleNumber - The vehicle identifier
 * @param formation - Array of vehicle numbers in the train formation
 * @returns The car number position starting from 1 at the "up" side
 */
export function getAbsoluteCarNumber(vehicleNumber: string, formation: string[]): number {
	return formation.indexOf(vehicleNumber) + 1;
}

/**
 * Calculates the adjusted car number based on direction and line-specific rules.
 *
 * The car number can differ from the absolute position depending on:
 * - Direction: inbound vs outbound (reverses numbering in outbound direction)
 * - Line-specific offsets: AEL has a -1 offset for outbound direction
 *
 * @param line - The train line identifier (e.g., 'AEL', 'MTR', 'DRL')
 * @param isInbound - Whether the train is traveling in inbound direction
 * @param vehicleNumber - The vehicle identifier to find in the formation
 * @param formation - Array of vehicle numbers in the train formation
 * @returns The adjusted car number (1-based)
 */
export function calculateCarNumber(
	line: string,
	isInbound: boolean,
	vehicleNumber: string,
	formation: string[]
): number {
	const carNumberAbs = getAbsoluteCarNumber(vehicleNumber, formation);
	const adjustedCarNumber = isInbound
		? carNumberAbs
		: ((formation.length - carNumberAbs) % formation.length) + 1;

	return adjustedCarNumber + (line === 'AEL' && !isInbound ? -1 : 0);
}

/**
 * Calculates the door position for a given train configuration.
 *
 * @param line - The train line identifier (e.g., 'AEL', 'DRL', 'MTR')
 * @param stockName - The stock/fleet name of the train
 * @param carNumberAbs - The absolute car number (1-based, starting from "up" side)
 * @param form - The door selection form state with side and number
 * @param doorCount - Total number of doors on one side of the car
 * @returns The door position with side, index, and platform number, or null if invalid
 */
export function calculateDoorPosition(
	line: string,
	stockName: string,
	carNumberAbs: number,
	form: { door: { side: string | null; number: number | null }; inbound: boolean },
	doorCount: number
): {
	side: 'T' | 'B';
	index: number;
	platform: number;
} | null {
	if (form.door.number === null || form.door.side === null || form.door.number > doorCount) {
		return null;
	}

	// Some train stocks have reversed door side mapping in certain carriages.
	// The default positioning assumes side U/A maps to right (R) and D/B maps to left (L) when facing the "up" direction.
	const flippedSides =
		!['AEL', 'DRL', 'EAL', 'TCL', 'TML'].includes(line) &&
		((stockName === '現代化列車' && [1, 4, 7].includes(carNumberAbs)) ||
			(stockName === '南港島綫中國長春製列車' && carNumberAbs === 3) ||
			(stockName !== '現代化列車' && [1, 2, 4, 6].includes(carNumberAbs)));

	if (flippedSides) {
		const index = form.door.number - 1;
		return {
			side: ['U', 'A'].includes(form.door.side) ? 'T' : 'B',
			index: index,
			platform: form.inbound ? index + 1 : doorCount - index
		};
	} else {
		const index = doorCount - form.door.number;
		return {
			side: ['U', 'A'].includes(form.door.side) ? 'B' : 'T',
			index: doorCount - form.door.number,
			platform: form.inbound ? index + 1 : doorCount - index
		};
	}
}
