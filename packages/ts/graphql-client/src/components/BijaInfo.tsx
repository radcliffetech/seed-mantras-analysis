import { useMemo } from "react";

type Bija = {
  id: string;
  iast: string;
  traditional: boolean;
  initialcluster: string;
  vowel: string;
  final: string;
  place?: string;
};

type Props = {
  data: Bija[];
};

export const BijaInfo = ({ data }: Props) => {
  const stats = useMemo(() => {
    const total = data.length;
    const traditional = data.filter((b) => b.traditional).length;

    const vowelCount = new Map<string, number>();
    const placeCount = new Map<string, number>();

    data.forEach((b) => {
      vowelCount.set(b.vowel, (vowelCount.get(b.vowel) || 0) + 1);
      if (b.place) {
        placeCount.set(b.place, (placeCount.get(b.place) || 0) + 1);
      }
    });

    return {
      total,
      traditional,
      vowelCount: Array.from(vowelCount.entries()),
      placeCount: Array.from(placeCount.entries()),
    };
  }, [data]);

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h3>Bīja Stats</h3>
      <p>Total: {stats.total}</p>
      <p>Traditional: {stats.traditional}</p>

      <h4>By Vowel</h4>
      <ul>
        {stats.vowelCount.map(([vowel, count]) => (
          <li key={vowel + count}>
            {vowel}: {count}
          </li>
        ))}
      </ul>

      <h4>By Place of Articulation</h4>
      <ul>
        {stats.placeCount.map(([place, count]) => (
          <li key={place}>
            {place}: {count}
          </li>
        ))}
      </ul>
    </div>
  );
};
