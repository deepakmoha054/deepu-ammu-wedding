/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║   Deepu & Ammu Wedding — RSVP → Google Sheets                  ║
 * ║   Google Apps Script  |  Deploy as a Web App                   ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * HOW TO DEPLOY — read once, done forever:
 *
 *  1. Go to https://sheets.google.com → create a new spreadsheet.
 *     Name it "Deepu & Ammu RSVP" (or anything you like).
 *
 *  2. Copy the Spreadsheet ID from the URL:
 *       https://docs.google.com/spreadsheets/d/ ← THIS PART → /edit
 *     Paste it into SPREADSHEET_ID below.
 *
 *  3. In the spreadsheet, the script will auto-create three tabs:
 *       "Wedding"    → RSVPs from wedding-invitation.html
 *       "Reception"  → RSVPs from reception-invitation.html
 *       "Ceremony"   → RSVPs from wedding-only.html
 *     You can rename them freely after the first submission.
 *
 *  4. Open Extensions → Apps Script in the spreadsheet.
 *     Delete any existing code. Paste THIS entire file.
 *
 *  5. Click  Deploy → New Deployment
 *       Type:            Web App
 *       Description:     Wedding RSVP v1
 *       Execute as:      Me  (your Google account)
 *       Who has access:  Anyone
 *     Click Deploy.
 *     ⚠ You will be asked to authorise the script — click
 *       "Advanced" → "Go to (unsafe)" → Allow.  This is normal.
 *
 *  6. Copy the Web App URL. It looks like:
 *       https://script.google.com/macros/s/AKfy.../exec
 *
 *  7. Open each HTML file, find the line:
 *       const SHEETS_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
 *     Replace with your URL. Do this in all three files.
 *
 *  8. git add . && git commit -m "Add Sheets URL" && git push
 *     GitHub Pages republishes in ~30 seconds. Done! ✅
 *
 * ──────────────────────────────────────────────────────────────────
 * UPDATING THE SCRIPT LATER:
 *   If you change this code, you must create a NEW deployment
 *   (Deploy → Manage Deployments → New Version) to publish changes.
 *   The URL stays the same — no need to update the HTML files.
 * ──────────────────────────────────────────────────────────────────
 */

// ── PASTE YOUR SPREADSHEET ID HERE ─────────────────────────────────
const SPREADSHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';
// ───────────────────────────────────────────────────────────────────

/**
 * Column headers written on first use.
 * Order must match the appendRow() call in writeRSVP().
 */
const HEADERS = [
  'Timestamp (IST)',
  'Name',
  'Phone / WhatsApp',
  'Attending',
  'Guests',
  'Dietary Preference',
  'Message',
  'Form Source'
];

/**
 * Receives POST requests from the wedding pages.
 * Google calls this automatically for every incoming POST.
 */
function doPost(e) {
  try {
    const raw  = e.postData && e.postData.contents ? e.postData.contents : '{}';
    const data = JSON.parse(raw);

    writeRSVP(data);

    return jsonResponse({ success: true, message: 'RSVP recorded — thank you!' });

  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

/**
 * Writes one RSVP row into the correct sheet tab.
 */
function writeRSVP(data) {
  const ss       = SpreadsheetApp.openById(SPREADSHEET_ID);
  const tabName  = resolveTab(data.form_source);
  let   sheet    = ss.getSheetByName(tabName);

  // Create the tab if it doesn't exist yet
  if (!sheet) {
    sheet = ss.insertSheet(tabName);
  }

  // Write bold header row on first use
  if (sheet.getLastRow() === 0) {
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setValues([HEADERS]);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#f3e5f5');   // soft lavender header
    sheet.setFrozenRows(1);
    sheet.setColumnWidths(1, HEADERS.length, 180);
  }

  // Append the RSVP data row
  sheet.appendRow([
    data.timestamp  || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    data.name       || '',
    data.phone      || '',
    data.attending  || '',
    data.guests     || '',
    data.dietary    || '',
    data.message    || '',
    data.form_source || ''
  ]);

  // Colour alternate rows for readability
  const lastRow = sheet.getLastRow();
  if (lastRow % 2 === 0) {
    sheet.getRange(lastRow, 1, 1, HEADERS.length).setBackground('#fdf6ff');
  }
}

/**
 * Maps form_source values to sheet tab names.
 */
function resolveTab(source) {
  const map = {
    'wedding-invitation': 'Wedding',
    'reception-invitation': 'Reception',
    'wedding-only': 'Ceremony'
  };
  return map[source] || 'All RSVPs';
}

/**
 * Handles GET requests (e.g. browser visiting the URL directly).
 */
function doGet() {
  return HtmlService.createHtmlOutput(
    '<h2 style="font-family:sans-serif;color:#6b0d47;padding:40px;">✦ RSVP endpoint is live ✦</h2>' +
    '<p style="font-family:sans-serif;padding:0 40px;color:#444;">' +
    'This Web App receives RSVP submissions from the Deepu & Ammu wedding invitation pages.</p>'
  );
}

/**
 * Returns a CORS-friendly JSON ContentService response.
 * Note: the HTML pages use no-cors mode, so this is mainly
 * useful when testing the script directly.
 */
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
