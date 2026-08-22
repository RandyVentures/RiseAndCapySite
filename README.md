# Rise & Capy — marketing site

Static marketing/support site for [Rise & Capy](https://github.com/RandyVentures/RiseAndCapy), deployed to GitHub Pages via GitHub Actions.

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

Just edit the HTML files directly and push to `main` — `.github/workflows/pages.yml` deploys automatically. There's no local dev server needed; open `index.html` directly in a browser to preview.

## Before this app is live

- The download/App Store links point to `apps.apple.com/app/id6804264261`. This 404s until Apple approves the first submitted version — see the main app repo's README for current submission status.
- Update `sitemap.xml`'s `<lastmod>` dates and the "Last updated" text in privacy/terms/faq whenever their content changes.
- Regenerate the icon assets from `RiseAndCapy/Resources/Assets.xcassets/AppIcon.appiconset/icon-1024.png` if the app icon changes.
