const express = require("express");
const { google } = require("googleapis");

const app = express();
//app.engine('ejs', require('ejs').express);
app.set("view engine", "ejs");
app.engine('ejs', require('ejs').__express);
//app.set('views', '/views')
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", async (req, res) => {
  const { request, name } = req.body;

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
    range: "Sheet1!A:C",
  });

  let v1 = getRows.data.values;
  let oldLength = v1.length;
  console.log("old length: " + oldLength);

  console.log(v1[oldLength-1]);
  let oldIndex = v1[oldLength-1][0];

  console.log("old index: " + oldIndex);
  oldIndex++;


  // Write row(s) to spreadsheet
  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Sheet1!A:B",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[oldIndex, name, request]],
    },
  });



  //res.send(count);
  //res.send(getRows.data.values[count-1].data);
  res.send("Số thứ tự của bạn là: " + oldIndex);
});

app.listen(1337, (req, res) => console.log("running on 1337"));
