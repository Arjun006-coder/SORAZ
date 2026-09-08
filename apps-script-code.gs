/**
 * SORAZ — Google Apps Script for Private Waitlist Storage
 * -------------------------------------------------------------
 * 1. Open Google Sheets (https://sheets.google.com) and create a new Blank Spreadsheet.
 * 2. Rename the Spreadsheet to "SORAZ Waitlist".
 * 3. Go to Extensions -> Apps Script.
 * 4. Erase any default code in Code.gs and paste THIS ENTIRE FILE.
 * 5. Click "Deploy" -> "New deployment".
 * 6. Click the Gear icon (Select type) -> "Web app".
 * 7. Set:
 *    - Description: "SORAZ Waitlist API"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 8. Click "Deploy", authorize access, and COPY the Web App URL.
 * 9. Paste the URL into src/components/waitlist-form.tsx as GOOGLE_SHEETS_ENDPOINT.
 */

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Waitlist");

    if (!sheet) {
      sheet = ss.insertSheet("Waitlist");
      sheet.appendRow(["Timestamp", "Name", "Phone", "Email", "Selected Products To Buy"]);
      sheet.getRange(1, 1, 1, 5).setFontWeight("bold").setBackground("#FF5252").setFontColor("#FFFFFF");
    }

    var params = e.parameter || {};
    var name = params.name || "";
    var phone = params.phone || "";
    var email = params.email || "";
    var products = params.products || "";

    if (!phone && !email) {
      return ContentService.createTextOutput(
        JSON.stringify({ result: "error", message: "Phone or email required" })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // Check duplicates in Phone (Column C / Index 3) or Email (Column D / Index 4)
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      var existingPhone = String(data[i][2]).trim();
      var existingEmail = String(data[i][3]).trim();
      if ((phone && existingPhone === phone) || (email && existingEmail === email)) {
        return ContentService.createTextOutput(
          JSON.stringify({ result: "duplicate", message: "Already registered" })
        ).setMimeType(ContentService.MimeType.JSON);
      }
    }

    // Append new lead
    var timestamp = new Date().toISOString();
    sheet.appendRow([timestamp, name, phone, email, products]);

    var count = sheet.getLastRow() - 1;

    return ContentService.createTextOutput(
      JSON.stringify({ result: "success", count: count })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput("SORAZ Waitlist API is active!");
}
