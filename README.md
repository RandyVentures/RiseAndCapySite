# Rise & Capy — marketing site

Static marketing/support site for [Rise & Capy](https://github.com/RandyVentures/RiseAndCapy), live at [randyventures.github.io/RiseAndCapySite](https://randyventures.github.io/RiseAndCapySite/).

GitHub Pages is configured as **Deploy from a branch** (`main`, `/root`) in repo settings — GitHub rebuilds it automatically on every push, no workflow file needed. `.nojekyll` disables Jekyll processing so the `privacy/`, `terms/`, and `faq/` folders serve as-is.

## Structure

```
index.html        Home page
privacy/index.html   Privacy Policy
terms/index.html     Terms of Use
faq/index.html       FAQ
sitemap.xml
icon.png, apple-touch-icon.png, favicon-32.png, favicon-64.png   generated from the app's real icon
screenshot-*.jpg      real app screenshots (welcome, personality picker, Free vs Pro)
```

Plain HTML/CSS, no build step, no framework — same convention as the other Randy Ventures app sites (GulpSite, FamilyStopSite, etc).

## Editing

Just edit the HTML files directly and push to `main` — GitHub Pages redeploys automatically within a minute or two. There's no local dev server needed; open `index.html` directly in a browser to preview, or run a quick static server (e.g. `python3 -m http.server`) so relative links and anchors behave exactly as they will live.

## The reel

The hero is a 35-second motion reel built live in the page, not a video file: an SVG scene driven by one GSAP timeline
(`reel/reel.js`), scrubbed every frame from the soundtrack's clock when sound is on and a wall clock when it's muted.
It autoplays silently with kinetic captions; the visitor's first tap anywhere on the page turns the sound on
(browsers block unmuted autoplay until then).

```
reel/reel.js        the reel: scenes, timing, player controls
reel/capy.js        Capy as a rigged SVG, a 1:1 port of the app's CapybaraMascotView.swift (shared with the page)
reel/reel.mp3       the mixed soundtrack
reel/voices/        Capy's English wake-up lines, copied from the app (personality picker)
reel/sfx/           small sounds for the "wake Capy up" toy
reel/gsap.min.js    GSAP 3.12.5, vendored
reel/tools/         make_audio.py (ElevenLabs voice/SFX/music + cuts from the app's own audio) and mix_audio.py
```

Cue times live in both `reel/tools/mix_audio.py` and `reel/reel.js`; change them together. To rebuild the audio:
`source ~/.zshrc && python3 reel/tools/make_audio.py && python3 reel/tools/mix_audio.py` (needs `ELEVENLABS_API_KEY`,
ffmpeg, and the app repo at `~/Developer/Src/Repos/RiseAndCapy` for the alarm tone and voice lines).
`og.png` is a still of the reel's end card.

When you change `reel/*.js`, bump the `?v=` on its `<script>` tag in `index.html` so browsers don't serve a stale copy.

## Keeping it in sync with the app

- Pricing (app 1.3+): free plan with one alarm, every Capy, voice and sound, and the Tap mission. Capy Pro is the existing one-time $9.99 non-consumable: unlimited alarms plus the pattern, shake, and question missions. Earlier buyers have Pro. The reel's voiceover still says "Pay once. No subscription. No account." (true of Pro), so its visuals read "Free" with a "Pay once for Pro" chip.
- Personality copy, colors, badge glyphs, and the spoken lines come from `CapyPersonality.swift`,
  `CapyPersonalityBadge.swift`, and `Resources/Audio/voice_en_*.m4a` in the app repo.
- Update `sitemap.xml`'s `<lastmod>` dates and the "Last updated" text in privacy/terms/faq whenever their content changes.
- Regenerate the icon assets from `RiseAndCapy/Resources/Assets.xcassets/AppIcon.appiconset/icon-1024.png` if the app icon changes.
