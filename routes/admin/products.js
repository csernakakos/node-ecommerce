const express = require("express");
const {validationResult} = require("express-validator");
const multer = require('multer');
var upload = multer({storage: multer.memoryStorage()})

const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/new")
const {requireTitle, requirePrice} = require("./validators");

const router = express.Router();


router.get("/admin/products", (req, res) => {});

router.get("/admin/products/new", (req, res) => {
    console.log(req.body);
    res.send(productsNewTemplate({}));
})

router.post(
    "/admin/products/new",
    upload.single("image"), // This line must come before error validators, because this line will create req.body, housing title and price.
    [requireTitle, requirePrice], // title and proce are now accessible to express-validator
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.send(productsNewTemplate({errors}));
        }
   
        // Encode image
        const image = req.file.buffer.toString("base64");
        
        const {title, price} = req.body;

        await productsRepo.create({title, price, image});

        res.send("submitted");
});

module.exports = router;
