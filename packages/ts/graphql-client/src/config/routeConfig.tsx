import MandalaView from "../views/MandalaView";
import SearchIndexView from "../views/SearchIndexView";

export const routeConfig = [
  {
    path: "/",
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
