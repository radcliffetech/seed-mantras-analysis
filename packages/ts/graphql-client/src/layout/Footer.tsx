import { useTranslation } from "../i18n";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-gray-800 text-white text-sm text-center p-3">
      &copy; {new Date().getFullYear()} {t("footer.copyright")}
    </footer>
  );
}
