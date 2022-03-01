const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const authRouter = require("./routes/admin/auth");
const adminProductsRouter = require("./routes/admin/products")
const productsRouter = require("./routes/products");
const cartsRouter = require("./routes/carts");

const port = process.env.PORT || 3020;

const app = express();
app.use(cors());
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
    keys: ["r-a-n-d-o-m-CHARACTERS"]
}));

app.use(authRouter);
app.use(adminProductsRouter);
app.use(productsRouter);
app.use(cartsRouter);



app.listen(port, () => {console.log(`running! on ${port}.`)});