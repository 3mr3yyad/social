import express from "express";
import { bootStrap } from "./app.controller";
import {config} from "dotenv";

config({path:"./config/dev.env"});

const app = express();
const port = process.env.PORT || 3000;

bootStrap(app, express);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

