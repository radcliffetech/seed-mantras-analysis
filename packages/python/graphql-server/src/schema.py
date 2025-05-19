import csv
import strawberry
from typing import Optional, List
from pathlib import Path

OUTPUT_PHONEMES = (
    Path(__file__).resolve().parents[4] / "output" / "single_consonants.csv"
)
OUTPUT_BIJAS = (
    Path(__file__).resolve().parents[4] / "output" / "all_bija_permutations.csv"
)


@strawberry.type
class Phoneme:
    phoneme: str
    length: int
    type: str
    place: Optional[str]
    manner: Optional[str]
    voicing: Optional[str]
    aspiration: Optional[str]
    nasal: Optional[str]
    sibilant: Optional[str]
    retroflex: Optional[str]


def load_consonants() -> List[Phoneme]:
    with open(OUTPUT_PHONEMES, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return [Phoneme(**{k.lower(): v for k, v in row.items()}) for row in reader]


# Define Bija GraphQL type
@strawberry.type
class Bija:
    id: str
    iast: str
    devanagari: Optional[str]
    validsanskrit: bool
    traditional: bool
    initialcluster: Optional[str]
    vowel: Optional[str]
    final: Optional[str]
    place: Optional[str]
    manner: Optional[str]
    voicing: Optional[str]
    aspiration: Optional[str]
    nasal: Optional[str]
    sibilant: Optional[str]
    retroflex: Optional[str]


# Load bijas from CSV
def load_bijas() -> List[Bija]:
    with open(OUTPUT_BIJAS, encoding="utf-8") as f:
        reader = csv.DictReader(f)

        def parse_bool(val):
            if isinstance(val, bool):
                return val
            if val is None:
                return None
            return val.lower() in ("true", "1", "yes")

        bijas = []
        for row in reader:
            row_lower = {k.lower(): v for k, v in row.items()}
            # Parse bool fields
            row_lower["validsanskrit"] = parse_bool(row_lower.get("validsanskrit"))
            row_lower["traditional"] = parse_bool(row_lower.get("traditional"))
            bijas.append(Bija(**row_lower))
        return bijas


@strawberry.type
class Query:
    @strawberry.field
    def consonants(self, place: Optional[str] = None) -> List[Phoneme]:
        results = load_consonants()
        if place:
            results = [p for p in results if p.place == place]
        return results

    @strawberry.field
    def bijas(
        self, traditional: Optional[bool] = None, place: Optional[str] = None
    ) -> List[Bija]:
        results = load_bijas()
        if traditional is not None:
            results = [b for b in results if b.traditional == traditional]
        if place:
            results = [b for b in results if b.place == place]
        return results


schema = strawberry.Schema(query=Query)
