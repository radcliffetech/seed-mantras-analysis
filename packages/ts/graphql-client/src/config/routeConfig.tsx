import HomeView from "../views/HomeView";
import MandalaView from "../views/MandalaView";
import SearchIndexView from "../views/SearchIndexView";
export const routeConfig = [
  {
    path: "/",
    element: <HomeView />,
    labelKey: "nav.home",
    requiresAuth: false,
    layout: "default",
  },
  {
    path: "/mandala",
    element: <MandalaView />,
    labelKey: "nav.mandala",
    requiresAuth: false,
    layout: "default",
  },
  {
    path: "/index",
    element: <SearchIndexView />,
    labelKey: "nav.index",
    requiresAuth: false,
    layout: "default",
  },
];
