import express from "express";
import cors from "cors";
export const app = express();
app.use(express.json());
app.use(cors());
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import { ServerApiVersion, MongoClient } from "mongodb";

export const client = new MongoClient(process.env.URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
