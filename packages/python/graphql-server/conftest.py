import sys
from pathlib import Path

# Add the src/ directory to sys.path at runtime
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
