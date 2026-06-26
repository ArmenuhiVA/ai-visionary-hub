import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import hy from "./hy.json";
import ru from "./ru.json";

export const SUPPORTED_LANGS = ["hy", "ru", "en"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      hy: { translation: hy },
      ru: { translation: ru },
    },
    lng: "en",
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LANGS,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

  // After mount, restore preferred language without causing SSR mismatch
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem("preferred_language");
    if (stored && (SUPPORTED_LANGS as readonly string[]).includes(stored) && stored !== "en") {
      // defer so hydration completes with the SSR language first
      setTimeout(() => i18n.changeLanguage(stored), 0);
    }
    i18n.on("languageChanged", (lng) => {
      try {
        window.localStorage.setItem("preferred_language", lng);
      } catch {}
    });
  }
}

export default i18n;

export function getLocalizedField<T extends Record<string, unknown>>(
  obj: T | null | undefined,
  field: string,
  lang: Lang,
): string {
  if (!obj) return "";
  const v = (obj as Record<string, unknown>)[`${field}_${lang}`];
  if (typeof v === "string" && v.trim()) return v;
  const en = (obj as Record<string, unknown>)[`${field}_en`];
  return typeof en === "string" ? en : "";
}
