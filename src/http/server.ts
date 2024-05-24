import express from "express";
import { router } from "../routes";
const app = express();

app.use(express.json());
app.use(router);
app.listen(process.env.PORT ? Number(process.env.PORT) : 3000, () =>
  console.log("HTTP server running "),
);
