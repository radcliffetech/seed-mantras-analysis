import pandas as pd


def test_all_standard_bijas_present():
    # File paths
    known_good_path = "../../../data/validation/known_good_bija.csv"
    generated_path = "../../../output/all_bija_permutations.csv"

    # Load the data
    known_df = pd.read_csv(known_good_path)
    generated_df = pd.read_csv(generated_path)

    # Normalize the entries for comparison
    # The new generator output uses "IAST" as the column for the bija string.
    generated_set = set(generated_df["IAST"].astype(str).str.strip())

    # Exclude non-standard bījas from known list
    filtered_known_df = known_df[~known_df["Non-Standard"].fillna(False)]
    known_set = set(filtered_known_df["Bīja"].astype(str).str.strip())

    # Check for missing bījas
    missing_bijas = sorted(known_set - generated_set)

    assert not missing_bijas, "Missing known bījas: " + ", ".join(missing_bijas)
