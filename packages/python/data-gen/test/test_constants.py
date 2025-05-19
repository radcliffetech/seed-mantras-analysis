from constants import CONSONANT_CLUSTERS


def test_consonant_clusters_match_valid_csv():
    import os

    # Load valid clusters from CSV
    cluster_path = "../../../data/validation/valid_clusters.csv"
    assert os.path.exists(cluster_path), f"Missing CSV file: {cluster_path}"

    with open(cluster_path, encoding="utf-8") as f:
        valid_clusters = [line.strip() for line in f if line.strip()]

    code_set = set(CONSONANT_CLUSTERS)
    file_set = set(valid_clusters)

    missing = file_set - code_set
    extra = code_set - file_set

    assert not missing and not extra, (
        f"Discrepancy in clusters.\n"
        f"Missing from code: {sorted(missing)}\n"
        f"Extra in code: {sorted(extra)}"
    )
