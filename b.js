var express = require("express");
var app = express();
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var multer = require("multer");
var forms = multer();

// apply them

app.use(bodyParser.json());
app.use(forms.array());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser("anonystick"));
// how to use

app.post("/", function (req, res) {
  console.log(req.body);
});

app.get("/", function (req, res) {
  // res.cookie("refresstoken", "aiasuidioqwi1");
  // res.cookie("token", "812kjaskjmdlkqw");
  // res.send("ok")
  res.send(req.cookies);
});

// app.post("/", function (req, res) {
//   res.set("Content-type", "multipart/form-data");
//   console.log("text");
//   console.dir(req.body);
// });

// app.get("/1", function (req, res) {
//   console.dir(req.signedCookies.name);
//   res.send("OKE");
// });

app.listen(3000);