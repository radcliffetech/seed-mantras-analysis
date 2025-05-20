import { useOutputScript, useUILanguage } from "../context/OutputScriptContext";

import { useTranslation } from "../i18n";

export default function Header() {
  const { mode, setMode } = useOutputScript();
  const { lang, setLang } = useUILanguage();
  const { t } = useTranslation();

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center gap-4">
      <h1 className="text-xl font-semibold">{t("header.title")}</h1>
      <div className="flex gap-2 items-center">
        <label className="text-sm">{t("header.languageLabel")}:</label>
        <select
          className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1"
          value={lang}
          onChange={(e) => setLang(e.target.value as "en" | "sa")}
        >
          <option value="en">English</option>
          <option value="sa">संस्कृतम्</option>
        </select>
        <label className="text-sm">{t("header.outputLabel")}:</label>
        <select
          className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1"
          value={mode}
          onChange={(e) =>
            setMode(e.target.value as "iast" | "devanagari" | "iast-devanagari")
          }
        >
          <option value="devanagari">{t("header.devanagari")}</option>
          <option value="iast">{t("header.iast")}</option>
          <option value="iast-devanagari">{t("header.iastDevanagari")}</option>
        </select>
      </div>
    </header>
  );
}
