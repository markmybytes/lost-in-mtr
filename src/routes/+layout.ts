import { loadTranslations, locale } from '$lib/i18n/translations';
import type { LayoutLoad } from './$types';

export const prerender = true;

export const ssr = false;

export const trailingSlash = 'always';

export const load: LayoutLoad = async ({ url }) => {
	const { pathname } = url;

	await loadTranslations(localStorage.getItem('locale') || 'zh-hk', pathname);

	locale.subscribe((lc) => localStorage.setItem('locale', lc));

	return {};
};
