import express from "express";
import { bootStrap } from "./app.controller";
import {config} from "dotenv";
import { devConfig } from "./config/env/dev.config";

config();

const app = express();
const port = devConfig.PORT || 3000;

bootStrap(app, express);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

