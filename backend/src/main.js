// return Vue frontend
function doGet(e) 
  // route navigation
  let output = HtmlService.createHtmlOutputFromFile("src/index");
  output.setXFrameOptionsMode(
    HtmlService.XFrameOptionsMode.ALLOWALL
  );
  return output; 
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
      // open sheets and return
      return SpreadsheetApp.open(db);
    }
  }
}

// Read Database
function search(params) {
  // params - table, filter, page, size
  let db = connectDB();
  var sheet = db.getSheetByName(params.table);
  var data = sheet.getDataRange().getValues();

  var headers = data[0];
  var rows = [];

  // convert to rows
  for (var i = 1; i < data.length; i++) {
    let row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = data[i][j];
    }
    //
    if (params.filter && !eval(params.filter)) {
      continue;
    }

    //
    rows.push(row);
  }

  return {
    data: rows
  };
}
