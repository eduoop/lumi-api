import express from "express";
import { router } from "../routes";
import cors from "cors";

const app = express();

const corsConfig = {
  origin: true,
  credentials: true,
};

app.use(cors(corsConfig));

app.options("*", cors(corsConfig));

app.use(express.json());

app.use(router);

app.listen(process.env.PORT ? Number(process.env.PORT) : 3000, () =>
  console.log("HTTP server running "),
);
