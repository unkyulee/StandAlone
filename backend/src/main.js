// return Vue frontend
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile("src/index")
    .append(`<script> window.params = ${JSON.stringify(e)}; app_init();</script>`)    
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
