import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { gql, useQuery } from "@apollo/client";

import { BasicTable } from "../components/BasicTable";
import { useTranslation } from "../i18n";

const GET_BIJAS = gql`
  query {
    bijas(limit: 10) {
      id
      iast
      devanagari
      initialcluster
      vowel
      final
    }
  }
`;

const SearchIndexView = () => {
  const { t } = useTranslation();

  const { data, loading, error } = useQuery(GET_BIJAS);

  const columnHelper = createColumnHelper<any>();
  const columns = [
    columnHelper.accessor("iast", { header: "IAST" }),
    columnHelper.accessor("devanagari", { header: "Devanagari" }),
    columnHelper.accessor("initialcluster", { header: "Initial" }),
    columnHelper.accessor("vowel", { header: "Vowel" }),
    columnHelper.accessor("final", { header: "Final" }),
  ];

  const table = useReactTable({
    data: data?.bijas ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold mb-4">{t("searchIndex.title")}</h2>
        {loading && <p>{t("system.loading")}</p>}
        {error && (
          <p>
            {t("system.error")} {error.message}
          </p>
        )}
      </div>
      <div className="flex-1 border overflow-hidden shadow-sm">
        {!loading && !error && <BasicTable table={table} />}
      </div>
    </div>
  );
};

export default SearchIndexView;
