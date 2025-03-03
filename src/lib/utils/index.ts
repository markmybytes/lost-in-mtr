// @ts-ignore;
const userAgent: string = navigator.userAgent || navigator.vendor || window.opera;

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
 * Determines whether the current user agent corresponds to a mobile device.
 *
 * Reference: https://stackoverflow.com/a/11381730
 *
 * @returns Returns true if the user agent indicates a mobile device, and false otherwise.
 */
export function isMobileUA(): boolean {
	// @ts-ignore;
	return (
		/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
			userAgent
		) ||
		/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
			userAgent.substr(0, 4)
		)
	);
}

/**
 * Determines the operating system of the user's device based on the user agent string.
 *
 * Reference: https://stackoverflow.com/a/38241481
 *
 * @returns The name of the operating system or null if the OS cannot be identified.
 */
export function os(): string | null {
	// @ts-ignore;
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
