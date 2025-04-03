import lines from '$lib/data/lines.json';

/**
 * The `Fleet` namespace provides utility functions for managing fleet data,
 * including auto-update settings and data retrieval from local storage or a remote source.
 */
export namespace Fleet {
	export const ubranLines = ['KTL', 'TKL', 'TWL', 'ISL'] as Readonly<Array<keyof typeof lines>>;

	export type Fleets = { [key: string]: { [key: string]: Array<string> } };

	/**
	 * Checks if auto-update is enabled.
	 *
	 * @returns Returns true if auto-update is enabled, false otherwise.
	 */
	export function isAutoUpdate(): boolean {
		return (localStorage.getItem('fleetsAutoUpdate') || 'false') === 'true' ? true : false;
	}

	/**
	 * Sets the auto-update preference.
	 *
	 * @param {boolean} val - A boolean value indicating whether auto-update should be enabled or disabled.
	 */
	export function setAutoUpdate(val: boolean) {
		localStorage.setItem('fleetsAutoUpdate', val.toString());
	}

	/**
	 * Retrieves fleet data from localStorage or fetches it from a remote source if necessary.
	 *
	 * @param {boolean} nocache - A flag indicating whether to bypass the cache and fetch fresh data.
	 * @returns A promise that resolves to an object representing the fleet data or null if no data is available.
	 */
	export async function get(nocache: boolean): Promise<Fleets | null> {
		let data = localStorage.getItem('fleets');

		if (nocache || data === null || (isAutoUpdate() && shouldCheckUpdate())) {
			await hasUpdate().then((result) => {
				if (!nocache && !result.has && data !== null) {
					return;
				}

				localStorage.setItem('fleetsHash', result.newHash);

				return fetch(
					'https://raw.githubusercontent.com/SuperDumbTM/lost-in-mtr/refs/heads/data/fleet.min.json',
					{ cache: 'no-store' }
				)
					.then((response) => response.text())
					.then((raw) => {
						localStorage.setItem('fleets', raw);
						localStorage.setItem('fleetsTimestamp', Date.now().toString());
						data = raw;
					});
			});
		}

		if (data === null) {
			return null;
		}
		return JSON.parse(data);
	}

	/**
	 * Retrieves the last update time from local storage.
	 * If the value is not found, it defaults to the epoch time (0).
	 *
	 * @returns Returns a Date object representing the last update time.
	 */
	export function lastUpdateTime(): Date {
		return new Date(parseInt(localStorage.getItem('fleetsTimestamp') ?? '0'));
	}

	/**
	 * Determines whether an update check should be performed based on the auto-update setting and the last update time.
	 *
	 * @returns Returns true if an update check should be performed, false otherwise.
	 */
	export function shouldCheckUpdate(): boolean {
		return (
			Date.now() - lastUpdateCheckTime().getTime() >=
			(isAutoUpdate() ? 1000 * 60 * 60 * 24 * 2 : 1000 * 60 * 60 * 24 * 7)
		);
	}

	/**
	 * Checks if there is an update available for the fleet data by comparing the current hash
	 * stored in localStorage with the latest hash fetched from a remote source.
	 *
	 *
	 * @returns An object containing:
	 *   - `has`: A boolean indicating if an update is available (true if the hashes are different).
	 *   - `newHash`: The latest hash fetched from the remote source.
	 *   - `oldHash`: The current hash stored in localStorage, or null if no hash is stored.
	 */
	export function hasUpdate() {
		return fetch(
			'https://raw.githubusercontent.com/SuperDumbTM/lost-in-mtr/refs/heads/data/fleet.min.json.md5',
			{ cache: 'no-cache' }
		)
			.then((response) => response.text())
			.then((hash) => {
				localStorage.setItem('fleetsLastCheck', new Date().getTime().toString());

				const currentHash = localStorage.getItem('fleetsHash');
				return {
					has: hash !== currentHash,
					newHash: hash,
					oldHash: currentHash
				};
			});
	}

	/**
	 * Determines the number of doors for a given vehicle based on the specified line and vehicle number.
	 *
	 * @returns {number} The number of doors for the specified vehicle.
	 */
	export function doorCount(line: keyof typeof lines, vehicleNumber: string) {
		if ((line == 'EAL' && vehicleNumber.includes('F')) || line == 'AEL') {
			return 2;
		} else if (line == 'DRL') {
			return 3;
		} else {
			return 5;
		}
	}

	/**
	 * Retrieves the last update check time from local storage.
	 * If the value is not found, it defaults to the epoch time (0).
	 *
	 * @returns {Date} Returns a Date object representing the last update check time.
	 */
	function lastUpdateCheckTime() {
		return new Date(parseInt(localStorage.getItem('fleetsLastCheck') ?? '0'));
	}
}
