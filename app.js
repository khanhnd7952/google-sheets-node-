const express = require("express");
var queue = require("express-queue");
const { google } = require("googleapis");

const app = express();
//app.engine('ejs', require('ejs').express);
app.set("view engine", "ejs");
app.engine("ejs", require("ejs").__express);
//app.set('views', '/views')
app.use(express.urlencoded({ extended: true }));
app.use(queue({ activeLimit: 1, queuedLimit: -1 }));

app.get("/", (req, res) => {
  res.render("HDGD");
});

app.get("/HDGD", (req, res) => {
  res.render("HDGD");
});

app.get("/CTCK", (req, res) => {
  res.render("CTCK");
});
//---------------------------------------------------HDGD-----------------------------------------------------
app.post("/HDGD", async (req, res) => {
  console.log(req.body);

  const { field1, field2, field3, field4, field5 } = req.body;

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1DYOsvFwZwz5b15OH257EbP66HVUMeFQ6IvmWOqhObAs";

  const sheetName = "HĐ, GD";
  // Get metadata about spreadsheet
  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  // Read rows from spreadsheet
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: sheetName + "!K1",
  });
  console.log(getRows.data);

  let currentIndex = getRows.data.values[0][0];
  console.log("Số thứ tự hiện tại: " + currentIndex);
  currentIndex++;

  let date_ob = new Date();
  let converted = date_ob.toLocaleString("en-US", { timeZone: "Asia/Saigon" });

  // Write row(s) to spreadsheet
  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: sheetName + "!A:G",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [
        [converted, currentIndex, field1, field2, field3, field4, field5],
      ],
    },
  });

  // update stt
  await await googleSheets.spreadsheets.values.update({
    auth,
    spreadsheetId,
    range: sheetName + "!K1",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[currentIndex]],
    },
  });

  res.send("Số thứ tự của bạn là: " + currentIndex);
});

//---------------------------------------------------CTCK-----------------------------------------------------
app.post("/CTCK", async (req, res) => {
  console.log(req.body);

  const { field1, field3, field4, field5 } = req.body;

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1DYOsvFwZwz5b15OH257EbP66HVUMeFQ6IvmWOqhObAs";

  const sheetName = "CTCK";
  // Get metadata about spreadsheet
  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  // Read rows from spreadsheet
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: sheetName + "!K1",
  });
  console.log(getRows.data);

  let currentIndex = getRows.data.values[0][0];
  console.log("Số thứ tự hiện tại: " + currentIndex);
  currentIndex++;

  let date_ob = new Date();
  let converted = date_ob.toLocaleString("en-US", { timeZone: "Asia/Saigon" });

  // Write row(s) to spreadsheet
  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: sheetName + "!A:F",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[converted, currentIndex, field1, field3, field4, field5]],
    },
  });

  // update stt
  await await googleSheets.spreadsheets.values.update({
    auth,
    spreadsheetId,
    range: sheetName + "!K1",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[currentIndex]],
    },
  });

  res.send("Số thứ tự của bạn là: " + currentIndex);
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, (req, res) => console.log("running on " + PORT));
