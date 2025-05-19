import os
import csv
from itertools import product
from constants import SINGLE_CONSONANTS


def generate_clusters():
    singles = SINGLE_CONSONANTS
    pairs = [a + b for a, b in product(singles, singles)]
    all_clusters = sorted(set(singles + pairs))

    enriched = []
    for cluster in all_clusters:
        enriched.append(
            {
                "Cluster": cluster,
                "Length": len(cluster),
                "StartsWith": cluster[:2] if len(cluster) > 1 else cluster,
                "EndsWith": cluster[-2:] if len(cluster) > 1 else cluster,
                "IsRepeated": (
                    cluster[: len(cluster) // 2] == cluster[len(cluster) // 2 :]
                    if len(cluster) % 2 == 0
                    else False
                ),
            }
        )
    return enriched


def main():
    clusters = generate_clusters()
    output_dir = os.path.join(os.path.dirname(__file__), "..", "tmp/output")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "consonant_clusters.csv")
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        fieldnames = ["Cluster", "Length", "StartsWith", "EndsWith", "IsRepeated"]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in clusters:
            writer.writerow(row)
    print(f"Wrote {len(clusters)} clusters with metadata to {output_path}")


if __name__ == "__main__":
    main()
