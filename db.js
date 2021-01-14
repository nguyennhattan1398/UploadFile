const mongoose = require("mongoose");

module.exports = mongoose.connect(
  "mongodb+srv://nhattan:123@cluster0.k71gc.mongodb.net/test",
  { useUnifiedTopology: true, useNewUrlParser: true },
  function (err, db) {
    if (err) throw err;
    console.log("Successfully connected");
  }
);
