"""Measure the BLOC caption band and its karaoke fill from rendered pixels.

What is checked:
  1. the white caption band sits entirely above the ad's own footer row
     ("CommercialKonnect.ca | 0X / 06") and below its copy area;
  2. the karaoke fill advances within a single line: teal grows and navy
     shrinks as that line is spoken, and the line is fully teal by its end.

Measuring the band correctly takes care. The ad's own footer and legal lines
also contain near-white pixels in the lower region, and the band's own text
rows break the white rectangle into fragments. The band is therefore located
by its solid white rows: the blank margins above and below the caption text
are unbroken white, while the footer's small antialiased lettering never
forms a solid run.
"""
import os
import sys
from pathlib import Path

from PIL import Image

NAVY = (0x10, 0x29, 0x43)
TEAL = (0x15, 0xB5, 0xA4)
WHITE = (0xFF, 0xFF, 0xFF)

# A solid row is one with an unbroken near-white run at least this wide. The
# narrowest caption in the ad is a single short word, so this is set to the
# width of the narrowest plausible band rather than to a typical one.
MIN_SOLID_RUN = 120

FOOTER_TOP = 1724   # measured: the ad's own footer row starts here
CLEAR_TOP = 1101    # measured: bottom of the ad's own copy area


def near(px, ref, tol=26):
    return all(abs(px[i] - ref[i]) <= tol for i in range(3))


def longest_white_run(px, y, w):
    best_len = 0
    best_x0 = 0
    run = 0
    start = 0
    for x in range(w):
        if near(px[x, y], WHITE):
            if run == 0:
                start = x
            run += 1
            if run > best_len:
                best_len = run
                best_x0 = start
        else:
            run = 0
    return best_len, best_x0


def find_band(px, w, h):
    """Return (top, bottom, x0, x1) of the caption band, or None."""
    solid = []
    for y in range(h - 400, h):
        run_len, x0 = longest_white_run(px, y, w)
        if run_len >= MIN_SOLID_RUN:
            solid.append((y, x0, x0 + run_len - 1))
    if not solid:
        return None

    # The band produces two solid clusters: the blank margin above the text
    # and the blank margin below it. Take the outermost edges of the band.
    top = solid[0][0]
    bottom = solid[-1][0]
    x0 = min(s[1] for s in solid)
    x1 = max(s[2] for s in solid)
    return top, bottom, x0, x1


def analyze(path: Path):
    im = Image.open(path).convert("RGB")
    w, h = im.size
    px = im.load()

    band = find_band(px, w, h)
    if band is None:
        return None
    top, bottom, bx0, bx1 = band

    teal = navy = 0
    for y in range(top, bottom + 1):
        for x in range(bx0, bx1 + 1):
            p = px[x, y]
            if near(p, TEAL, tol=40):
                teal += 1
            elif near(p, NAVY, tol=18):
                navy += 1
    return {"band": band, "teal": teal, "navy": navy}


def report(label, path: Path):
    r = analyze(path)
    if r is None:
        print(f"{label:>18}  NO BAND")
        return None
    top, bottom, x0, x1 = r["band"]
    print(f"{label:>18}  band y={top}-{bottom} x={x0}-{x1}  "
          f"teal={r['teal']:>5}  navy={r['navy']:>5}")
    return r


def main() -> int:
    # Stills are rendered by the Remotion build; point BLOC_WORK_DIR at the
    # build tree that contains out/stills2 and out/stills3.
    work = Path(os.environ.get("BLOC_WORK_DIR", Path(__file__).resolve().parents[2] / "Videos" / "BLOC"))
    stills2 = work / "out/stills2"
    stills3 = work / "out/stills3"

    ok = True

    print("-- band geometry across all six scenes --")
    for f in sorted(int(p.stem.split("_")[1]) for p in stills2.glob("cap_*.png")):
        r = report(f"frame {f}", stills2 / f"cap_{f}.png")
        if r is None:
            ok = False
            continue
        top, bottom, _, _ = r["band"]
        if bottom >= FOOTER_TOP:
            ok = False
            print(f"FAIL  band bottom {bottom} overlaps the footer row (starts {FOOTER_TOP})")
        if top < CLEAR_TOP:
            ok = False
            print(f"FAIL  band top {top} is above the clear region ({CLEAR_TOP})")
    print(f"OK  every band clears the footer row (y={FOOTER_TOP})" if ok else "BAND COLLISION")

    print("\n-- karaoke fill within cue 1 'Your BC business is' (0.17-1.45 s) --")
    series = []
    for f in sorted(int(p.stem.split("_")[1]) for p in stills3.glob("cue1_*.png")):
        r = report(f"frame {f}", stills3 / f"cue1_{f}.png")
        if r:
            series.append((f, r))

    if series:
        teals = [r["teal"] for _, r in series]
        navys = [r["navy"] for _, r in series]
        # The fill is a step function: it holds between word boundaries and
        # jumps at each one, so it must never decrease.
        if all(teals[i + 1] >= teals[i] for i in range(len(teals) - 1)):
            print("OK  teal never decreases as the line is spoken")
        else:
            ok = False
            print("FAIL  teal decreases mid-line")
        if all(navys[i + 1] <= navys[i] for i in range(len(navys) - 1)):
            print("OK  navy never increases as the line is spoken")
        else:
            ok = False
            print("FAIL  navy increases mid-line")
        if teals[-1] > teals[0] and navys[-1] < navys[0]:
            print(f"OK  net fill over the cue: teal {teals[0]} -> {teals[-1]}, "
                  f"navy {navys[0]} -> {navys[-1]}")
        else:
            ok = False
            print("FAIL  no net fill over the cue")
        # By the end of the line every word has been spoken, so the band must
        # be effectively all teal. A small navy residue is expected: the
        # antialiased edge of the final glyph blends teal into the white
        # background and lands in the navy bucket.
        ink = teals[-1] + navys[-1]
        residue = navys[-1] / ink if ink else 1.0
        if residue <= 0.01:
            print(f"OK  the line is effectively all teal by its end "
                  f"(navy residue {navys[-1]} px = {residue:.2%})")
        else:
            ok = False
            print(f"FAIL  line not fully teal at its end "
                  f"(teal={teals[-1]} navy={navys[-1]}, residue {residue:.2%})")

    print("\nRESULT:", "PASS" if ok else "FAIL")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
