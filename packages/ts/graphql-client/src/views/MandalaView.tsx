import { gql, useQuery } from "@apollo/client";

import { BijaMandala } from "../components/BijaMandala";
import { FeatureSelector } from "../components/FeatureSelector";
import { SectionLoading } from "../components/SectionLoading";
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
      <FeatureSelector
        label={t("explorer.vowel")}
        items={vowelOrder}
        active={vowel}
        onSelect={(v) => setVowel(v || "")}
        color="#8b5cf6"
        i18nPrefix="vowels"
        size="sm"
      />
      {loading && <SectionLoading heading={t("system.loading")} />}
      {error && (
        <p>
          {t("system.error")} {error?.message}
        </p>
      )}

      {!loading && !error && bijaData && (
        <BijaMandala
          data={
            vowel === "all" ? bijaData.bijaLayers : bijaData.bijaLayers.slice(1)
          }
          scriptMode={mode}
        />
      )}
    </div>
  );
}
