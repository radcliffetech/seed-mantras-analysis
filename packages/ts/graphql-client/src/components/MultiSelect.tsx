import React from "react";

interface MultiSelectProps {
  label: string;
  items: string[];
  selected: string[];
  onChange: (updated: string[]) => void;
}

const MultiSelect = ({
  label,
  items,
  selected,
  onChange,
}: MultiSelectProps) => {
  return (
    <div>
      <h3 className="mb-2 text-sm font-medium uppercase text-gray-500">
        {label}
      </h3>
      <div className="flex gap-4 flex-wrap">
        {items.map((item) => (
          <label key={item} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() =>
                onChange(
                  selected.includes(item)
                    ? selected.filter((f) => f !== item)
                    : [...selected, item]
                )
              }
            />
            {item}
          </label>
        ))}
      </div>
    </div>
  );
};

export default MultiSelect;
