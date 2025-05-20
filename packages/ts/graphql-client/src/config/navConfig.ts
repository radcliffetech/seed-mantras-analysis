import {
  AdjustmentsHorizontalIcon,
  GlobeAltIcon,
  HomeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export const navConfig = [
  { path: "/", labelKey: "nav.home", icon: HomeIcon },
  { path: "/index", labelKey: "nav.index", icon: MagnifyingGlassIcon },
  { path: "/mandala", labelKey: "nav.mandala", icon: GlobeAltIcon },
  {
    path: "/explorer",
    labelKey: "nav.explorer",
    icon: AdjustmentsHorizontalIcon,
  },
];

export type NavItem = {
  path: string;
  labelKey: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};
