import { loadTranslations, locale } from '$lib/i18n/translations';

export const prerender = true;

export const ssr = false;

export const trailingSlash = 'always';

/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ url }) => {
	const { pathname } = url;

	await loadTranslations(localStorage.getItem('locale') || 'zh-hk', pathname);

	locale.subscribe((lc) => localStorage.setItem('locale', lc));

	return {};
};
