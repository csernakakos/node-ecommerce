const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const usersRepo = require("./repositories/users");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.send(`
        <div>
            <form action="/" method="POST">
                <input name="email" placeholder="email" />
                <input name="password" placeholder="password" />
                <input name="passwordConfirmation" placeholder="password confirmation" />

                <button>Sign Up</button>
            </form>
        </div>
    `);
});

app.post("/", async (req, res) => {
    const {email, password, passwordConfirmation} = req.body;

    const existingUser = await usersRepo.getOneBy({email: email});

    if (existingUser) {
        return res.send("Email already in use.")
    }

    if (password !== passwordConfirmation) {
        return res.send("Passwords must match.")
    }    

    await usersRepo.create(req.body);
    res.send("Signed up!")
});

app.listen(3020, () => {console.log("running!")});