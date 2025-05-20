import React from "react";
import { useTranslation } from "../i18n";

export default function HomeView() {
  const { t } = useTranslation();

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">{t("home.title")}</h1>
      <p className="text-lg text-gray-700">{t("home.description")}</p>
    </div>
  );
}
