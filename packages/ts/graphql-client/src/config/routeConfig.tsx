import ExplorerView from "../views/ExplorerView";
import HomeView from "../views/HomeView";
import MandalaView from "../views/MandalaView";
import SeedIndexView from "../views/SeedIndexView";
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
    element: <SeedIndexView />,
    labelKey: "nav.index",
    requiresAuth: false,
    layout: "default",
  },
  {
    path: "/explorer",
    element: <ExplorerView />,
    labelKey: "nav.explorer",
    requiresAuth: false,
    layout: "default",
  },
];
