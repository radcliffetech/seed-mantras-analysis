import { useOutputScript, useUILanguage } from "../context/OutputScriptContext";

import { Link } from "react-router-dom";
import { useTranslation } from "../i18n";

export default function Header() {
  const { mode, setMode } = useOutputScript();
  const { lang, setLang } = useUILanguage();
  const { t } = useTranslation();

  return (
    <header className="bg-brand-dark text-brand-light p-4 flex justify-between items-center gap-4">
      <Link to="/" className="text-xl font-semibold hover:underline">
        {t("header.title")}
      </Link>
      <div className="flex gap-2 items-center">
        <label className="text-sm">{t("header.languageLabel")}:</label>
        <select
          className="bg-brand-dark text-brand-light border border-brand-primary rounded px-2 py-1"
          value={lang}
          onChange={(e) => setLang(e.target.value as "en" | "sa")}
        >
          <option value="en">English</option>
          <option value="sa">संस्कृतम्</option>
        </select>
        <label className="text-sm">{t("header.outputLabel")}:</label>
        <select
          className="bg-brand-dark text-brand-light border border-brand-primary rounded px-2 py-1"
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
