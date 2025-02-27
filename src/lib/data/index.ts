/**
 * The `Fleet` namespace provides utility functions for managing fleet data,
 * including auto-update settings and data retrieval from local storage or a remote source.
 */
export namespace Fleet {
	/**
	 * Checks if auto-update is enabled.
	 *
	 * @returns Returns true if auto-update is enabled, false otherwise.
	 */
	export function isAutoUpdate(): boolean {
		return localStorage.getItem('fleetsAutoUpdate') || 'false' ? true : false;
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
	export async function get(nocache: boolean): Promise<{ [key: string]: Array<string> } | null> {
		let data = localStorage.getItem('fleets');

		if (nocache || data === null || shouldCheckUpdate()) {
			hasUpdate().then((result) => {
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
	 * Retrieves the last update time of the fleet data from localStorage.
	 *
	 * @returns Returns a Date object representing the last update time, or null if no timestamp is available.
	 */
	export function lastUpdateTime(): Date | null {
		const timestamp = localStorage.getItem('fleetsTimestamp');
		return timestamp === null ? null : new Date(parseInt(timestamp));
	}

	/**
	 * Determines whether an update check should be performed based on the auto-update setting and the last update time.
	 *
	 * @returns Returns true if an update check should be performed, false otherwise.
	 */
	export function shouldCheckUpdate(): boolean {
		return isAutoUpdate() && (lastUpdateTime()?.getTime() || -1) - Date.now() >= 60 * 60 * 24;
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
				const currentHash = localStorage.getItem('fleetsHash');
				return {
					has: hash !== currentHash,
					newHash: hash,
					oldHash: currentHash
				};
			});
	}
}
