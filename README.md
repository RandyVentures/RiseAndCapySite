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
screenshot-*.jpg      real app screenshots (welcome, personality picker, paywall)
```

Plain HTML/CSS, no build step, no framework — same convention as the other Randy Ventures app sites (GulpSite, FamilyStopSite, etc).

## Editing

Just edit the HTML files directly and push to `main` — GitHub Pages redeploys automatically within a minute or two. There's no local dev server needed; open `index.html` directly in a browser to preview, or run a quick static server (e.g. `python3 -m http.server`) so relative links and anchors behave exactly as they will live.

## Before this app is live

- The download/App Store links point to `apps.apple.com/app/id6804264261`. This 404s until Apple approves the first submitted version — see the main app repo's README for current submission status.
- Update `sitemap.xml`'s `<lastmod>` dates and the "Last updated" text in privacy/terms/faq whenever their content changes.
- Regenerate the icon assets from `RiseAndCapy/Resources/Assets.xcassets/AppIcon.appiconset/icon-1024.png` if the app icon changes.
