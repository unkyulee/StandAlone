// return Vue frontend
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile("src/index")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
}

// Database
function connectDB() {
  // locate current direction
  var scriptId = ScriptApp.getScriptId();
  var file = DriveApp.getFileById(scriptId);
  var folders = file.getParents();
  if (folders.hasNext()) {
    var folder = folders.next();

    // locate the sheets with the name
    var db = DriveApp.searchFiles(
      `parents in '${folder.getId()}' and mimeType = '${
        MimeType.GOOGLE_SHEETS
      }' and title = 'DB'`
    );
    if (db.hasNext()) {
      db = db.next();

      // Puts the value 'bar' into the cache using the key 'foo'
      return SpreadsheetApp.open(db);
    }
  }
}

// Read Database
function search(params) {
  var rows = [];

  // params - table, filter, page, size
  let db = connectDB();
  var sheet = db.getSheetByName(params.table);
  if (sheet) {
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var filter = params.filter;
    if (filter) filter = eval(filter);

    // convert to rows
    for (var i = 1; i < data.length; i++) {
      let row = {
        _ROW_: i + 1,
      };
      //
      for (let j = 0; j < headers.length; j++) row[headers[j]] = data[i][j];

      // filter
      if (filter && !filter(row)) continue;

      //
      rows.push(row);
    }
  }

  return {
    data: rows,
  };
}

// Upsert
function upsert(params) {
  try {
    // Lock
    var lock = LockService.getPublicLock();
    lock.waitLock(30000);

    // Connect to DB
    // params - table, filter, page, size
    let db = connectDB();
    var sheet = db.getSheetByName(params.table);
    if (sheet) {
      // header is in row 1
      var headers = sheet
        .getRange(1, 1, 1, sheet.getLastColumn())
        .getValues()[0];

      // decide to update or append
      var nextRow;
      var row = [];

      if (params.data._ROW_ && params.data._ROW_ != 1) {
        ///////////////////////
        // UPDATE
        ///////////////////////
        nextRow = params.data._ROW_;

        // loop through the header columns
        for (i in headers) {
          let value = params.data[headers[i]];
          // else use header name to get data
          row.push(value);

          // update the cell
          if (value) sheet.getRange(nextRow, parseInt(i) + 1).setValue(value);
        }
      } else {
        ///////////////////////
        // INSERT
        ///////////////////////
        nextRow = sheet.getLastRow() + 1; // get next row

        // loop through the header columns
        for (i in headers) {
          // else use header name to get data
          row.push(params.data[headers[i]]);
        }

        // append row
        sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
      }

      // return row number
      return {
        _ROW_: nextRow,
        row,
      };
    }
  } catch (ex) {
    throw ex;
  } finally {
    // Release Lock
    lock.releaseLock();
  }
}

// send email
function sendEmail(params) {
  MailApp.sendEmail(
    params.recipients,
    params.subject,
    params.body
  );
}
