import { Link } from "react-router-dom";
import { useTranslation } from "../i18n";

type NavItem = {
  path: string;
  labelKey: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export default function Navbar({ navItems }: { navItems: NavItem[] }) {
  const { t } = useTranslation();

  return (
    <nav className="space-y-2">
      {navItems.map(({ path, labelKey, icon: Icon }) => (
        <Link
          key={path}
          to={path}
          className="flex items-center gap-2 text-brand-dark hover:text-brand-primary"
        >
          <Icon className="w-5 h-5" />
          {t(labelKey)}
        </Link>
      ))}
    </nav>
  );
}
