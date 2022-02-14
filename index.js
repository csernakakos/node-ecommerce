const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.json({true: "hi there!"});
});

app.listen(3020, () => {console.log("running!")});