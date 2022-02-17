const { check } = require('express-validator');
const usersRepo = require("../../repositories/users");


module.exports = {
    requireEmail:
    check("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("Make sure the email you entered is valid.")
        .custom(async (email) => {
            const existingUser = await usersRepo.getOneBy({email});
            if (existingUser) {
                throw new Error("This email is already in use.");
            }
        }),

    requirePassword:
    check("password")
            .trim()
            .isLength({min:4, max:20})
            .withMessage("Make sure the password is between 4 and 20 characters."),

    requirePasswordConfirmation:
    check("passwordConfirmation")
            .trim()
            .isLength({min:4, max:20})
            .withMessage("Make sure the password is between 4 and 20 characters.")
            // .custom((passwordConfirmation, {req}) => {
            //     console.log(">>>>>>>>>>>>>>>>>>>>");
            //     console.log(passwordConfirmation);
            //     console.log(req.body.password);
            //     console.log(">>>>>>>>>>>>>>>>>>>>");
            //     if (passwordConfirmation !== req.body.password) {
            //         throw new Error("The two passwords must match.")
            //             } 
            //         }
            //     )
            ,

    requireEmailExists:
    check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Provide a valid email.")
    .custom(async (email) => {
        const user = await usersRepo.getOneBy({email});
        if (!user) {
            throw new Error("Uhhhm!")
        }
    }),

    requireValidPasswordForUser:
    check("password")
    .trim()
    .custom(async (password, {req}) => {
        const user = await usersRepo.getOneBy({email: req.body.email });

        if (!user) {
            throw new Error("Not a valid password");
        };
        const validPassword = await usersRepo.comparePasswords(
            user.password,
            password
        )
        if (!validPassword) {
            throw new Error("Wrong password sis!")
        }
    }),


};