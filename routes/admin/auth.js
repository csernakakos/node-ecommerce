const usersRepo = require("./../../repositories/users");
const express = require("express");
const router = express.Router();
const signupTemplate = require("../../views/admin/auth/signup")
const signinTemplate = require("../../views/admin/auth/signin")


router.get("/signup", (req, res) => {
    res.send(signupTemplate({ req }));
});

router.post("/signup", async (req, res) => {
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

router.get("/signout", (req, res) => {
    req.session = null;
    res.send("You're logged out. :)")
});

router.get("/signin", (req, res) => {
    res.send(signinTemplate());
})

router.post("/signin", async (req, res) => {
    const {email, password} = req.body;
    const user = await usersRepo.getOneBy({email});

    if (!user) return res.send("Email not found");

    // PASSWORD CHECK, FINAL
    const validPassword = await usersRepo.comparePasswords(user.password, password);
    if (!validPassword) return res.send("Wrong password.")

    req.session.userId = user.id;
    res.send("You're signed in.")
});

module.exports = router;