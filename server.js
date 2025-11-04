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

app.post("/product/add", async (req, res) => {
  const query = { _id: new ObjectId() };
  const result = await product.insertOne(query);
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

app.delete("/product/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = product.deleteOne(query);
  res.send(result);
});

app.get("/product", async (req, res) => {
  const cursor = product.find();
  const result = await cursor.toArray();
  res.send(result);
});

app.get("/product/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const findId = await product.findOne(query);
  res.send(findId);
});

app.get("/", (req, res) => {
  res.send("hello world");
});
