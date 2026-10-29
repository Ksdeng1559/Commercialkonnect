"""Verify the burned captions against the authoritative source script.

The six narration lines live in src/video.tsx as `voice:` fields. The caption
text must reproduce those lines exactly, in order, with only the chunking and
the URL's trailing "A" (which the sibling ad also drops) differing. This script
parses the real source file and compares, so a drift between the narration and
the captions is caught before publication rather than after.
"""
import json
import os
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2] / "Videos" / "BLOC"
SRC = REPO / "src/video.tsx"
WORK = Path(os.environ.get("BLOC_WORK_DIR", REPO))
CAPS = WORK / "public/captions/captions.json"

# The sibling ad ends its URL line at "dot C" and never shows the trailing
# "A", so the same single-letter token is dropped here. The drop is applied to
# the source stream too, and the count is asserted, so the comparison below
# stays exact.
URL_A = "A."

text = SRC.read_text()
voices = re.findall(r"voice:'((?:[^'\\]|\\.)*)'", text)
if len(voices) != 6:
    sys.exit(f"expected 6 voice fields, found {len(voices)}")

script_words = []
for v in voices:
    script_words.extend(v.split())

# Apply the house-style drop to the source stream: the lone "A." that follows
# the "dot C" of the spoken URL.
expected: list[str] = []
dropped = 0
for i, w in enumerate(script_words):
    if w == URL_A and i > 0 and script_words[i - 1].endswith("C"):
        dropped += 1
        continue
    expected.append(w)

caption_words = []
for cue in json.loads(CAPS.read_text())["cues"]:
    for w in cue["words"]:
        caption_words.append(w["word"])

ok = True
if dropped != 1:
    ok = False
    print(f"MISMATCH  expected exactly 1 dropped URL token, found {dropped}")
else:
    print("OK  exactly 1 URL token dropped, matching the sibling ad")

if caption_words != expected:
    ok = False
    print("MISMATCH between caption text and src/video.tsx voice fields")
    for i, (a, b) in enumerate(zip(caption_words, expected)):
        if a != b:
            print(f"  first difference at word {i}: caption={a!r} source={b!r}")
            break
    print(f"  caption words={len(caption_words)} source words={len(expected)}")
else:
    print(f"OK  caption text matches all 6 source voice lines exactly "
          f"({len(expected)} words)")

# Every caption word must also exist in the source vocabulary.
src_vocab = set(script_words)
extra = [w for w in caption_words if w not in src_vocab]
if extra:
    ok = False
    print(f"MISMATCH  caption words not present in the source script: {extra}")
else:
    print("OK  no caption word outside the source script")

# Claim and brand integrity.
joined = " ".join(caption_words)
for phrase in ("two million dollars", "CommercialKonnect"):
    if phrase not in joined:
        ok = False
        print(f"MISSING  {phrase!r} from the caption text")
    else:
        print(f"OK  {phrase!r} present verbatim")

if "$2" in joined:
    ok = False
    print("MISMATCH  caption text contains '$2' instead of the spoken wording")
else:
    print("OK  no '$2' shorthand in the caption text")

print("RESULT:", "PASS" if ok else "FAIL")
sys.exit(0 if ok else 1)
