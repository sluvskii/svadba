import { browser } from '$app/env';

export type Lang = 'ru' | 'tt';

export type Localized = {
	ru: string;
	tt?: string;
};

/** Tiny helper: Russian is the source language, Tatar is an optional draft. */
export const t = (ru: string, tt?: string): Localized => ({ ru, tt });

export const i18n = $state({
	lang: 'ru' as Lang,
	menuOpen: false
});

export function initLang(): void {
	if (!browser) return;
	const match = document.cookie.match(/(?:^|;\s*)lang=(ru|tt)/);
	if (match) i18n.lang = match[1] as Lang;
	document.documentElement.lang = i18n.lang === 'tt' ? 'tt' : 'ru';
}

export function setLang(lang: Lang): void {
	i18n.lang = lang;
	if (browser) {
		document.cookie = `lang=${lang};path=/;max-age=31536000;samesite=lax`;
		document.documentElement.lang = lang === 'tt' ? 'tt' : 'ru';
	}
}

/** Pick the current language, falling back to Russian when a translation is missing. */
export function pick(value: Localized, lang: Lang = i18n.lang): string {
	return lang === 'tt' ? value.tt || value.ru : value.ru;
}

export function toggleLang(): void {
	setLang(i18n.lang === 'ru' ? 'tt' : 'ru');
}
