const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.send(`
        <div>
            <form action="/" method="POST">
                <input name="email" placeholder="email" />
                <input name="password" placeholder="password" />
                <input name="passwordconfirmation" placeholder="password confirmation" />

                <button>Sign Up</button>
            </form>
        </div>
    `);
});



app.post("/", (req, res) => {
    console.log(req.body);
    res.send("Signed up!")
});

app.listen(3020, () => {console.log("running!")});