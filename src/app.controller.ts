import { type Express } from "express";
import authRouter from "./module/auth/auth.controller";
import { connectDB } from "./DB/connection";
import { errorHandler } from "./utils/error/errorHandler";

export function bootStrap(app: Express, express: any) {
    connectDB();
    app.use(express.json());

    // auth
    app.use("/auth", authRouter);


    app.use("/{*dummy}", (req, res) => {
        return res.status(404).send({message:"Not Found", success:false});
    })

    app.use(errorHandler)
}
