import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import hy from "./hy.json";
import ru from "./ru.json";

export const SUPPORTED_LANGS = ["hy", "ru", "en"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        hy: { translation: hy },
        ru: { translation: ru },
      },
      fallbackLng: "en",
      supportedLngs: SUPPORTED_LANGS,
      detection: {
        order: ["localStorage", "navigator"],
        lookupLocalStorage: "preferred_language",
        caches: ["localStorage"],
      },
      interpolation: { escapeValue: false },
    });
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
