"""Mix the ElevenLabs stems into reel/reel.mp3, the soundtrack the site reel plays.

usage: python3 reel/tools/mix_audio.py
Cue times are in seconds on the reel's master clock; reel.js keys its timeline to the same numbers.
"""
import pathlib, subprocess

HERE = pathlib.Path(__file__).parent
STEMS = HERE / "stems"
OUT = HERE.parent / "reel.mp3"
LENGTH = 35.0

# (stem, start seconds, gain)
CUES = [
    ("sfx_snore", 0.3, 0.55),
    ("vo1", 0.9, 1.0),
    ("tone", 2.85, 0.75),  # the app's default alarm, Soft Sunrise
    ("vo2", 3.35, 1.0),
    ("sfx_whoosh", 5.25, 0.6),
    ("sfx_yawn", 5.6, 0.55),
    ("vo3", 6.55, 1.0),
    ("sfx_sparkle", 6.6, 0.45),
    ("sfx_whoosh", 8.45, 0.5),
    ("vo4", 8.7, 1.0),
    ("sfx_ding", 9.6, 0.35),
    ("sfx_whoosh", 11.0, 0.45),
    ("vo5", 11.3, 1.0),
    ("sfx_tap", 11.55, 0.6), ("sfx_tap", 11.8, 0.6),
    ("sfx_pop", 12.55, 0.5),
    ("sfx_boing", 13.4, 0.45),
    ("sfx_ding", 14.3, 0.35),
    ("sfx_whoosh", 15.05, 0.5),
    ("vo6a", 15.3, 1.0),
    ("sfx_pop", 15.45, 0.5), ("sfx_pop", 15.7, 0.5), ("sfx_pop", 15.95, 0.5), ("sfx_pop", 16.2, 0.5),
    # each capy says her line in her app voice
    ("capy_sleepy", 16.75, 1.0), ("capy_sunny", 18.6, 1.0), ("capy_chill", 20.0, 1.0), ("capy_motivated", 21.6, 1.0),
    ("sfx_boing", 16.75, 0.3), ("sfx_boing", 18.6, 0.3), ("sfx_boing", 20.0, 0.3), ("sfx_boing", 21.6, 0.3),
    ("sfx_whoosh", 23.1, 0.5),
    ("vo7", 23.4, 1.0),
    ("sfx_ding", 23.4, 0.45),
    ("sfx_tap", 24.27, 0.6),
    ("sfx_tap", 25.25, 0.6),
    ("sfx_whoosh", 27.1, 0.55),
    ("vo8", 27.5, 1.0),
    ("sfx_sparkle", 27.55, 0.45),
    ("sfx_pop", 28.85, 0.5),
]
NIGHT_END = 5.25  # music is muffled + quieter until the sunrise

inputs = ["-i", str(STEMS / "music.mp3")]
for stem, *_ in CUES:
    inputs += ["-i", str(STEMS / f"{stem}.mp3")]

parts = [f"[0:a]lowpass=f=700:enable='lt(t,{NIGHT_END})',volume=0.45:enable='lt(t,{NIGHT_END})',"
         f"volume=0.55,afade=t=out:st={LENGTH - 2.2}:d=2.2[music]"]
vo_labels, fx_labels = [], []
for i, (stem, start, gain) in enumerate(CUES, start=1):
    ms = int(start * 1000)
    label = f"c{i}"
    parts.append(f"[{i}:a]volume={gain},adelay={ms}|{ms},apad=whole_dur={LENGTH}[{label}]")
    (vo_labels if stem.startswith(("vo", "capy_")) else fx_labels).append(f"[{label}]")
parts.append("".join(vo_labels) + f"amix=inputs={len(vo_labels)}:normalize=0,asplit=2[vo][vokey]")
parts.append("".join(fx_labels) + f"amix=inputs={len(fx_labels)}:normalize=0[fx]")
parts.append("[music][vokey]sidechaincompress=threshold=0.04:ratio=6:attack=15:release=350[ducked]")
parts.append(f"[ducked][vo][fx]amix=inputs=3:normalize=0,atrim=0:{LENGTH},"
             "loudnorm=I=-16:TP=-1.5:LRA=11[out]")

subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", *inputs,
                "-filter_complex", ";".join(parts), "-map", "[out]",
                "-ar", "44100", "-ac", "2", "-b:a", "128k", str(OUT)], check=True)
print("wrote", OUT)
