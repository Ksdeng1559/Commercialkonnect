# BLOC ad caption pipeline

Generates and verifies the burned-in captions for
`Videos/BLOC` (the "CommercialKonnect.ca — BC Business Funding 30s Ad").

The captions in `Videos/BLOC/src/captions.data.ts` are **generated, not
hand-edited**. To change the on-screen text, edit the six `voice:` fields in
`Videos/BLOC/src/video.tsx` and re-run the pipeline.

## Why the pipeline exists

Speech-to-text mishears this ad's copy. It transcribes "two million dollars"
as "$2 million" and splits the brand into "Commercial Connect". A caption
built directly from ASR output would therefore change the commercial claim
and the brand name in a legally sensitive ad.

So the two sources are kept separate:

- **Text comes from the script** — the six `voice:` fields in `src/video.tsx`.
- **Timing comes from ASR** — OpenMontage's `faster-whisper` transcript of the
  narration master, giving word-level start/end times.

The generator aligns the two with a fuzzy, order-preserving match, so an ASR
token that does not match a script word is discarded rather than allowed to
rewrite the copy. Unmatched script words are interpolated between their
neighbours, and one script word may own several split ASR tokens (this is
what keeps "CommercialKonnect" intact).

`verify_against_source.py` then re-reads `src/video.tsx` and compares the
result word for word, so a drift between script and captions fails loudly
instead of shipping.

## Running it

```
export BLOC_WORK_DIR=/path/to/remotion-build-tree
cd scripts/bloc-ad
python3 gen_captions.py     # script text + ASR timing -> captions.base.json
python3 sync_captions.py    # acoustic-onset alignment -> captions.json + captions.data.ts
```

`BLOC_WORK_DIR` is the Remotion build tree. It holds the generated assets and
the narration master:

```
public/audio/vo_master.wav                        30s narration master
public/audio/transcript/vo_master_transcript.json ASR word timings
public/captions/captions.base.json                generator output
public/captions/captions.json                     synchronized output
```

If `BLOC_WORK_DIR` is unset the scripts fall back to `Videos/BLOC` itself, so
the pipeline also runs in-place in a checkout that already carries those
assets.

### Output

`sync_captions.py` writes `Videos/BLOC/src/captions.data.ts`, which
`src/captions.tsx` imports and renders.

## Why the timings are re-synced

ASR word timestamps can lead the actual sound: the recogniser's first word
boundary often lands slightly before the physical onset of speech. Captioning
from those raw timestamps puts the teal fill ahead of the voice.

`sync_captions.py` therefore measures the true acoustic onset of each scene
directly from the narration master and shifts that scene's captions by the
difference. Onset is measured from the narration only, never from the mixed
track, so background music cannot trigger a caption.

Two details that matter and are easy to get wrong:

- Samples are normalised to `1/32768` before the RMS is computed. Applying a
  float threshold to raw `int16` values finds no speech at all.
- A stereo buffer must be downmixed by stepping over *sample items*, not
  frames. Stepping by frame count analyses only the left channel and halves
  the apparent duration.

## Verifying

```
python3 verify_against_source.py      # captions == the six source voice lines
python3 verify_audio_caption_sync.py  # captions land on speech, in the final MP4
```

`verify_against_source.py` checks that the caption text matches the script
exactly, that "two million dollars" and "CommercialKonnect" survive verbatim,
that no "$2" shorthand appears, and that the single dropped URL token is the
one the sibling ad also drops.

`verify_audio_caption_sync.py` measures the speech energy in the delivered
MP4 and asserts that every caption cue begins on speech, that all six scenes
carry narration, and that the last caption finishes inside the ad.

## Style

The captions copy the sibling ad's house style, measured from
`Videos/CommercialKonnect.ca — Explore Financing Options_1080p_caption.mp4`:

| Property | Value |
|---|---|
| Font | Arial Bold 50px |
| Text | `#102943` |
| Highlight | `#15B5A4` |
| Band | white, 98px tall, 12px side padding |
| Fill | cumulative — a spoken word stays teal |
| Length | up to 4 words per line |
| Band position | bottom-anchored, above BLOC's own footer |

The band is blank during the natural pauses between captions. That is the
sibling's behaviour too: its own geometry sampler skipped exactly those
frames.

## Note on the trailing "A"

The final caption ends "Visit CommercialKonnect dot C". The sibling ad does
the same, but the narration says the full "C A". This is a single
deliberate, asserted exception in `verify_against_source.py` — not an
accident. If the published caption should carry the "A", change it in
`gen_captions.py` and update the expected drop in `verify_against_source.py`.

## Requirements

- `pillow` (for the text-width check and the pixel measurements)
- `ffmpeg` / `ffprobe` (for the audio and frame measurements)
- Arial Bold installed, or its path added to `FONT_CANDIDATES` in
  `gen_captions.py`
