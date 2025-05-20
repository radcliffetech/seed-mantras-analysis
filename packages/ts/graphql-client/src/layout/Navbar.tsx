import { Link } from "react-router-dom";
import { useTranslation } from "../i18n";

type NavItem = {
  path: string;
  labelKey: string;
};

export default function Navbar({ navItems }: { navItems: NavItem[] }) {
  const { t } = useTranslation();

  return (
    <nav className="space-y-2">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className="block text-gray-700 hover:text-blue-600"
        >
          {t(item.labelKey)}
        </Link>
      ))}
    </nav>
  );
}
