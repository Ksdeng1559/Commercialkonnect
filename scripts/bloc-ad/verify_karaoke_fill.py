"""Verify the karaoke fill advances within a single caption line.

The fill must be judged inside one cue: teal grows and navy shrinks as that
line is spoken. Comparing across different cues proves nothing, because the
lines have different word counts.

Frames are rendered across one cue and the band pixels are counted.
"""
import os
import subprocess
import sys
from pathlib import Path

from PIL import Image

# Frames are rendered by the Remotion build; point BLOC_WORK_DIR at the build
# tree that contains out/stills3.
STILLS = Path(os.environ.get(
    "BLOC_WORK_DIR",
    Path(__file__).resolve().parents[2] / "Videos" / "BLOC")) / "out/stills3"
NAVY = (0x10, 0x29, 0x43)
TEAL = (0x15, 0xB5, 0xA4)
WHITE = (0xFF, 0xFF, 0xFF)


def near(px, ref, tol=26):
    return all(abs(px[i] - ref[i]) <= tol for i in range(3))


def counts(path: Path):
    im = Image.open(path).convert("RGB")
    w, h = im.size
    px = im.load()
    teal = navy = 0
    for y in range(h - 400, h):
        xs = [x for x in range(w) if near(px[x, y], WHITE)]
        if not xs:
            continue
        # Only rows inside the caption band count; the legal disclosure and
        # the footer sit on the dark backdrop, not on white.
        if len(xs) < 70:
            continue
        for x in range(xs[0], xs[-1] + 1):
            p = px[x, y]
            if near(p, TEAL, tol=40):
                teal += 1
            elif near(p, NAVY, tol=18):
                navy += 1
    return teal, navy


frames = sorted(int(p.stem.split("_")[1]) for p in STILLS.glob("cue1_*.png"))
print("cue 1: 'Your BC business is'  (0.17 - 1.45 s)")
print(f"{'frame':>6} {'t(s)':>6} {'teal':>6} {'navy':>6}")
series = []
for f in frames:
    t, n = counts(STILLS / f"cue1_{f}.png")
    series.append((f, t, n))
    print(f"{f:>6} {f/30:>6.2f} {t:>6} {n:>6}")

ok = True
teals = [t for _, t, _ in series]
navys = [n for _, _, n in series]
if not all(teals[i + 1] > teals[i] for i in range(len(teals) - 1)):
    ok = False
    print("FAIL  teal does not strictly rise within the cue")
else:
    print("OK  teal rises at every step within the cue")
if not all(navys[i + 1] <= navys[i] for i in range(len(navys) - 1)):
    ok = False
    print("FAIL  navy does not fall within the cue")
else:
    print("OK  navy falls at every step within the cue")
if teals[-1] <= teals[0] or navys[-1] >= navys[0]:
    ok = False
    print("FAIL  no net teal gain over the cue")
else:
    print(f"OK  net teal gain over the cue: {teals[0]} -> {teals[-1]}, "
          f"navy {navys[0]} -> {navys[-1]}")

print("RESULT:", "PASS" if ok else "FAIL")
sys.exit(0 if ok else 1)
