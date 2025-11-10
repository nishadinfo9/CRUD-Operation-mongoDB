import { ObjectId } from "mongodb";
import { app, client } from "./app.js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
const port = process.env.PORT || 3000;

client
  .connect()
  .then(() => {
    app.listen(port, () => {
      console.log("my server is running on", port);
    });
  })
  .catch((err) => {
    console.log(err);
  });

const db = client.db("smartDB");
const product = db.collection("product");
const bids = db.collection("bids");
const user = db.collection("user");

//user
app.post("/user", async (req, res) => {
  const newUser = req.body;
  console.log(newUser);
  const email = req.body.email;
  const query = { email: email };
  const existingUser = await user.findOne(query);
  if (existingUser) {
    res.send({ message: "user already exist" });
  } else {
    const result = await user.insertOne(newUser.name, newUser.email);
    res.send(result);
  }
});

//product
app.post("/product/add", async (req, res) => {
  const newData = req.body;
  const result = await product.insertOne(newData);
  res.send(result);
});

app.delete("/product/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await product.deleteOne(query);
  res.send(result);
});

app.patch("/product/:id", async (req, res) => {
  const id = req.params.id;
  const newData = req.body;
  const query = { _id: new ObjectId(id) };
  const update = {
    $set: {
      title: newData.title,
      price: newData.price,
    },
  };
  const result = await product.updateOne(query, update);
  res.send(result);
});

app.get("/product", async (req, res) => {
  const name = req.query.name;
  const query = {};
  if (name) {
    query.name = name;
  }
  const cursor = product.find(query);
  // .sort({ no: 1 }).limit(5).skip(5);

  const result = await cursor.toArray();
  res.send(result);
});

app.get("/product/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await product.findOne(query);
  res.send(result);
});

app.get("/latest-products", async (req, res) => {
  const cursor = product.find().sort({ created_at: -1 }).limit(5);
  const result = await cursor.toArray();
  res.send(result);
});

//bids
app.get("/product/bids/:id", async (req, res) => {
  const id = req.params.id;
  const query = { product: id };
  const cursor = bids.find(query);
  const result = await cursor.toArray();
  res.send(result);
});

app.get("/bids", async (req, res) => {
  const email = req.query.email;
  const query = {};
  if (email) {
    query.buyer_email = email;
  }
  const cursor = bids.find(query);
  const result = await cursor.toArray();
  res.send(result);
});

app.get("/bids/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await bids.findOne(query);
  res.send(result);
});

app.patch("/bids/:id", async (req, res) => {
  const id = req.params.id;
  const newData = req.body;
  const query = { _id: new ObjectId(id) };
  const update = {
    $set: {
      bid_price: newData.bid_price,
    },
  };
  const result = await bids.updateOne(query, update);
  res.send(result);
});

app.delete("/bids/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await bids.deleteOne(query);
  res.send(result);
});

app.post("/bids/add", async (req, res) => {
  const newData = req.body;
  const result = await bids.insertOne(newData);
  res.send(result);
});

app.get("/", (req, res) => {
  res.send("hello world");
});
