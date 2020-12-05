// return Vue frontend
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile("src/index").setXFrameOptionsMode(
    HtmlService.XFrameOptionsMode.ALLOWALL
  );
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
  if(sheet) {
    var data = sheet.getDataRange().getValues();
    var headers = data[0];    
  
    // convert to rows
    for (var i = 1; i < data.length; i++) {
      let row = {};
      //
      for (let j = 0; j < headers.length; j++) row[headers[j]] = data[i][j];
      if (params.filter && !eval(params.filter)) continue;  
      //
      rows.push(row);
    }
  }  

  return {
    data: rows,
  };
}
