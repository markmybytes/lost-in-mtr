import i18n from 'sveltekit-i18n';

/** @type {import('sveltekit-i18n').Config} */
const config = {
	loaders: ['en', 'zh-hk'].flatMap((locale) => {
		return ['common', 'station', 'line', 'setting', 'qna'].map((key) => ({
			locale: locale,
			key: key,
			loader: async () => (await import(`./${locale}/${key}.json`)).default
		}));
	})
};

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);
