# src/generate_phoneme_lists.py

import os
import csv
from constants import SINGLE_CONSONANTS, VOWELS, CONSONANT_METADATA


def write_phoneme_list(name, values, phoneme_type):
    path = os.path.join("output", f"{name}.csv")
    with open(path, "w", newline="", encoding="utf-8") as f:
        if phoneme_type == "Consonant":
            fieldnames = [
                "Phoneme",
                "Length",
                "Type",
                "Place",
                "Manner",
                "Voicing",
                "Aspiration",
                "Nasal",
                "Sibilant",
                "Retroflex",
            ]
        else:
            fieldnames = ["Phoneme", "Length", "Type"]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for v in values:
            row = {
                "Phoneme": v,
                "Length": len(v),
                "Type": phoneme_type,
            }
            if phoneme_type == "Consonant" and v in CONSONANT_METADATA:
                row.update(CONSONANT_METADATA[v])
            writer.writerow(row)
    print(f"Wrote {name} list to {path}")


def main():
    os.makedirs("tmp/output/", exist_ok=True)
    write_phoneme_list("single_consonants", SINGLE_CONSONANTS, "Consonant")
    write_phoneme_list("vowels", VOWELS, "Vowel")


if __name__ == "__main__":
    main()
