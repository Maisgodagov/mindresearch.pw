"""Regenerate the static landing report using the real statistics engine and synthetic data."""
import json
import sys
from pathlib import Path
root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(root / "apps/api/statistics"))
from engine import calculate
request = {"method": "pearson", "alpha": .05, "groups": [
 {"label": "Общая самоэффективность · GSES", "values": [28,31,24,35,30,26,33,27,34,29,32,25]},
 {"label": "Социальная поддержка · MSPSS", "values": [4.25,5.5,3.75,5.75,4.5,4,5.25,4.75,6,3.5,5,4.25]},
]}
fixture = {"request": request, "result": calculate(request)}
target = root / "apps/web/src/containers/Landing/pearsonReport.json"
target.write_text(json.dumps(fixture, ensure_ascii=False, indent=2, allow_nan=False) + "\n", encoding="utf-8")
print("Pearson fixture:", fixture["result"]["statistic"], fixture["result"]["p"])
