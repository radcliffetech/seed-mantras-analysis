import { useTranslation } from "../i18n";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-surface-dark text-on-dark text-sm text-center p-3">
      &copy; {new Date().getFullYear()} {t("footer.copyright")}
    </footer>
  );
}
