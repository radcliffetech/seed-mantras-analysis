import {
  OutputScriptProvider,
  UILanguageProvider,
} from "./context/OutputScriptContext";

import { BrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";
import { navConfig } from "./config/navConfig";

function App() {
  return (
    <BrowserRouter>
      <UILanguageProvider>
        <OutputScriptProvider>
          <Layout navItems={navConfig} />
        </OutputScriptProvider>
      </UILanguageProvider>
    </BrowserRouter>
  );
}

export default App;
