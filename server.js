const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const data = require("./data.json");
// const middleware = require("./middleware");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/api/items", (req, res) => {
  //console.log("items are", data.items);
  return res.json(data.items);
});

app.post("/api/items", (req, res) => {
  let products = [];
  id = null;

  console.log("body is", req.body);

  let cart = req.body.cart;

  console.log("cart is", cart);
  console.log("typeif", typeof cart);

  //let cart = JSON.parse(req.body.cart);
  if (!cart) {
    return res.json(products);
  }
  for (let i = 0; i < data.items.length; i++) {
    console.log("wkqlewqk;");
    id = data.items[i].id.toString();
    console.log("id is", id);
    if (cart.hasOwnProperty(id)) {
      data.items[i].qty = cart[id];
      products.push(data.items[i]);
    }
  }

  return res.json(products);
});

const port = 5000;

app.listen(port, () => console.log("Server started on port", port));
