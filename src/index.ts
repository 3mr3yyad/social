import express from "express";
import { bootStrap } from "./app.controller";
import {config} from "dotenv";
import { devConfig } from "./config/env/dev.config";
import { initSocketIo } from "./socket-io";

config();

const app = express();
const port = devConfig.PORT || 3000;

bootStrap(app, express);

const server = app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

initSocketIo(server);