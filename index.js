const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const authRouter = require("./routes/admin/auth");
// const { comparePasswords } = require("./repositories/users");
// const dotenv = require("dotenv");

const port = process.env.PORT || 3020;

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
    keys: ["r-a-n-d-o-m-CHARACTERS"]
}));

app.use(authRouter);



app.listen(port, () => {console.log(`running! on ${port}.`)});