import { gql, useQuery } from "@apollo/client";

import { BijaMandala } from "../components/BijaMandala";
import { useOutputScript } from "../context/OutputScriptContext";
import { useState } from "react";
import { useTranslation } from "../i18n";

export default function MandalaView() {
  const [vowel, setVowel] = useState<string>("ai");
  const { mode } = useOutputScript();
  // const { lang } = useUILanguage();
  const { t } = useTranslation();
  const getQuery = () => gql`
  query {
    bijaLayers(vowel: "${vowel}") {
      id
      name
      bijas {
        id
        iast
        devanagari
        traditional
        initialcluster
        place
        manner
        voicing
        retroflex
        vowel
        final
      }
      links {
        sourceId
        targetId
      }
    }
  }
`;

  const {
    data: bijaData,
    loading: loading,
    error: error,
  } = useQuery(getQuery());
  const vowelOrder = [
    "all",
    "a",
    "ā",
    "i",
    "ī",
    "u",
    "ū",
    "ṛ",
    "ṝ",
    "ḷ",
    "ḹ",
    "e",
    "ai",
    "o",
    "au",
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        {vowelOrder.map((v) => (
          <button
            key={v}
            onClick={() => setVowel(v)}
            className={`${
              vowel === v ? "pill pill-lg pill-active" : "pill pill-lg"
            }`}
          >
            {t(`vowels.${v}`)}
          </button>
        ))}
      </div>
      {loading && <p>{t("system.loading")}</p>}
      {error && (
        <p>
          {t("system.error")} {error?.message}
        </p>
      )}

      {!loading && !error && bijaData && (
        <BijaMandala data={bijaData.bijaLayers} scriptMode={mode} />
      )}
    </div>
  );
}
