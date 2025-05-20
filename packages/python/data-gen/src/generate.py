from indic_transliteration.sanscript import SCHEMES, transliterate
import csv
from itertools import product

from constants import CONSONANT_CLUSTERS, VOWELS, FINALS, CONSONANT_METADATA


def generate_all_bijas():
    initial_clusters = [""] + CONSONANT_CLUSTERS
    bija_combinations = []

    for prefix, vowel, suffix in product(initial_clusters, VOWELS, FINALS):
        bija = prefix + vowel + suffix
        metadata = CONSONANT_METADATA.get(prefix, {})
        bija_combinations.append((bija, False, prefix, vowel, suffix, metadata))

    return bija_combinations


def main():
    import os

    bijas = generate_all_bijas()
    output_dir = "sandbox/output/"
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "all_bija_permutations.csv")
    with open(output_path, "w", newline="", encoding="utf-8") as csvfile:
        fieldnames = [
            "id",
            "IAST",
            "Devanagari",
            "ValidSanskrit",
            "Traditional",
            "InitialCluster",
            "Vowel",
            "Final",
            "Place",
            "Manner",
            "Voicing",
            "Aspiration",
            "Nasal",
            "Sibilant",
            "Retroflex",
        ]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for bija, is_traditional, prefix, vowel, suffix, meta in bijas:
            devanagari = transliterate(bija, "iast", "devanagari")
            writer.writerow(
                {
                    "id": f"seed-{bija.lower()}",
                    "IAST": bija,
                    "Devanagari": devanagari,
                    "ValidSanskrit": True,
                    "Traditional": is_traditional,
                    "InitialCluster": prefix,
                    "Vowel": vowel,
                    "Final": suffix,
                    "Place": meta.get("Place"),
                    "Manner": meta.get("Manner"),
                    "Voicing": meta.get("Voicing"),
                    "Aspiration": meta.get("Aspiration"),
                    "Nasal": meta.get("Nasal"),
                    "Sibilant": meta.get("Sibilant"),
                    "Retroflex": meta.get("Retroflex"),
                }
            )
    print(f"Generated {len(bijas)} bīja permutations and saved to '{output_path}'.")


if __name__ == "__main__":
    main()
