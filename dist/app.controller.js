"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootStrap = bootStrap;
const DB_1 = require("./DB");
const module_1 = require("./module");
function bootStrap(app, express) {
    (0, DB_1.connectDB)();
    app.use(express.json());
    // auth
    app.use("/auth", module_1.authRouter);
    // user
    app.use("/user", module_1.userRouter);
    // post
    app.use("/post", module_1.postRouter);
    app.use("/{*dummy}", (req, res) => {
        return res.status(404).send({ message: "Not Found", success: false });
    });
    app.use((error, req, res, next) => {
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message, success: false });
    });
}
