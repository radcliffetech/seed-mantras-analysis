import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { BasicTable } from "../components/BasicTable";
import { useTranslation } from "../i18n";

interface Bija {
  id: string;
  iast: string;
  devanagari: string;
  initialcluster: string;
  vowel: string;
  final: string;
}

export const SeedTable = ({ data }: { data: Bija[] }) => {
  const { t } = useTranslation();
  const columnHelper = createColumnHelper<Bija>();
  const columns = [
    columnHelper.accessor("iast", { header: () => t("seedIndex.iast") }),
    columnHelper.accessor("devanagari", {
      header: () => t("seedIndex.devanagari"),
    }),
    columnHelper.accessor("initialcluster", {
      header: () => t("seedIndex.initial"),
      cell: (info) => {
        const { getValue } = info;
        return getValue() === "" ? "—" : getValue();
      },
    }),
    columnHelper.accessor("vowel", { header: () => t("seedIndex.vowel") }),
    columnHelper.accessor("final", {
      header: () => t("seedIndex.final"),
      cell: (info) => {
        const { getValue } = info;
        return getValue() === "" ? "—" : getValue();
      },
    }),
  ];
  const table = useReactTable({
    data: data.slice(0, 100),
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return <BasicTable table={table} />;
};
