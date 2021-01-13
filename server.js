const express = require("express");
const app = express();
const initAPIs = require("./routes/api");
app.use(express.json());
initAPIs(app);
let port = 80;
app.listen(port, () => {
  console.log(`running at localhost:${port}/`);
});
