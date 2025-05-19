from generate import generate_all_bijas


def test_generate_bijas_length():
    bijas = generate_all_bijas()
    assert len(bijas) > 1000


def test_known_bija_present():
    bijas = generate_all_bijas()
    bija_texts = [b[0] for b in bijas]
    assert "klīṁ" in bija_texts
