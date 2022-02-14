const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

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

// My custom URL parser middleware
function bodyParser(req, res, next){
    if (req.method === "POST") {
        req.on("data", data => {
            const parsed = data.toString("utf8").split("&");
            const formData = {};
            for (let pair of parsed) {
                const [key, value] = pair.split("=");
                formData[key] = value;
            }
            req.body = formData;
            next();
        });

    } else {
        next();
    }
};

// Let's run yet another middleware:
function helloFromMiddleware(req, res, next){
    console.log("Hello from middleware!");
    next();
};

// Using data from middleware
app.post("/", bodyParser, helloFromMiddleware, (req, res) => {
    console.log(req.body);
    res.send("Signed up!")
});

app.listen(3020, () => {console.log("running!")});