import { loadTranslations } from '$lib/i18n/translations';

export const prerender = true;

export const ssr = false;

/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ url }) => {
	const { pathname } = url;

	const initLocale = 'zh_Hant_HK';

	await loadTranslations(initLocale, pathname);

	return {};
};
