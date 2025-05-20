import { Route, Routes } from "react-router-dom";

import { routeConfig } from "../config/routeConfig";

export default function MainStage() {
  return (
    <main className="flex-1 p-6 bg-white">
      <Routes>
        {routeConfig.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </main>
  );
}
