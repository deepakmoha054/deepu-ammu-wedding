# 🚀 Deploy & Publish — Complete Guide

## Overview

You have **three invitation pages** and **one RSVP backend**:

| File | Audience |
|------|----------|
| `wedding-only.html` | Wedding ceremony guests only |
| `wedding-invitation.html` | Wedding + Reception guests |
| `reception-invitation.html` | Reception-only guests |
| `rsvp-google-sheet-script.js` | Deploy once as a Google Apps Script Web App |

---

## Part 1 — Set up RSVP → Google Sheets  *(do this first)*

### Step 1 — Create the spreadsheet

1. Go to **https://sheets.google.com** → click **Blank**.
2. Name it **"Deepu & Ammu RSVP"**.
3. Copy the **Spreadsheet ID** from the browser URL:
   ```
   https://docs.google.com/spreadsheets/d/  ← COPY THIS PART →  /edit
   ```

### Step 2 — Add the Apps Script

1. In the spreadsheet, click **Extensions → Apps Script**.
2. Delete everything in the editor.
3. Open `rsvp-google-sheet-script.js` from your project folder.
4. Paste the entire contents into the Apps Script editor.
5. Find this line near the top and paste your Spreadsheet ID:
   ```javascript
   const SPREADSHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';
   ```
6. Click **Save** (Ctrl+S / Cmd+S). Name the project "Wedding RSVP".

### Step 3 — Deploy the script as a Web App

1. Click **Deploy → New Deployment**.
2. Click the ⚙️ gear icon next to "Select type" → choose **Web App**.
3. Fill in:
   - **Description:** `Wedding RSVP v1`
   - **Execute as:** `Me` (your Google account)
   - **Who has access:** `Anyone`
4. Click **Deploy**.
5. You'll be asked to **authorise** the script:
   - Click **"Advanced"**
   - Click **"Go to Wedding RSVP (unsafe)"**  ← this is normal for Apps Scripts
   - Click **Allow**
6. **Copy the Web App URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```
   ⚠️ **Save this URL — you need it in the next step.**

### Step 4 — Add the URL to all three HTML files

Open each of these three files in a text editor and find:
```javascript
const SHEETS_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
```
Replace the placeholder with your Web App URL. Do this in:
- `wedding-only.html`
- `wedding-invitation.html`
- `reception-invitation.html`

### Step 5 — Test it

Open any invitation page in your browser, fill in the RSVP form, and submit.
Then check your Google Sheet — a new row should appear in the correct tab
("Wedding", "Reception", or "Ceremony") within seconds.

---

## Part 2 — Push to GitHub

### Step 1 — Create the repository

1. Go to **https://github.com/new**
2. **Repository name:** `deepu-ammu-wedding`
3. Set to **Public** *(required for free GitHub Pages)*
4. ❌ Do **not** check "Add a README" — we already have one
5. Click **Create repository**

### Step 2 — Connect and push

In your terminal, inside the project folder:

```bash
# Add your GitHub repo as the remote  (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/deepu-ammu-wedding.git

# Push everything
git push -u origin main
```

You'll be prompted for your GitHub username and a **Personal Access Token**
(not your password). To generate one:
> GitHub → Settings → Developer settings → Personal access tokens (classic)
> → Generate new token → tick the **repo** scope → Generate → copy it.

---

## Part 3 — Enable GitHub Pages (publish live)

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Source**, set:
   - **Branch:** `main`
   - **Folder:** `/ (root)`
4. Click **Save**
5. Wait ~60 seconds → your site is live at:

```
https://YOUR-USERNAME.github.io/deepu-ammu-wedding/
```

**Share these three links with your guests:**

| Page | Link |
|------|------|
| Wedding ceremony | `.../wedding-only.html` |
| Wedding + Reception | `.../wedding-invitation.html` |
| Reception only | `.../reception-invitation.html` |

---

## Part 4 — Making edits after publishing

Every time you change any file:

```bash
git add .
git commit -m "Brief description of what you changed"
git push
```

GitHub Pages **republishes automatically** within ~30–60 seconds.

---

## Part 5 — Updating the Google Apps Script

If you ever need to change the RSVP script:

1. Open Extensions → Apps Script in the spreadsheet
2. Edit the code
3. Click **Deploy → Manage deployments**
4. Click the pencil ✏️ next to your deployment
5. Change **Version** to **"New version"**
6. Click **Deploy**

The URL stays the same — no need to update the HTML files.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| RSVP form submits but nothing appears in the sheet | Double-check the URL in all HTML files is the correct Web App URL (ends in `/exec`, not `/dev`) |
| "Authorisation required" error | Re-deploy the script and re-authorise when prompted |
| GitHub Pages shows 404 | Make sure the repo is Public and Pages is enabled with branch `main` |
| Site not updating after `git push` | Wait 60 seconds; check Actions tab in GitHub for any errors |

---

*With love — Deepu & Ammu, June 2026* 🌸
