# SynthArt Synergy 2.0 — Committee Registration Site

Front-end for the SynthArt Synergy 2.0 committee registration. Static HTML, CSS and
JavaScript — no build step, no frameworks, no CDN, no external fonts. Open
`index.html` in a browser and it runs.

---

## 1. Files

| File | Purpose |
|---|---|
| `index.html` | All page content and structure |
| `styles.css` | Design system, hero artwork animation, layout, responsive rules |
| `main.js` | Config, Google Form wiring, countdown, 3D tilt, particles, nav |
| `assets/` | Logo mark, favicon, original hero frames and clean animation layers |
| `google-form/` | The committee application form — one-click builder script and its question blueprint |
| `README.md` | This file |

### The images

| Asset | Source | Notes |
|---|---|---|
| `assets/logo-mark.png` | `logo.jpeg` | Badge cropped to its circle, transparent corners, 160 px |
| `assets/sliit-kandy-uni.png` | `Kandy UNI New Horizontal Logo (1).png` | Unchanged replacement university logo, 3272 × 694 |
| `assets/favicon.png` · `assets/apple-touch-icon.png` | `logo.jpeg` | 64 px and 180 px circle crops |
| `assets/hero-before.png` | `beofre.png` | Unchanged original opening frame, 1672 × 941 |
| `assets/hero-after.png` | `after .png` | Unchanged original final frame; also supplies the brush through an SVG clip path |
| `assets/hero-clean-v2.png` | `beofre.png` | Brush removed and underlying hand/background restored for the lift |
| `assets/hero-after-clean-v2.png` | `after .png` | Brush removed while preserving the robot's receiving pose |
| `assets/hero-imagegen-notes.txt` | Built-in imagegen edits | Exact prompts for the two clean layers |

Both supplied originals remain untouched. Only the intermediate clean layers were
edited with imagegen. The older `hero-art` and `brush` assets are no longer used.

---

## 2. Preview it

Double-click `index.html`, or serve the folder:

```powershell
# from this folder
python -m http.server 8000
# then open http://localhost:8000
```

Serving over http (instead of opening the file) is recommended once the site is
published — the "Copy link" button needs a secure context on some browsers.

---

## 3. Google Form connection  ✅ connected

The live application form is wired in — no edit needed unless you replace the form:

```js
const CONFIG = {
  formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeXDl7JTlyifhb_qUkqalZRvsX4BrKHYCaIFA72lyd9ogQ0PA/viewform',
  ...
};
```

Every "Register", "Open the application form", "Register now" and the footer link
opens the form in a new tab, and the status pill under the registration panel reads
**Open**.

**To point the site at a different form**, replace `formUrl` with the new
`https://docs.google.com/forms/d/e/…/viewform` link and reload. If the link is still
the placeholder, buttons show a friendly notice instead of a dead link, so the page is
always safe to share.

**Prefer the form inside the page?** Set:

```js
embedForm: true,
```

The iframe is generated automatically from the same link (no separate embed code).

### Suggested form fields

The page tells applicants to have these ready, so keep the form in step:

- Full name · Student ID · Faculty · Year & semester (Orientation / 1Y·1S / 1Y·2S)
- Email · Mobile number
- Primary committee choice (one of the seven)
- Secondary committee choice
- Portfolio link (optional)
- "What would you build with the committee?" — long answer, ~150 words
- Confirmation checkbox for the commitment

---

## 4. Edit the event details

Everything date-, venue- and deadline-related lives in the same `CONFIG` block:

```js
deadlineISO: '2026-10-29T23:59:59+05:30', // end of deadline day, Sri Lanka time
venue: 'SLIIT Kandy UNI, Pallekele',
deadline: '29 October 2026'
```

`deadlineISO` drives the registration countdown. `deadline` supplies the displayed
closing date in the countdown strip, registration panel and closing section.
The countdown reaches zero at the end of 29 October 2026 in Sri Lanka time, then
shows “Registration closed”. No exhibition dates are displayed.

---

## 5. Customise the look

On each page load, an **8-second opening intro** shows the original SLIIT Kandy
UNI logo, then “presents”, the SynthArt badge with orange/cyan orbits, and
“SynthArt 2.0” with “Where art meets technology” underneath. It fades out to the home page. **Skip intro** or Escape opens the
page immediately. The home reveal and brush handoff wait until the intro ends.
The intro background combines softly lit circuit paths, moving signals, flowing
paint strokes and drifting specks, drawn with SVG and CSS around the branding.
Reduced motion shows the complete branding without movement for the same duration.
Without JavaScript the home page opens directly; a 10-second fallback also unlocks
the page if the main script fails. Intro timing is in `openingIntro()` in `main.js`
and the opening-sequence rules in `styles.css`.

Colours are CSS custom properties at the top of `styles.css`:

```css
--orange: #EC9642;   /* SynthArt 1.0 brand orange */
--cyan:   #54C8E8;   /* technology accent        */
--violet: #8B7BF7;
--navy-950: #050B16; /* page base                */
```

The hero uses an SVG stage with the same **1672 × 941** coordinate system as the
supplied images. The `heroHandoff()` controller in `main.js` runs a **5.2-second**
sequence using the Web Animations API:

1. Hold the original before image for about one second.
2. Lift the isolated brush up from the artist's hand.
3. Carry it across an upward arc as the hands blend to the receiving pose.
4. Settle into the robot hand with a brief glow, then reveal the original after image.

The final pose stays on screen. **Replay handoff** runs the sequence again.
All layers decode before playback starts, and playback pauses when the artwork is
offscreen or the browser tab is hidden. The before image remains visible if an
animation layer fails to load, JavaScript is unavailable, or reduced motion is enabled.
Reduced-motion changes are also respected while the page is open.

`.art` still leans toward the pointer; the surrounding rings and grid remain in place.
The brush clip path lives in `index.html`, and its lift/landing coordinates and timing
live in `heroHandoff()`. Update both if replacing the illustration with different poses.
The shared SVG viewBox keeps the handoff aligned on desktop and mobile.

---

## 6. Publish

Any static host works — upload the folder and point it at `index.html`:

- **GitHub Pages** — push the folder, Settings → Pages → deploy from branch.
- **Netlify / Vercel** — drag the folder in, no build command.
- **Faculty server** — copy `index.html`, `styles.css`, `main.js` to the web root.

No relative paths are absolute, so it works from a subdirectory too.

---

## 7. Content sources

Page copy is written from the SynthArt 1.0 planning set in this folder: the
overview document (concept, goals, audience), the committee list (structure and
seats) and the event plan (the seven committees and their responsibilities).
