import csv
import strawberry
from typing import Optional, List
from pathlib import Path
from itertools import product

consonants = [
    "k",
    "kh",
    "g",
    "gh",
    "ṅ",
    "c",
    "ch",
    "j",
    "jh",
    "ñ",
    "ṭ",
    "ṭh",
    "ḍ",
    "ḍh",
    "ṇ",
    "t",
    "th",
    "d",
    "dh",
    "n",
    "p",
    "ph",
    "b",
    "bh",
    "m",
    "y",
    "r",
    "l",
    "v",
    "ś",
    "ṣ",
    "s",
    "h",
]

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
class BijaLink:
    source_id: str
    target_id: str


@strawberry.type
class BijaLayer:
    id: str
    name: str
    bijas: List[Bija]
    links: List[BijaLink]


@strawberry.type
class Query:
    def first_consonant_of_cluster(cluster):
        # Match longest possible consonant at the start (for "kh", etc.)
        for cons in sorted(consonants, key=lambda x: -len(x)):
            if cluster.startswith(cons):
                return cons
        return cluster[0]  # Fallback

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

    @strawberry.field
    def bija_layers(self, vowel: Optional[str] = None) -> List[BijaLayer]:
        layers = []
        vowel_order = [
            "a",
            "ā",
            "i",
            "ī",
            "u",
            "ū",
            "ṛ",
            "ṝ",
            "ḷ",
            "ḹ",
            "e",
            "ai",
            "o",
            "au",
        ]
        finals = ["ṁ", "ḥ", "m", "ṭ", "t"]
        consonants = [
            "k",
            "kh",
            "g",
            "gh",
            "c",
            "ch",
            "j",
            "jh",
            "d",
            "dh",
            "ḍ",
            "ḍh",
            "p",
            "ph",
            "b",
            "bh",
            "t",
            "th",
            "ṭ",
            "ṭh",
            "y",
            "r",
            "l",
            "v",
            "ś",
            "ṣ",
            "s",
        ]
        clusters = [c1 + c2 for c1, c2 in product(consonants, repeat=2)]

        def include(v):
            # if vowels is "all", include all
            # if vowels is "none", include none

            if vowel == "all":
                return True

            return vowel is None or v == vowel

        # Layer 1: pure vowels
        l1 = [
            Bija(
                id=v,
                iast=v,
                devanagari=None,
                validsanskrit=True,
                traditional=False,
                initialcluster=None,
                vowel=v,
                final=None,
                place=None,
                manner=None,
                voicing=None,
                aspiration=None,
                nasal=None,
                sibilant=None,
                retroflex=None,
            )
            for v in vowel_order
            if include(v)
        ]
        layers.append(BijaLayer(id="layer1", name="Vowels", bijas=l1, links=[]))

        # Layer 2: vowel + terminal
        l2 = [
            Bija(
                id=f"{v}{f}",
                iast=f"{v}{f}",
                devanagari=None,
                validsanskrit=True,
                traditional=False,
                initialcluster=None,
                vowel=v,
                final=f,
                place=None,
                manner=None,
                voicing=None,
                aspiration=None,
                nasal=None,
                sibilant=None,
                retroflex=None,
            )
            for v in vowel_order
            if include(v)
            for f in finals
        ]
        l2_links = [
            BijaLink(source_id=v.iast, target_id=b.iast)
            for v in l1
            for b in l2
            if b.iast.startswith(v.iast) and b.iast != v.iast
        ]
        layers.append(
            BijaLayer(id="layer2", name="Vowel + Terminal", bijas=l2, links=l2_links)
        )

        # Layer 3: simple prefix
        l3 = [
            Bija(
                id=f"{c}{v}{f}",
                iast=f"{c}{v}{f}",
                devanagari=None,
                validsanskrit=True,
                traditional=False,
                initialcluster=c,
                vowel=v,
                final=f,
                place=None,
                manner=None,
                voicing=None,
                aspiration=None,
                nasal=None,
                sibilant=None,
                retroflex=None,
            )
            for c in consonants
            for v in vowel_order
            if include(v)
            for f in finals
        ]
        l3_links = [
            BijaLink(source_id=f"{v}{f}", target_id=b.iast)
            for b in l3
            for v in vowel_order
            if include(v)
            for f in finals
            if b.iast == f"{b.initialcluster}{v}{f}"
        ]
        layers.append(
            BijaLayer(id="layer3", name="Simple Prefix", bijas=l3, links=l3_links)
        )

        # Layer 4: complex prefix
        l4 = [
            Bija(
                id=f"{c}{v}{f}",
                iast=f"{c}{v}{f}",
                devanagari=None,
                validsanskrit=True,
                traditional=False,
                initialcluster=c,
                vowel=v,
                final=f,
                place=None,
                manner=None,
                voicing=None,
                aspiration=None,
                nasal=None,
                sibilant=None,
                retroflex=None,
            )
            for c in clusters
            for v in vowel_order
            if include(v)
            for f in finals
        ]

        l4_links = [
            BijaLink(
                source_id=f"{first_consonant_of_cluster(c)}{v}{f}",
                target_id=f"{c}{v}{f}",
            )
            for c in clusters
            for v in vowel_order
            if include(v)
            for f in finals
        ]
        layers.append(
            BijaLayer(id="layer4", name="Complex Prefix", bijas=l4, links=l4_links)
        )

        return layers


schema = strawberry.Schema(query=Query)
