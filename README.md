# 🗺️ MapFilter Pro

> **Find businesses on Google Maps that actually need your help.**  
> Filter by no website, no reviews, no phone — and cold-call them before anyone else does.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-8b5cf6?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)

---

## what is this?

MapFilter Pro is a Chrome extension that injects a side panel into Google Maps. You type a business type and a location, hit scan, and it crawls through the results — collecting names, phone numbers, websites, and review counts for every listing it finds.

Then you filter. Want only businesses with no website? One click. Only the ones with a phone but zero reviews? Done. Export the whole list as a CSV and you've got a cold-call sheet ready to go.

Built for freelancers who sell websites to local businesses. Find the ones that clearly need you.

---

## features

- **Area Scanner** — searches multiple grid zones around your target location based on radius
- **Smart Filters** — filter by no website, has website, social media only, no reviews, few reviews, has/no phone, incomplete profile, no photos
- **Hot Gigs** — one-click preset that finds businesses with no website + has phone + few reviews (the sweet spot)
- **Quick Chips** — All Results / No Website / No Reviews / Weak Online / Hot Leads shortcuts
- **Save Leads** — save individual businesses to a Notes tab with custom text notes
- **Export CSV** — export your filtered results or saved notes as a spreadsheet
- **Draggable Panel** — drag the panel anywhere on the Maps page
- **Minimise / Close** — hide or minimise without losing your scan data
- **Persistent Storage** — last scan and saved notes survive browser restarts

---

## how to install (on your own PC)

This extension isn't on the Chrome Web Store — you load it directly from the folder. Takes about 30 seconds.

**Step 1 — Download the code**

Either clone the repo or download it as a ZIP and extract it somewhere you'll remember.

```bash
git clone https://github.com/yourusername/mapfilter-pro.git
```

or just hit the green **Code** button → **Download ZIP** → extract it.

**Step 2 — Open Chrome Extensions**

In your browser address bar, go to:

```
chrome://extensions
```

**Step 3 — Enable Developer Mode**

Top right corner of the extensions page — toggle **Developer mode** ON.

**Step 4 — Load the folder**

Click **Load unpacked** → navigate to the folder you extracted → select it → click **Select Folder**.

MapFilter Pro will appear in your extensions list with the map icon.

**Step 5 — Go to Google Maps**

Open [google.com/maps](https://www.google.com/maps) in a new tab, then click the MapFilter icon in your Chrome toolbar. Hit **Open Scanner Panel** and the panel will appear on the right side of the page.

---

## how to use it

1. Type a business type in the first field — `dentist`, `bakery`, `interior designer`, anything
2. Type a location — `Indrapuram Delhi`, `Austin TX`, `London` — or hit the GPS button
3. Set your radius with the slider
4. Hit **Scan Area** — it'll automatically search multiple zones and collect listings
5. Once the scan is done, use the filter chips or the filter panels to narrow down
6. Hit **Apply Filters** to highlight matching businesses on the map itself
7. Click **Save Lead** on any result to move it to your Notes tab
8. Add notes, then **Export CSV** whenever you're ready to start calling

---

## file structure

```
mapfilter-extension/
├── manifest.json       # extension config, permissions, content script registration
├── background.js       # service worker (minimal — just logs on install)
├── popup.html          # the small launcher popup when you click the extension icon
├── popup.css           # styles for the launcher popup
├── popup.js            # opens the panel on the active Maps tab
├── content.js          # the main panel — injected into Google Maps pages
├── content.css         # (legacy — styles now live inside content.js via Shadow DOM)
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## tech notes

The panel uses **Shadow DOM** — this is why the styling actually works on Google Maps. Maps injects aggressive global CSS that would override any normal styles you add to the page. By mounting the panel inside a shadow root, the styles are completely isolated and Maps can't touch them.

All scan data and saved notes are stored in `chrome.storage.local` — nothing leaves your browser, no servers involved.

The scanner works by programmatically typing search queries into the Maps search box and reading the result cards from the DOM. It clicks into each listing to grab phone numbers, website URLs, and addresses. This means it needs an actual Maps page open and visible to work properly.

---

## permissions used

| Permission | Why |
|---|---|
| `activeTab` | To interact with the currently open Maps tab |
| `storage` | To save scan results and notes between sessions |
| `scripting` | To inject the panel if it wasn't loaded by the content script |
| `host_permissions: google.com/maps/*` | To run the content script on Maps pages only |

---

## limitations

- Only works on `google.com/maps` — not Maps embedded in other sites
- Scan speed depends on how fast Maps loads results — slower internet = slower scans
- Google occasionally changes their Maps DOM class names which can break card reading — if results stop showing data, the selectors in `content.js` may need updating
- The extension doesn't use any official Google Maps API — it reads the visible page, so it's subject to whatever Maps shows you

---

## built with

- Vanilla JavaScript (no frameworks, no build step)
- Chrome Extensions Manifest V3
- Shadow DOM for style isolation
- `chrome.storage.local` for persistence
- Pure CSS for all UI — no external libraries

---

*made for freelancers who'd rather spend time on the phone than in a spreadsheet*
