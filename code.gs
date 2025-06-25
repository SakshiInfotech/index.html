function doGet(e) {
  return ContentService.createTextOutput("AV Data Entry API")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader("Access-Control-Allow-Origin", "*");
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheetNames = ['Field Allocation', 'Process Allocation'];

  try {
    const data = JSON.parse(e.postData.contents);
    Logger.log(data);

    if (data.login) {
      const usersSheet = sheet.getSheetByName("Sheet2");
      const users = usersSheet.getDataRange().getValues();
      for (let i = 1; i < users.length; i++) {
        if (users[i][0] === data.username && users[i][1] === data.password) {
          return ContentService.createTextOutput(JSON.stringify({
            success: true,
            executive: users[i][2],
            owner: users[i][3]
          }))
          .setMimeType(ContentService.MimeType.JSON)
          .setHeader("Access-Control-Allow-Origin", "*");
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ success: false }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeader("Access-Control-Allow-Origin", "*");
    }

    const uid = Utilities.getUuid();
    const row = [uid, data.Vendor, data.Date_All, data.Type_Verification, data.Client,
      data.Resume_id, data.Candidate_name, data.Address, data.Pincode, data.City,
      data.contact1, data.contact2, data.Executives, data.Status, data.Closing_Date,
      data.Process_Owner, data.Billing_Status, data.Client_Price, data.Exe_Price];

    sheetNames.forEach(name => sheet.getSheetByName(name).appendRow(row));

    return ContentService.createTextOutput("Submitted")
      .setMimeType(ContentService.MimeType.TEXT)
      .setHeader("Access-Control-Allow-Origin", "*");

  } catch (err) {
    Logger.log("Error: " + err.toString());
    return ContentService.createTextOutput("Error: " + err.toString())
      .setMimeType(ContentService.MimeType.TEXT)
      .setHeader("Access-Control-Allow-Origin", "*");
  }
}
