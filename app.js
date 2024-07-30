const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const feedRoute = require("./routes/feed");
const app = express();

app.use(bodyParser.json()); //for JSON/APPLICATION data format

app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
})
//
app.use("/feed", feedRoute);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
})

mongoose.connect("mongodb+srv://NodeJS:mwIFTGKGpq13p04B@cluster0.gxehntz.mongodb.net/messages").then(() => {
    app.listen(8080);
}).catch(err => {
    console.log(err);
});