import { translations } from "./translations";
import { useUILanguage } from "../context/OutputScriptContext";

export function useTranslation() {
  const { lang } = useUILanguage();
  const t = (key: string): string => {
    return (
      key
        .split(".")
        .reduce((acc: any, part: string) => acc?.[part], translations[lang]) ??
      key
    );
  };
  return { t };
}
