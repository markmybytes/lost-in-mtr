import i18n from 'sveltekit-i18n';

/** @type {import('sveltekit-i18n').Config} */
const config = {
	loaders: [
		{
			locale: 'zh_Hant_HK',
			key: 'common',
			loader: async () => (await import('./zh_Hant_HK/common.json')).default
		},
		{
			locale: 'zh_Hant_HK',
			key: 'station',
			loader: async () => (await import('./zh_Hant_HK/station.json')).default
		},
		{
			locale: 'zh_Hant_HK',
			key: 'line',
			loader: async () => (await import('./zh_Hant_HK/line.json')).default
		}
	]
};

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);
