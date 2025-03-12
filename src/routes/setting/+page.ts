import { version } from '$app/environment';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	return {
		version: import.meta.env?.VITE_BUILD_VERSION,
		commitHash: version
	};
};
