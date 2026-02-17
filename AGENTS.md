# Astro Migration for ScanEasy Landing Page

## Goal
Convert the raw HTML ScanEasy landing page into an Astro project with i18n support.
The site is hosted on GitHub Pages at easyscan.rooki.xyz.

## Requirements

### Structure
```
src/
  i18n/
    en.json          # English translations
    de.json          # German translations
    utils.ts         # i18n helper (getLangFromUrl, useTranslations)
  layouts/
    BaseLayout.astro # Shared HTML shell (head, fonts, meta, glow effects)
  pages/
    index.astro      # Root redirect (browser lang detection → /en or /de)
    [lang]/
      index.astro    # Landing page (uses translations)
      privacy.astro  # Privacy policy (uses translations)
      terms.astro    # Terms of service (uses translations)
  styles/
    global.css       # The existing CSS (copy as-is from reference below)
public/
  icon.png           # App icon (will be copied in)
  favicon.png        # Favicon (will be copied in)
  CNAME              # Contains: easyscan.rooki.xyz
astro.config.mjs     # Astro config with static output
```

### i18n Translation Files
Extract ALL text content from the HTML into en.json and de.json. Structure:

```json
{
  "meta": {
    "title": "ScanEasy — Scan documents. Simply.",
    "description": "ScanEasy is the easiest way to scan documents with your iPhone. Free, private, offline."
  },
  "nav": {
    "langFlag": "🇬🇧",
    "otherLang": "de",
    "otherFlag": "🇩🇪",
    "otherTitle": "Deutsch"
  },
  "hero": {
    "tagline": "Scan documents. Simply."
  },
  "features": {
    "autoDetect": { "icon": "📸", "title": "Auto-Detection", "desc": "Point your camera — ScanEasy detects the document automatically and captures it." },
    "private": { "icon": "🔒", "title": "100% Private", "desc": "No servers, no cloud, no tracking. Everything stays on your iPhone." },
    "fast": { "icon": "⚡", "title": "Lightning Fast", "desc": "Scan, crop, share as PDF — in under 3 seconds." }
  },
  "cta": {
    "button": "Coming to App Store",
    "sub": "Coming soon — free for iPhone"
  },
  "footer": {
    "privacy": "Privacy Policy",
    "terms": "Terms of Service",
    "contact": "Contact",
    "copyright": "© 2026 ScanEasy"
  },
  "privacy": { ... all privacy page sections ... },
  "terms": { ... all terms page sections ... }
}
```

Include ALL text from privacy and terms pages in the translation files too. Every single heading and paragraph.

### Design Rules — CRITICAL
- The design must look EXACTLY like the original. Same CSS, same layout, same animations.
- Copy the existing CSS into src/styles/global.css (keep 100% of it)
- Dark theme, glow effects, Inter font, same feature cards, same footer
- Same mobile responsive behavior (features stack on mobile)
- Same language switcher (flag emojis, top right)

### Technical Requirements
- Astro with static output (`output: 'static'`)
- NO frameworks needed (no React/Svelte/Vue) — pure Astro components
- GitHub Actions workflow for deployment (.github/workflows/deploy.yml)
- Use `@astrojs/sitemap` if easy, otherwise skip
- TypeScript for i18n utils
- `[lang]` dynamic route with `getStaticPaths()` returning `['en', 'de']`

### Root index.astro (redirect page)
Must replicate the current behavior:
- JavaScript browser language detection
- Redirect to /de if German, /en otherwise
- noscript fallback to /en

### GitHub Actions Deploy Workflow
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm install
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

## Reference: Current Content

### English Landing Page Content
- Title: "ScanEasy — Scan documents. Simply."
- Description: "ScanEasy is the easiest way to scan documents with your iPhone. Free, private, offline."
- Tagline: "Scan documents. Simply."
- Features: Auto-Detection, 100% Private, Lightning Fast (with descriptions from original)
- CTA: "Coming to App Store" / "Coming soon — free for iPhone"
- Footer: Privacy Policy, Terms of Service, Contact (easyscan-support@rooki.xyz)

### German Landing Page Content
- Title: "ScanEasy — Dokumente scannen. Einfach."
- Description: "ScanEasy ist die einfachste Art, Dokumente mit deinem iPhone zu scannen. Kostenlos, privat, offline."
- Tagline: "Dokumente scannen. Einfach."
- Features: Auto-Erkennung, 100% Privat, Blitzschnell (with descriptions from original)
- CTA: "Bald im App Store" / "Kommt bald — kostenlos für iPhone"
- Footer: Datenschutz, Nutzungsbedingungen, Kontakt

### Privacy Policy (English)
1. Overview — ScanEasy ("the App") is a document scanner app for iOS. Your privacy matters to us. This privacy policy explains what data we collect and how we handle it.
2. Data Collection — We do not collect any personal data. ScanEasy processes all data exclusively on your device: Camera (used solely for scanning, never transmitted), Photo Library (only reads selected images), Scanned Documents (remain exclusively on device).
3. No Servers, No Cloud — ScanEasy does not operate any servers and does not use any cloud services. All scanning, recognition, and processing features run 100% on your iPhone.
4. Third Parties — The App does not use any third-party analytics, tracking, or advertising services. No data is shared with third parties.
5. Apple Services — When using the App through the App Store, Apple's Privacy Policy also applies. Apple may collect anonymized usage data if consented.
6. Permissions — Camera (required for scanning), Photo Library (optional, for importing). Revocable in iOS Settings.
7. Changes — We may update this privacy policy. Changes published on this page.
8. Contact — easyscan-support@rooki.xyz

### Privacy Policy (German)
1. Überblick — ScanEasy ("die App") ist eine Dokumentenscanner-App für iOS. Deine Privatsphäre ist uns wichtig. Diese Datenschutzerklärung erklärt, welche Daten wir erheben und wie wir damit umgehen.
2. Datenerhebung — Wir erheben keine personenbezogenen Daten. ScanEasy verarbeitet alle Daten ausschließlich auf deinem Gerät: Kamera (ausschließlich zum Scannen, nie an Server übertragen), Fotobibliothek (nur ausgewählte Bilder werden gelesen), Gescannte Dokumente (verbleiben ausschließlich auf deinem Gerät).
3. Keine Server, keine Cloud — ScanEasy betreibt keine Server und nutzt keine Cloud-Dienste. Alle Scan-, Erkennungs- und Verarbeitungsfunktionen laufen zu 100% auf deinem iPhone.
4. Drittanbieter — Die App verwendet keine Analyse-, Tracking- oder Werbedienste von Drittanbietern. Es werden keine Daten an Dritte weitergegeben.
5. Apple-Dienste — Bei Nutzung der App über den App Store gilt zusätzlich Apples Datenschutzrichtlinie. Apple kann anonymisierte Nutzungsdaten erheben, sofern du dem in deinen Geräteeinstellungen zugestimmt hast.
6. Berechtigungen — Kamera (erforderlich zum Scannen), Fotobibliothek (optional, zum Importieren). Jederzeit in den iOS-Einstellungen widerrufbar.
7. Änderungen — Wir können diese Datenschutzerklärung aktualisieren. Änderungen werden auf dieser Seite veröffentlicht.
8. Kontakt — easyscan-support@rooki.xyz

### Terms of Service (English)
1. Acceptance — By using ScanEasy, you agree to these Terms. If you do not agree, do not use the App.
2. Use — Free document scanner for iOS. Personal and commercial use allowed. You are responsible for lawful use.
3. Intellectual Property — App is copyright protected. No copying, modifying, decompiling, or reverse-engineering.
4. Your Content — All scanned documents belong to you. We claim no rights. Data stays local, you handle backups.
5. Availability — We strive to keep App functional but no guarantee. May modify or discontinue at any time.
6. Disclaimer — App "as is." No warranties on completeness, accuracy, or quality. Not a substitute for professional digitization. No liability for indirect damages.
7. Changes — Terms may change. Continued use = acceptance.
8. Governing Law — German law. Jurisdiction: Germany.
9. Contact — easyscan-support@rooki.xyz

### Terms of Service (German)
1. Zustimmung — Durch die Nutzung von ScanEasy stimmst du diesen Nutzungsbedingungen zu. Wenn du nicht zustimmst, nutze die App bitte nicht.
2. Nutzung — Kostenlose Dokumentenscanner-App für iOS. Persönliche und kommerzielle Nutzung erlaubt. Du bist für die rechtmäßige Nutzung gescannter Dokumente verantwortlich.
3. Geistiges Eigentum — Die App ist urheberrechtlich geschützt. Kopieren, Modifizieren, Dekompilieren oder Reverse-Engineering ist nicht gestattet.
4. Deine Inhalte — Alle gescannten Dokumente gehören dir. Wir beanspruchen keine Rechte. Daten bleiben lokal, Backups sind deine Verantwortung.
5. Verfügbarkeit — Wir bemühen uns um Funktionalität, keine Garantie. Können App jederzeit ändern oder einstellen.
6. Haftungsausschluss — App "wie besehen." Keine Gewährleistung für Vollständigkeit, Richtigkeit oder Qualität. Kein Ersatz für professionelle Digitalisierung. Keine Haftung für indirekte Schäden.
7. Änderungen — Bedingungen können sich ändern. Weiternutzung = Zustimmung.
8. Geltendes Recht — Deutsches Recht. Gerichtsstand: Deutschland.
9. Kontakt — easyscan-support@rooki.xyz

### CSS
Copy the ENTIRE CSS from the original. Here it is:

```css
* { margin: 0; padding: 0; box-sizing: border-box; }

:root {
    --accent: #3b82f6;
    --accent-light: #60a5fa;
    --bg: #050505;
    --surface: #0a0a0a;
    --border: #1a1a1a;
    --text: #fafafa;
    --text-secondary: #a3a3a3;
    --text-muted: #525252;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
}

.glow { position: fixed; border-radius: 50%; filter: blur(120px); opacity: 0.15; pointer-events: none; z-index: 0; }
.glow-1 { width: 600px; height: 600px; background: var(--accent); top: -200px; left: 50%; transform: translateX(-50%); animation: float 8s ease-in-out infinite; }
.glow-2 { width: 400px; height: 400px; background: #8b5cf6; bottom: -100px; right: -100px; animation: float 10s ease-in-out infinite reverse; }
@keyframes float { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(30px); } }

.lang-switcher { position: absolute; top: 20px; right: 24px; display: flex; gap: 4px; align-items: center; font-size: 22px; }
.lang-switcher a { text-decoration: none; padding: 4px 6px; border-radius: 8px; transition: background 0.2s, transform 0.2s; opacity: 0.45; }
.lang-switcher a:hover { background: rgba(255,255,255,0.06); opacity: 0.8; transform: scale(1.1); }
.lang-active { padding: 4px 6px; border-radius: 8px; background: rgba(255,255,255,0.06); }

.page { position: relative; z-index: 1; max-width: 720px; margin: 0 auto; padding: 0 24px; display: flex; flex-direction: column; align-items: center; min-height: 100vh; }

.hero { text-align: center; padding-top: clamp(80px, 15vh, 140px); margin-bottom: 64px; }
.app-icon { display: inline-flex; margin-bottom: 28px; animation: fadeInUp 0.8s ease; }
.app-icon-img { width: 96px; height: 96px; border-radius: 22px; box-shadow: 0 0 0 1px rgba(255,255,255,0.08), 0 20px 40px -12px rgba(59, 130, 246, 0.35); }
h1 { font-size: clamp(40px, 8vw, 56px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 12px; animation: fadeInUp 0.8s ease 0.1s both; }
.gradient-text { background: linear-gradient(135deg, var(--accent-light), #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.tagline { font-size: clamp(18px, 3vw, 22px); color: var(--text-secondary); font-weight: 400; letter-spacing: -0.01em; animation: fadeInUp 0.8s ease 0.2s both; }

.features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; width: 100%; margin-bottom: 64px; animation: fadeInUp 0.8s ease 0.3s both; }
.feature { padding: 28px 20px; border-radius: 16px; background: var(--surface); border: 1px solid var(--border); text-align: center; transition: border-color 0.3s, transform 0.3s; }
.feature:hover { border-color: #2a2a2a; transform: translateY(-2px); }
.feature-icon { font-size: 28px; margin-bottom: 14px; }
.feature h3 { font-size: 15px; font-weight: 600; margin-bottom: 8px; letter-spacing: -0.01em; }
.feature p { font-size: 13px; line-height: 1.6; color: var(--text-muted); }

.cta { text-align: center; margin-bottom: 80px; animation: fadeInUp 0.8s ease 0.4s both; }
.cta-button { display: inline-flex; align-items: center; gap: 10px; padding: 14px 32px; border-radius: 14px; background: var(--text); color: var(--bg); text-decoration: none; font-size: 16px; font-weight: 600; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 16px rgba(255,255,255,0.1); }
.cta-button:not(.disabled):hover { transform: scale(1.03); box-shadow: 0 8px 24px rgba(255,255,255,0.15); }
.cta-button:not(.disabled):active { transform: scale(0.98); }
.cta-button.disabled { background: #262626; color: var(--text-muted); cursor: default; box-shadow: none; pointer-events: none; }
.cta-sub { margin-top: 12px; font-size: 14px; color: var(--text-muted); }

footer { margin-top: auto; padding: 32px 0; text-align: center; width: 100%; border-top: 1px solid var(--border); }
.footer-links { display: flex; align-items: center; justify-content: center; gap: 24px; margin-bottom: 16px; flex-wrap: wrap; }
.footer-links a { color: var(--text-muted); text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; }
.footer-links a:hover { color: var(--text-secondary); }
.copyright { font-size: 13px; color: #333; }

@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 640px) {
    .features { grid-template-columns: 1fr; gap: 12px; }
    .feature { display: flex; align-items: center; text-align: left; padding: 20px; gap: 16px; }
    .feature-icon { font-size: 24px; margin-bottom: 0; flex-shrink: 0; }
    .feature h3 { margin-bottom: 4px; }
    .glow-1 { width: 300px; height: 300px; }
    .glow-2 { width: 200px; height: 200px; }
}

.legal { max-width: 720px; width: 100%; margin: 0 auto; padding: 48px 24px 80px; position: relative; z-index: 1; }
.legal .back { display: inline-flex; align-items: center; gap: 6px; color: var(--text-muted); text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; }
.legal .back:hover { color: var(--text); }
.legal h1 { font-size: 28px; font-weight: 700; text-align: left; margin-bottom: 8px; letter-spacing: -0.02em; animation: none; }
.legal .date { font-size: 14px; color: var(--text-muted); margin-bottom: 40px; }
.legal h2 { font-size: 17px; font-weight: 600; margin-top: 36px; margin-bottom: 12px; color: var(--text); letter-spacing: -0.01em; }
.legal p, .legal li { font-size: 15px; line-height: 1.75; color: var(--text-secondary); margin-bottom: 12px; }
.legal ul { padding-left: 20px; margin-bottom: 12px; }
.legal li { margin-bottom: 6px; }
.legal a { color: var(--accent-light); text-decoration: none; transition: color 0.2s; }
.legal a:hover { text-decoration: underline; }
.legal strong { color: var(--text); }
```

## Steps
1. Run `npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict` to scaffold
2. Install dependencies: `npm install`
3. Create the file structure as described above
4. Copy ALL content from reference into translation JSON files
5. Build layouts and pages using Astro components
6. Copy static assets (icon.png, favicon.png) from /tmp/easyscan-pages/
7. Create CNAME file in public/
8. Create GitHub Actions workflow
9. Run `npm run build` and verify it works
10. Commit everything

## CRITICAL
- The output MUST be pixel-perfect identical to the original HTML
- ALL translation strings must be in JSON files, NO hardcoded text in templates (except "ScanEasy" brand name)
- The Apple SVG icon in the CTA button must be preserved exactly
- privacy and terms pages must include ALL paragraphs and list items from the original
- Last updated date: February 17, 2026

When completely finished, run this command to notify me:
openclaw system event --text "Done: Astro migration for easyscan-pages complete. All pages, i18n, CSS, and GitHub Actions workflow created." --mode now
