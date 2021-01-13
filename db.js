const mongoose = require("mongoose");

module.exports = mongoose.connect(
  " mongodb://127.0.0.1:27017/DB_Query",
  { useUnifiedTopology: true, useNewUrlParser: true },
  function (err, db) {
    if (err) throw err;
    console.log("Successfully connected");
  }
);
