import { useTranslation } from "react-i18next";
import type { Lang } from "@/i18n";
import { SUPPORTED_LANGS } from "@/i18n";

export function useLanguage() {
  const { i18n } = useTranslation();
  const current = (SUPPORTED_LANGS as readonly string[]).includes(i18n.language)
    ? (i18n.language as Lang)
    : "en";
  return {
    lang: current,
    setLang: (l: Lang) => i18n.changeLanguage(l),
  };
}
