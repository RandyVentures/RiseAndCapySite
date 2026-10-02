"""Generate the reel's raw audio stems with ElevenLabs (voice, SFX, music).

usage: source ~/.zshrc && python3 reel/tools/make_audio.py [--only vo|sfx|music|app]
Writes stems to reel/tools/stems/ (gitignored); mix_audio.py turns them into reel/reel.mp3.
"""
import json, os, sys, urllib.request, pathlib

KEY = os.environ["ELEVENLABS_API_KEY"]
OUT = pathlib.Path(__file__).parent / "stems"
OUT.mkdir(exist_ok=True)
API = "https://api.elevenlabs.io/v1"
VOICE = "cgSgspJ2msm6clMCkdW9"  # Jessica: playful, bright, warm

VO = {
    "vo1": ("Mornings... are hard.", 0.62, 0.9),
    "vo2": ("But what if your alarm actually cared?", 0.5, 1.0),
    "vo3": ("Meet Rise and Capy!", 0.4, 1.0),
    "vo4": ("Real alarms that ring through Silent mode.", 0.5, 1.05),
    "vo5": ("And playful missions that actually get you up.", 0.5, 1.05),
    "vo6": ("Four capybaras. Four totally different mornings.", 0.5, 1.0),
    "vo7": ("Pay once. No subscription. No account.", 0.5, 1.0),
    "vo8": ("Rise and Capy. Now on the App Store.", 0.45, 0.98),
}

SFX = {
    "snore": ("tiny cute cartoon animal snoring softly, two gentle snores", 2.5),
    "alarm": ("cheerful cute digital alarm clock beeping, bright bouncy melody, cartoon", 2.6),
    "yawn": ("small cute cartoon creature big stretchy yawn", 1.6),
    "whoosh": ("soft airy swoosh transition", 0.8),
    "pop": ("single bubbly cartoon pop", 0.5),
    "boing": ("cartoon spring boing, cute and short", 0.8),
    "sparkle": ("magical sparkle chime shimmer, bright", 1.5),
    "ding": ("cheerful bright bell ding, single", 1.0),
    "tap": ("soft plastic button tap click", 0.5),
}

MUSIC_PROMPT = (
    "Cozy, playful instrumental morning theme. Starts very soft and dreamy with music box and warm pads for the first 6 seconds, "
    "then a bright, bouncy groove kicks in: ukulele, pizzicato strings, glockenspiel, light claps and soft kick, 100 bpm, major key, "
    "sunny and charming like a cute animated short. Ends with a satisfying button on the final note. No vocals."
)


def post(path, body):
    req = urllib.request.Request(f"{API}{path}", data=json.dumps(body).encode(),
                                 headers={"xi-api-key": KEY, "Content-Type": "application/json"})
    return urllib.request.urlopen(req, timeout=300).read()


def vo():
    for name, (text, stability, speed) in VO.items():
        audio = post(f"/text-to-speech/{VOICE}?output_format=mp3_44100_192",
                     {"text": text, "model_id": "eleven_multilingual_v2",
                      "voice_settings": {"stability": stability, "similarity_boost": 0.8, "style": 0.4,
                                         "use_speaker_boost": True, "speed": speed}})
        (OUT / f"{name}.mp3").write_bytes(audio)
        print("vo", name)


def sfx():
    for name, (text, dur) in SFX.items():
        audio = post("/sound-generation", {"text": text, "duration_seconds": dur, "prompt_influence": 0.5})
        (OUT / f"sfx_{name}.mp3").write_bytes(audio)
        print("sfx", name)


def music():
    audio = post("/music?output_format=mp3_44100_192",
                 {"prompt": MUSIC_PROMPT, "music_length_ms": 35000, "force_instrumental": True})
    (OUT / "music.mp3").write_bytes(audio)
    print("music")


# Sounds lifted from the app itself, so the reel sounds like the product.
APP_AUDIO = pathlib.Path.home() / "Developer/Src/Repos/RiseAndCapy/RiseAndCapy/Resources/Audio"
APP_CUTS = {  # stem -> (source, start, duration): Soft Sunrise is the app's default alarm tone
    "tone": ("soft_sunrise.wav", 2.0, 2.5),
    "capy_sleepy": ("voice_en_sleepy.m4a", 0.0, 1.75),   # "Mmm... good morning."
    "capy_sunny": ("voice_en_sunny.m4a", 0.0, 1.3),      # "Good morning, sunshine!"
    "capy_chill": ("voice_en_chill.m4a", 0.0, 1.5),      # "Hey. Morning."
    "capy_motivated": ("voice_en_motivated.m4a", 0.0, 1.4),  # "RISE AND SHINE!"
}


def app():
    import subprocess
    for name, (src, start, dur) in APP_CUTS.items():
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", str(start), "-t", str(dur), "-i", str(APP_AUDIO / src),
                        "-af", f"afade=t=in:d=0.03,afade=t=out:st={dur - 0.12}:d=0.12", "-ar", "44100", "-ac", "2",
                        "-b:a", "192k", str(OUT / f"{name}.mp3")], check=True)
        print("app", name)
    # The narrator only says "Four capybaras." now; the capys speak for themselves.
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-t", "1.3", "-i", str(OUT / "vo6.mp3"),
                    "-af", "afade=t=out:st=1.18:d=0.12", str(OUT / "vo6a.mp3")], check=True)


only = sys.argv[sys.argv.index("--only") + 1] if "--only" in sys.argv else None
for step in (vo, sfx, music, app):
    if only in (None, step.__name__):
        step()
