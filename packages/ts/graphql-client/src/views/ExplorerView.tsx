import { gql, useQuery } from "@apollo/client";
import { useMemo, useState } from "react";

import { FeatureSelector } from "../components/FeatureSelector";
import MultiSelect from "../components/MultiSelect";
import { SectionLoading } from "../components/SectionLoading";
import { useTranslation } from "../i18n";

const ALL_FIELDS = ["iast", "devanagari", "initialcluster", "vowel", "final"];

const ExplorerView = () => {
  const { t } = useTranslation();
  const [selectedFields, setSelectedFields] = useState<string[]>([
    "iast",
    "devanagari",
  ]);
  const [vowelFilter, setVowelFilter] = useState<string | null>("a");
  const [finalFilter, setFinalFilter] = useState<string | null>(null);

  const query = useMemo(() => {
    const fields = selectedFields.length
      ? selectedFields.join("\n      ")
      : "iast";
    return gql`
      query GetBijas($vowel: String, $final: String) {
        bijas(vowel: $vowel, final: $final) {
          ${fields}
        }
      }
    `;
  }, [selectedFields]);

  const { data, loading, error } = useQuery(query, {
    variables: { vowel: vowelFilter, final: finalFilter },
  });

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold"> {t("explorer.title")} </h1>
      <div className="space-y-4">
        <h2 className="text-lg font-medium">{t("system.filters")}</h2>
        <div className="border p-4 bg-white rounded shadow-sm space-y-4">
          <FeatureSelector
            label={t("explorer.vowel")}
            items={[
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
            ]}
            active={vowelFilter}
            onSelect={setVowelFilter}
            color="#8b5cf6"
            i18nPrefix="vowels"
          />
          <FeatureSelector
            label={t("explorer.final")}
            items={["ṁ", "ḥ", "m", "ṭ", "t"]}
            active={finalFilter}
            onSelect={setFinalFilter}
            color="#60a5fa"
            i18nPrefix="finals"
          />

          <MultiSelect
            label={t("explorer.fieldsToFetch")}
            items={ALL_FIELDS}
            selected={selectedFields}
            onChange={setSelectedFields}
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-medium">
            {t("explorer.generatedQuery")}
          </h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
            {`query GetBijas {
  bijas {
    ${selectedFields.join("\n    ")}
  }
}`}
          </pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium">{t("system.results")}</h2>
        {loading && <SectionLoading heading={t("system.loading")} />}
        {error && <p>Error: {error.message}</p>}
        {data?.bijas && (
          <table className="min-w-full border text-sm">
            <thead>
              <tr>
                {selectedFields.map((field) => (
                  <th key={field} className="text-left px-2 py-1 border-b">
                    {field}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.bijas.map((b: any, i: number) => (
                <tr key={i}>
                  {selectedFields.map((field) => (
                    <td key={field} className="px-2 py-1 border-b">
                      {b[field] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ExplorerView;
