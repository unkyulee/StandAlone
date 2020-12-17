// Read Database
function search(params) {
  // return result
  let rows = [];
  let total = 0;

  // connect to DB
  let db = connectDB();
  let sheet = db.getSheetByName(params.table);

  // params - table, filter, page, size
  if (sheet) {
    // retrieve data
    let data = sheet.getDataRange().getValues();

    // first row is considered header
    let headers = data[0];

    // convert to rows
    for (let i = 1; i < data.length; i++) {
      // new row
      let row = { _ROW_: i + 1 };

      // convert to dictionary
      for (let j = 0; j < headers.length; j++) {
        if(typeof data[i][j] == 'object') {
          row[headers[j]] = JSON.stringify(data[i][j])
        } else {
          row[headers[j]] = data[i][j];
        }         
      }

      // apply filter
      if (params.filter && !applyFilter(params.filter, row)) continue;

      // remove sensitive
      if (params.sensitive)
        for (let key of Object.keys(params.sensitive)) delete row[key];

      //
      rows.push(row);
    }

    // get total rows
    total = rows.length;

    // sort
    if (params.sorts) {
      for (let sort of params.sorts) {
        // key, dir
        if (sort.dir == 1) {
          rows.sort((a, b) => {
            return a[sort.key] > b[sort.key]
              ? 1
              : b[sort.key] > a[sort.key]
              ? -1
              : 0;
          });
        } else if (sort.dir == -1) {
          rows.sort((b, a) => {
            return a[sort.key] > b[sort.key]
              ? 1
              : b[sort.key] > a[sort.key]
              ? -1
              : 0;
          });
        }
      }
    }
  }

  return {
    params,
    total,
    data: rows,
  };
}

function applyFilter(config, row) {
  // filter between columns will be "AND" condition
  let match = true;
  for (let column of Object.keys(config)) {
    let filters = config[column];

    // filter on the same column is "OR" condition
    let matchFound = false;
    for (let filter of filters) {
      // exact match
      if (filter.type == "match") {
        if (row[column] == filter.value) {
          matchFound = true;
          break;
        }
      }
      // hash match
      else if (filter.type == "hash") {
        if (row[column] == hash(filter.value)) {
          matchFound = true;
          break;
        }
      }

      // not equal to
      else if (filter.type == "neq") {
        if (row[column] != filter.value) {
          matchFound = true;
          break;
        }
      }
    }

    // check if all columns found a match
    if (!matchFound) {
      match = false;
      break;
    }
  }

  return match;
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
          if (value != null)
            sheet.getRange(nextRow, parseInt(i) + 1).setValue(value);
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

// Database
function connectDB() {
  // check cache
  var cache = CacheService.getScriptCache();
  var cached = cache.get("db");
  if (cached != null) {
    return SpreadsheetApp.openById(cached);
  }

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

      // save to cache file id
      cache.put("db", db.getId());

      // Puts the value 'bar' into the cache using the key 'foo'
      return SpreadsheetApp.open(db);
    }
  }
}
