const express = require("express");
const bodyParser = require("body-parser");
const feedRoute = require("./routes/feed");
const app = express();

app.use(bodyParser.json()); //for JSON/APPLICATION data format

//
app.use("/feed", feedRoute);

app.listen(8080);
