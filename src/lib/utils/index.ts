const userAgent: string = navigator.userAgent || navigator.vendor;

/**
 * Converts a hex color string to its RGB representation.
 *
 * Reference: https://stackoverflow.com/a/5624139
 */
export function hex2rgb(hex: string): { r: number; g: number; b: number } | null {
	const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, function (_, r, g, b) {
		return r + r + g + g + b + b;
	});

	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
			}
		: null;
}

/**
 * Calculates the relative luminance of an RGB color.
 *
 * Reference: https://stackoverflow.com/a/36888120
 *
 * @returns The relative luminance of the color, ranging from 0 (dark) to 1 (bright).
 */
export function rgb2lum(r: number, g: number, b: number): number {
	return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/**
 * Determines the appropriate text color (black or white) based on the luminance of a given hex color.
 *
 * @param {string} hexcolor - The hex color string (e.g., '#ff5733').
 */
export function textColor(hexcolor: string): string {
	const rgb = hex2rgb(hexcolor);
	const lum = rgb === null ? 1 : rgb2lum(rgb.r, rgb.g, rgb.b);

	return lum > 0.5 ? '#000' : '#fff';
}

/**
 * Determines the operating system of the user's device based on the user agent string.
 *
 * Reference: https://stackoverflow.com/a/38241481
 *
 * @returns The name of the operating system or null if the OS cannot be identified.
 */
export function os(): string | null {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error;
	const platform = window.navigator?.userAgentData?.platform || window.navigator.platform;

	if (['macOS', 'Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'].indexOf(platform) !== -1) {
		return 'Mac OS';
	} else if (['iPhone', 'iPad', 'iPod'].indexOf(platform) !== -1) {
		return 'iOS';
	} else if (['Win32', 'Win64', 'Windows', 'WinCE'].indexOf(platform) !== -1) {
		return 'Windows';
	} else if (/Android/.test(userAgent)) {
		return 'Android';
	} else if (/Linux/.test(platform)) {
		return 'Linux';
	}

	return null;
}
