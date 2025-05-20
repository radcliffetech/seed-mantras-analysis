import { useTranslation } from "../i18n";

export const SearchForm = ({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-2 items-center mb-4">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border px-3 py-2 rounded w-full max-w-md"
      />
      <button
        type="submit"
        className="bg-brand-dark text-white px-4 py-2 rounded hover:bg-brand-primary"
      >
        {t("system.search")}
      </button>
    </div>
  );
};
