const mongoose = require("mongoose");

module.exports = mongoose.connect(
  "mongodb+srv://demo:<password>@cluster0.pfpwe.mongodb.net/test",
  { useUnifiedTopology: true, useNewUrlParser: true },
  function (err, db) {
    if (err) throw err;
    console.log("Successfully connected");
  }
);
