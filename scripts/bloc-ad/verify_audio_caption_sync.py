"""Final gate: narration and captions must agree in the delivered MP4.

This checks the encoded file itself, not the intermediate WAV, so it catches
anything the mux or the encode could have shifted. Speech energy is measured
per 100 ms window and compared against the caption cue start times: each cue
must begin at or just after the speech it belongs to, and the last cue must
finish before the ad ends.

It also asserts the six scene windows each contain speech, so a silent or
dropped scene cannot pass.
"""
import json
import os
import subprocess
import sys
import wave
from array import array
from pathlib import Path

REPO = Path(__file__).resolve().parents[2] / "Videos" / "BLOC"
WORK = Path(os.environ.get("BLOC_WORK_DIR", REPO))
MP4 = REPO / "out/bc-business-funding.mp4"
CAPS = WORK / "public/captions/captions.json"

SCENE_FRAMES = {1: (0, 120), 2: (120, 150), 3: (270, 150),
                4: (420, 180), 5: (600, 150), 6: (750, 150)}
FPS = 30

ok = True

# Decode the delivered master's audio to 16 kHz mono PCM and measure RMS in
# 100 ms windows.
raw = subprocess.run(
    ["ffmpeg", "-v", "error", "-i", str(MP4), "-map", "0:a:0",
     "-ac", "1", "-ar", "16000", "-f", "s16le", "-"],
    capture_output=True, check=True).stdout

samples = array("h")
samples.frombytes(raw)
sr = 16000
win = sr // 10
rms = []
for i in range(0, len(samples) - win, win):
    chunk = samples[i:i + win]
    mean = sum(chunk) / len(chunk)
    var = sum((s - mean) ** 2 for s in chunk) / len(chunk)
    rms.append((var ** 0.5) / 32768.0)

floor = 0.02
speech = [r > floor for r in rms]
print(f"audio: {len(rms)} x 100 ms windows over {len(samples)/sr:.2f}s, "
      f"peak RMS {max(rms):.3f}, floor {floor}")

print("\n-- speech present in every scene window --")
for scene, (start, dur) in SCENE_FRAMES.items():
    t0, t1 = start / FPS, (start + dur) / FPS
    w0, w1 = int(t0 * 10), int(t1 * 10)
    seg = speech[w0:w1]
    voiced = sum(seg)
    print(f"  scene {scene}: {t0:>5.2f}-{t1:>5.2f}s  voiced {voiced}/{len(seg)} windows")
    if voiced < 3:
        ok = False
        print(f"FAIL  scene {scene} has no narration")

cues = json.loads(CAPS.read_text())["cues"]
print("\n-- caption cue starts vs speech onsets --")
for cue in cues:
    start = cue["start"]
    wi = min(int(start * 10), len(speech) - 1)
    # The speech for this cue should already be underway, or begin within a
    # couple of windows. Captions that lead the voice by a wide margin are a
    # sync defect.
    ahead = 0
    for k in range(wi, min(wi + 12, len(speech))):
        if speech[k]:
            break
        ahead += 1
    lead = ahead * 0.1
    flag = ""
    if lead > 0.3:
        flag = "  <-- caption leads the voice"
        ok = False
    print(f"  {start:>6.2f}s  {cue['text'][:44]:<44} lead {lead:.1f}s{flag}")

last = cues[-1]
print(f"\nlast cue ends at {last['end']:.2f}s of a 30.00s ad")
if last["end"] > 30.0:
    ok = False
    print("FAIL  last caption runs past the end of the ad")
else:
    print("OK  last caption finishes inside the ad")

print("\nRESULT:", "PASS" if ok else "FAIL")
sys.exit(0 if ok else 1)
