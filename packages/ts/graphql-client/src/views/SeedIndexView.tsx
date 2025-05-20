import { gql, useQuery } from "@apollo/client";
import { useEffect, useMemo, useState } from "react";

import { SectionLoading } from "../components/SectionLoading";
import { SeedHeap } from "../components/SeedHeap";
import { useDebounce } from "use-debounce";
import { useTranslation } from "../i18n";

const VOWEL_HIGHLIGHT_COLOR = "#8b5cf6";
const CONSONANT_HIGHLIGHT_COLOR = "#34d399";
const FINAL_HIGHLIGHT_COLOR = "#60a5fa";
const GET_BIJAS = gql`
  query GetBijas($limit: Int!) {
    bijas(limit: $limit) {
      id
      iast
      devanagari
      initialcluster
      vowel
      final
    }
  }
`;

interface Bija {
  id: string;
  iast: string;
  devanagari: string;
  initialcluster: string;
  vowel: string;
  final: string;
}

const SeedIndexView = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 200);
  const [limit, setLimit] = useState(1000);
  const { data, loading, error } = useQuery(GET_BIJAS, {
    variables: { limit },
  });
  const [allSeeds, setAllSeeds] = useState<Bija[]>([]);

  const [highlightVowel, setHighlightVowel] = useState<string | null>(null);
  const [highlightConsonant, setHighlightConsonant] = useState<string | null>(
    null,
  );
  const [highlightFinal, setHighlightFinal] = useState<string | null>(null);

  const vowelOrder = [
    "a",
    "ā",
    "i",
    "ī",
    "u",
    "ū",
    "ṛ",
    "ṝ",
    "ḷ",
    "e",
    "ai",
    "o",
    "au",
  ];
  const consonantList = [
    "k",
    "kh",
    "g",
    "gh",
    "ṅ",
    "c",
    "ch",
    "j",
    "jh",
    "ñ",
    "ṭ",
    "ṭh",
    "ḍ",
    "ḍh",
    "ṇ",
    "t",
    "th",
    "d",
    "dh",
    "n",
    "p",
    "ph",
    "b",
    "bh",
    "m",
    "y",
    "r",
    "l",
    "v",
    "ś",
    "ṣ",
    "s",
    "h",
  ];
  const finalList = ["ṁ", "ḥ", "m", "ṭ", "t"];

  useEffect(() => {
    if (data) {
      setAllSeeds(data.bijas || []);
    }
  }, [data]);

  const filteredSeeds = useMemo(() => {
    if (!debouncedQuery) return allSeeds;
    return allSeeds.filter((seed) =>
      seed.iast.toLowerCase().includes(debouncedQuery.toLowerCase()),
    );
  }, [debouncedQuery, allSeeds]);

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-4">{t("seedIndex.title")}</h2>
      <div className="mb-4">
        <label htmlFor="limitRange" className="block font-medium mb-1">
          Display Limit: {limit}
        </label>
        <input
          id="limitRange"
          type="range"
          min={100}
          max={10000}
          step={100}
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="w-full"
        />
      </div>
      {loading && <SectionLoading heading={t("system.loading")} />}
      {error && (
        <p>
          {t("system.error")} {error.message}
        </p>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          <div>
            <span>{allSeeds.length.toLocaleString()} seeds in storehouse</span>
            <br />
            <span>
              {t("seedIndex.displaying")}{" "}
              {filteredSeeds.length.toLocaleString()} {t("seedIndex.filtered")}
            </span>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium uppercase text-gray-500">
              {t("consonant")}
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {consonantList.map((c) => (
                <button
                  key={c}
                  onClick={() =>
                    setHighlightConsonant(c === highlightConsonant ? null : c)
                  }
                  className={`pill pill-lg ${
                    highlightConsonant === c
                      ? `bg-[${CONSONANT_HIGHLIGHT_COLOR}] text-white`
                      : ""
                  }`}
                >
                  {t(`consonants.${c}`)}
                </button>
              ))}
            </div>
            <h3 className="text-sm font-medium uppercase text-gray-500">
              Vowel
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {vowelOrder.map((v) => (
                <button
                  key={v}
                  onClick={() =>
                    setHighlightVowel(v === highlightVowel ? null : v)
                  }
                  className={`pill pill-lg ${
                    highlightVowel === v
                      ? `bg-[${VOWEL_HIGHLIGHT_COLOR}] text-white`
                      : ""
                  }`}
                >
                  {t(`vowels.${v}`)}
                </button>
              ))}
            </div>

            <h3 className="text-sm font-medium uppercase text-gray-500">
              {t("final")}
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {finalList.map((f) => (
                <button
                  key={f}
                  onClick={() =>
                    setHighlightFinal(f === highlightFinal ? null : f)
                  }
                  className={`pill pill-lg ${
                    highlightFinal === f
                      ? `bg-[${FINAL_HIGHLIGHT_COLOR}] text-white`
                      : ""
                  }`}
                >
                  {t(`finals.${f}`) || <span>&nbsp;</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="">
            <SeedHeap
              data={filteredSeeds}
              highlightVowel={highlightVowel}
              highlightConsonant={highlightConsonant}
              highlightFinal={highlightFinal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SeedIndexView;
