const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const usersRepo = require("./repositories/users");
const { comparePasswords } = require("./repositories/users");
const dotenv = require("dotenv");

const port = process.env.PORT || 3020;
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
    keys: ["r-a-n-d-o-m-CHARACTERS"]
}));

app.get("/signup", (req, res) => {
    res.send(`
        <div>
            ${req.session.userId}
            <form method="POST">
                <input name="email" placeholder="email" />
                <input name="password" placeholder="password" />
                <input name="passwordConfirmation" placeholder="password confirmation" />

                <button>Sign Up</button>
            </form>
        </div>
    `);
});

app.post("/signup", async (req, res) => {
    const {email, password, passwordConfirmation} = req.body;

    const existingUser = await usersRepo.getOneBy({email: email});

    if (existingUser) {
        return res.send("Email already in use.")
    }

    if (password !== passwordConfirmation) {
        return res.send("Passwords must match.")
    }    

    // Create user
    const user = await usersRepo.create({email: email, password: password});

    // Store id inside the user's cookie
    req.session.userId = user.id;
    res.send("Signed up!");
});

app.get("/signout", (req, res) => {
    req.session = null;
    res.send("You're logged out. :)")
});

app.get("/signin", (req, res) => {
    res.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />

            <button>Sign In</button>
        </form>
    </div>
    `)
})

app.post("/signin", async (req, res) => {
    const {email, password} = req.body;
    const user = await usersRepo.getOneBy({email});

    if (!user) return res.send("Email not found");

    // PASSWORD CHECK, FINAL
    const validPassword = await usersRepo.comparePasswords(user.password, password);
    if (!validPassword) return res.send("Wrong password.")

    req.session.userId = user.id;
    res.send("You're signed in.")
});

app.listen(port, () => {console.log(`running! on ${port}.`)});