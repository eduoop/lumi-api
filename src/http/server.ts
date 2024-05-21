import express from "express";
import { router } from "../routes";
const app = express();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.use(express.json());
app.use(router);
app.listen(3000, () => console.log("Server running on port 3000"));
