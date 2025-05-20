import React, { createContext, useContext, useEffect, useState } from "react";

export type ScriptMode = "iast" | "devanagari" | "iast-devanagari";
export type UILanguage = "en" | "sa";

const OutputScriptContext = createContext<{
  mode: ScriptMode;
  setMode: (mode: ScriptMode) => void;
}>({ mode: "devanagari", setMode: () => {} });

const UILanguageContext = createContext<{
  lang: UILanguage;
  setLang: (lang: UILanguage) => void;
}>({ lang: "en", setLang: () => {} });

export function OutputScriptProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<ScriptMode>(() => {
    return (localStorage.getItem("scriptMode") as ScriptMode) || "devanagari";
  });
  useEffect(() => {
    localStorage.setItem("scriptMode", mode);
  }, [mode]);
  return (
    <OutputScriptContext.Provider value={{ mode, setMode }}>
      {children}
    </OutputScriptContext.Provider>
  );
}

export function UILanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLang] = useState<UILanguage>(() => {
    return (localStorage.getItem("uiLang") as UILanguage) || "en";
  });
  useEffect(() => {
    localStorage.setItem("uiLang", lang);
  }, [lang]);
  return (
    <UILanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </UILanguageContext.Provider>
  );
}

export function useOutputScript() {
  return useContext(OutputScriptContext);
}

export function useUILanguage() {
  return useContext(UILanguageContext);
}
