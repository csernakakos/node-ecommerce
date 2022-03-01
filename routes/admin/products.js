const express = require("express");
const multer = require('multer');
const {handleErrors, requireAuth} = require("./../admin/middlewares");
var upload = multer({storage: multer.memoryStorage()})

const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/new")
const productsIndexTemplate = require("../../views/admin/products/index");
const productsEditTemplate = require("../../views/admin/products/edit.js");
const {requireTitle, requirePrice} = require("./validators");
const { append } = require("express/lib/response");

const router = express.Router();

router.get("/admin/products", requireAuth, async (req, res) => {
    const products = await productsRepo.getAll();
    res.send(productsIndexTemplate({products}));
});

router.get("/admin/products/new", requireAuth, (req, res) => {
    console.log(req.body);
    res.send(productsNewTemplate({}));
})

router.post(
    "/admin/products/new",
    requireAuth,
    upload.single("image"), // This line must come before error validators, because this line will create req.body, housing title and price.
    [requireTitle, requirePrice], // title and proce are now accessible to express-validator 
    handleErrors(productsNewTemplate),
    async (req, res) => {
        // Encode image
        const image = req.file.buffer.toString("base64");
        const {title, price} = req.body;
        await productsRepo.create({title, price, image});

        res.redirect("/admin/products");
});

router.get("/admin/products/:productID/edit", requireAuth, async (req, res) => {
    const productID = req.params.productID;
    const product = await productsRepo.getOne(productID);

    if(!product) {
        return res.send("Product not found.");
    };

    res.send(productsEditTemplate({product}));;
});

router.post("/admin/products/:productID/edit",
requireAuth,
upload.single("image"),
[requireTitle, requirePrice],
handleErrors(productsEditTemplate, async(req)=>{
    const product = await productsRepo.getOne(req.params.productID);
    return {product};
}),

async (req, res) => {
    console.log("YO")
    const changes = req.body;

    if(req.file) {
        changes.image = req.file.buffer.toString("base64");

    };

    try {
        await productsRepo.update(req.params.productID, changes);
    } catch(err) {
        return res.send("Could not find item.");
    }

    res.redirect("/admin/products");
});

router.post("/admin/products/:productID/delete",
requireAuth,
async(req, res) => {
    await productsRepo.delete(req.params.productID);

    res.redirect("/admin/products");
})

module.exports = router;
