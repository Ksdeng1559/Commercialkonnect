"""Build BLOC caption cues from the ad script, timed by the OpenMontage transcript.

Two rules drive this script.

1. On-screen words come from the SCRIPT (the `voice` field of each scene in
   src/video.tsx), never from the ASR. Whisper rewrites "two million dollars"
   as "$2 million" and collapses "CommercialKonnect" into "Commercial
   Connect"; using its text would silently change a commercial claim and the
   brand name on screen. The ASR is used only to recover timing.

2. The cue shape follows the sibling ad's house style: sentence-aware phrases
   of at most four words, so a caption is read in one glance.

The script tokens are aligned to the ASR tokens with a Needleman-Wunsch style
alignment on fuzzy token similarity. Script words the ASR never heard (for
example the spoken "dollars" inside "$2 million") are interpolated into the
surrounding silence, which is where they were actually spoken.

Output: public/captions/captions.base.json (unsynchronised). sync_captions.py
shifts it onto the true acoustic onset and emits the typed copy that the
Remotion component imports.
"""
from __future__ import annotations

import difflib
import json
import os
import re
from pathlib import Path

# Paths are resolved relative to this file so the pipeline runs from any
# checkout. REPO is the ad project; WORK is where the Remotion build and its
# generated assets live (the build tree, which mirrors REPO/src).
REPO = Path(__file__).resolve().parents[2] / "Videos" / "BLOC"
WORK = Path(os.environ.get("BLOC_WORK_DIR", REPO))
TRANSCRIPT = WORK / "public/audio/transcript/vo_master_transcript.json"
OUT = WORK / "public/captions/captions.base.json"

# scene_id -> (script text, window start, window end)
# Mirrors the `voice` field of each scene in src/video.tsx. Keep in sync.
SCENES = [
    ("s1", "Your BC business is growing. But is your cash flow keeping up?", 0.0, 4.0),
    ("s2", "Payroll, inventory, bigger orders. Cash flow gaps can slow your momentum.", 4.0, 9.0),
    ("s3", "A business line of credit may help. And other funding structures could fit too.", 9.0, 14.0),
    ("s4", "Explore business financing options up to two million dollars, with fast decisions "
           "available from select lenders.", 14.0, 20.0),
    ("s5", "CommercialKonnect connects you with financing professionals to explore what may fit "
           "your business.", 20.0, 25.0),
    ("s6", "Visit CommercialKonnect dot C A. Explore your options today.", 25.0, 30.0),
]

MAX_WORDS = 4     # the sibling never shows more than four words at once
MIN_CHARS = 2     # a cue shorter than this reads badly alone, so it is merged back
GAP = -0.45       # alignment penalty for leaving a token unmatched
MIN_SIM = 0.55    # below this two tokens are considered unrelated

# The widest sibling band measured 988px, so its text never exceeded ~964px.
MAX_TEXT_W = 960

# Arial Bold is the sibling ad's caption face. The width check below needs the
# real font metrics, so a path is resolved at runtime with a fallback list
# rather than being hardcoded to one machine.
FONT_CANDIDATES = [
    Path("/mnt/c/Windows/Fonts/arialbd.ttf"),
    Path("/usr/share/fonts/truetype/msttcorefonts/Arial_Bold.ttf"),
    Path("/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"),
]
FONT_SIZE = 50


def find_font() -> Path:
    for p in FONT_CANDIDATES:
        if p.exists():
            return p
    raise FileNotFoundError(
        "Arial Bold not found; install the font or add its path to FONT_CANDIDATES")

NUMBER_WORDS = {
    "1": "one", "2": "two", "3": "three", "4": "four", "5": "five",
    "1st": "first", "2nd": "second", "3rd": "third",
}


def tok_key(tok: str) -> str:
    """Loose comparison key: case, punctuation and number format are ignored."""
    t = re.sub(r"[^a-z0-9$ ]+", " ", tok.strip().lower()).strip()
    if t in NUMBER_WORDS:
        return NUMBER_WORDS[t]
    bare = t.replace("$", "")
    if bare in NUMBER_WORDS:
        return NUMBER_WORDS[bare]
    return t


def similarity(a: str, b: str) -> float:
    ka, kb = tok_key(a), tok_key(b)
    if not ka or not kb:
        return 0.0
    if ka == kb:
        return 1.0
    if ka in kb or kb in ka:
        # Covers the ASR's split brand name ("Commercial" + "Connect" for
        # "CommercialKonnect") and the URL tail it heard as ".ca.".
        return 0.9
    return difflib.SequenceMatcher(None, ka, kb).ratio()


def align(script: list[str], asr: list[dict]) -> dict[int, tuple[float, float]]:
    """Map each script token index to a start/end time taken from the ASR."""
    n, m = len(script), len(asr)
    dp = [[-1e9] * (m + 1) for _ in range(n + 1)]
    back = [[None] * (m + 1) for _ in range(n + 1)]
    dp[0][0] = 0.0
    for i in range(n + 1):
        for j in range(m + 1):
            cur = dp[i][j]
            if cur <= -1e8:
                continue
            if i < n and j < m:
                s = similarity(script[i], asr[j]["word"])
                if s >= MIN_SIM and cur + s > dp[i + 1][j + 1]:
                    dp[i + 1][j + 1] = cur + s
                    back[i + 1][j + 1] = ("match", i, j)
            if i < n and cur + GAP > dp[i + 1][j]:
                dp[i + 1][j] = cur + GAP
                back[i + 1][j] = ("skip-script", i, j)
            if j < m and cur + GAP > dp[i][j + 1]:
                dp[i][j + 1] = cur + GAP
                back[i][j + 1] = ("skip-asr", i, j)

    pairs: dict[int, tuple[float, float]] = {}
    matched_asr: dict[int, str] = {}
    matched_asr_idx: dict[int, int] = {}
    skipped_asr: list[int] = []
    i, j = n, m
    while i > 0 or j > 0:
        step = back[i][j]
        if step is None:
            break
        kind, pi, pj = step
        if kind == "match":
            pairs[pi] = (asr[pj]["start"], asr[pj]["end"])
            matched_asr[pi] = asr[pj]["word"].strip()
            matched_asr_idx[pi] = pj
        elif kind == "skip-asr":
            skipped_asr.append(pj)
        i, j = pi, pj

    # When the ASR splits one spoken word into two tokens ("Commercial" +
    # "Connect" for "CommercialKonnect"), the script word must own both, or
    # the caption's teal fill would jump mid-name.
    for sj in sorted(skipped_asr):
        owner = max((k for k, aj in matched_asr_idx.items() if aj < sj), default=None)
        if owner is None:
            continue
        ratio = difflib.SequenceMatcher(None, tok_key(asr[sj]["word"]),
                                         tok_key(matched_asr[owner])).ratio()
        if ratio >= 0.6:
            pairs[owner] = (pairs[owner][0], asr[sj]["end"])
            matched_asr_idx[owner] = sj

    # Any script token the ASR missed is interpolated across the silence that
    # surrounds it, which is where the word was actually spoken. If there is
    # no room (the ASR merged the words together), the following word's span
    # is shared so every word still gets its own ordered window.
    times: dict[int, tuple[float, float]] = dict(pairs)
    unmatched = [k for k in range(n) if k not in pairs]
    runs: list[list[int]] = []
    for k in unmatched:
        if runs and k == runs[-1][-1] + 1:
            runs[-1].append(k)
        else:
            runs.append([k])
    idx = sorted(pairs)
    for run in runs:
        prev = max((x for x in idx if x < run[0]), default=None)
        nxt = min((x for x in idx if x > run[-1]), default=None)
        lo = pairs[prev][1] if prev is not None else asr[0]["start"]
        hi = pairs[nxt][0] if nxt is not None else asr[-1]["end"]
        r = len(run)
        if nxt is not None and (hi - lo) < 0.08 * r:
            hi = pairs[nxt][1]
            step = (hi - lo) / (r + 1)
            for i, k in enumerate(run):
                times[k] = (round(lo + i * step, 3), round(lo + (i + 1) * step, 3))
            times[nxt] = (round(lo + r * step, 3), pairs[nxt][1])
        else:
            step = (hi - lo) / r if r else 0.0
            for i, k in enumerate(run):
                times[k] = (round(lo + i * step, 3), round(lo + (i + 1) * step, 3))
    return times, matched_asr


def group_cues(words: list[dict]) -> list[dict]:
    """Split the script into the sibling ad's caption units.

    The sibling's own captions (read off frame-by-frame) follow one rule: split
    the script on sentence-ending punctuation, then cut each sentence into
    consecutive groups of at most MAX_WORDS words. A short trailing group is
    kept as its own caption -- the sibling shows "growing." on its own -- and a
    group holding only a one or two character token is dropped, which is how
    the sibling ends its URL line at "Visit CommercialKonnect dot C".
    """
    sentences: list[list[dict]] = []
    current: list[dict] = []
    for w in words:
        current.append(w)
        if w["word"].endswith((".", "?", "!")):
            sentences.append(current)
            current = []
    if current:
        sentences.append(current)

    cues: list[dict] = []
    for sentence in sentences:
        for i in range(0, len(sentence), MAX_WORDS):
            chunk = sentence[i:i + MAX_WORDS]
            if len(chunk) == 1 and len(chunk[0]["word"]) <= MIN_CHARS:
                # A lone letter or two-character token carries no meaning on
                # screen; the sibling drops these too.
                continue
            text = " ".join(c["word"] for c in chunk)
            if text.endswith(","):
                # A linking comma is not part of the spoken line's meaning.
                text = text[:-1]
            cues.append({
                "start": chunk[0]["start"],
                "end": chunk[-1]["end"],
                "text": text,
                "words": [{"word": c["word"], "start": c["start"], "end": c["end"]} for c in chunk],
            })

    return cues


def text_width(text: str) -> int:
    from PIL import ImageFont

    font = ImageFont.truetype(str(find_font()), FONT_SIZE)
    bbox = font.getmask(text, mode="L").getbbox()
    return 0 if bbox is None else bbox[2] - bbox[0]


def main() -> int:
    data = json.loads(TRANSCRIPT.read_text())
    asr_all = data["word_timestamps"]

    all_cues: list[dict] = []
    for sid, text, w0, w1 in SCENES:
        script = [t for t in text.split() if t]
        inside = [w for w in asr_all if w0 - 0.05 <= w["start"] < w1]
        if not inside:
            print(f"{sid}: no ASR words in window")
            continue
        times, matched = align(script, inside)
        print(f"\n{sid} window {w0:.1f}-{w1:.1f}s script={len(script)} asr={len(inside)}")
        for k, sw in enumerate(script):
            t0, t1 = times[k]
            heard = matched.get(k, "(interpolated)")
            print(f"   {sw:<16} {t0:6.2f}-{t1:6.2f}  heard: {heard}")
        words = [{"word": sw, "start": times[k][0], "end": times[k][1]}
                 for k, sw in enumerate(script)]
        all_cues.extend(group_cues(words))

    for cue in all_cues:
        w = text_width(cue["text"])
        cue["scale"] = round(min(1.0, MAX_TEXT_W / w), 3) if w else 1.0
        print(f"\n[{cue['start']:6.2f}-{cue['end']:6.2f}] {cue['text']}  w={w} scale={cue['scale']}")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({"cues": all_cues}, indent=1))
    print("\nwrote", OUT)
    print("cue count:", len(all_cues))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
