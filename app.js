const express = require("express");
var queue = require('express-queue');
const { google } = require("googleapis");

const app = express();
//app.engine('ejs', require('ejs').express);
app.set("view engine", "ejs");
app.engine('ejs', require('ejs').__express);
//app.set('views', '/views')
app.use(express.urlencoded({ extended: true }));
app.use(queue({ activeLimit: 1, queuedLimit: -1 }));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", async (req, res) => {

  console.log(req.body);

  const { name, request, request2 } = req.body;

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1TXxhmTg8vpEhft_ckHqPnGYXrRD1v9Fidpdu8bzIWMg";

  // Get metadata about spreadsheet
  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  // Read rows from spreadsheet
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Sheet1!K1",
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
    range: "Sheet1!A:E",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[converted, currentIndex, name, request, request2]],
    },
  });

  // update stt
  await await googleSheets.spreadsheets.values.update({
    auth,
    spreadsheetId,
    range: "Sheet1!K1",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[currentIndex]],
    },
  })

  res.send("Số thứ tự của bạn là: " + currentIndex);
});

app.listen(1337, (req, res) => console.log("running on 1337"));
