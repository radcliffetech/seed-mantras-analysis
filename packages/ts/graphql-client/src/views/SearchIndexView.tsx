import { useOutputScript } from "../context/OutputScriptContext";
import { useTranslation } from "../i18n";

const SearchIndexView = () => {
  const { mode } = useOutputScript();
  const { t } = useTranslation();

  const sampleBija = {
    iast: "haṃ",
    devanagari: "हं",
  };

  return (
    <div className={`p-4`}>
      <h2 className="text-2xl font-bold mb-4">{t("searchIndex.title")}</h2>
      <p>
        {t("searchIndex.displaying")}:{" "}
        {mode === "iast" ? (
          sampleBija.iast
        ) : mode === "devanagari" ? (
          sampleBija.devanagari
        ) : (
          <span>{sampleBija.iast}</span>
        )}
      </p>
    </div>
  );
};

export default SearchIndexView;
