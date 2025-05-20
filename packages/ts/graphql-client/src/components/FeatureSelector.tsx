import { useTranslation } from "../i18n";

interface FeatureSelectorProps {
  label: string;
  items: string[];
  active: string | null;
  onSelect: (value: string | null) => void;
  color: string;
  i18nPrefix: string;
  size?: "sm" | "lg";
}

export const FeatureSelector = ({
  label,
  items,
  active,
  onSelect,
  color,
  i18nPrefix,
  size = "sm",
}: FeatureSelectorProps) => {
  const { t } = useTranslation();

  const pillClass = size === "lg" ? "pill pill-lg" : "pill";

  return (
    <div>
      <h3 className="text-sm font-medium uppercase text-gray-500 mb-2 p-0">
        {label}
      </h3>
      <div className="flex flex-wrap gap-2 mb-2">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => onSelect(item === active ? null : item)}
            className={pillClass}
            style={
              active === item ? { backgroundColor: color, color: "#fff" } : {}
            }
          >
            {t(`${i18nPrefix}.${item}`)}
          </button>
        ))}
      </div>
    </div>
  );
};
