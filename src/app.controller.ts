import type {  Express, Request, Response, NextFunction } from "express";
import { connectDB } from "./DB";
import { AppError } from "./utils";
import { authRouter, chatRouter, commentRouter, postRouter, userRouter } from "./module";
import cors from "cors";

export function bootStrap(app: Express, express: any) {
    connectDB();
    app.use(express.json());
    app.use(cors({ origin: "*" }));

    // auth
    app.use("/auth", authRouter);

    // user
    app.use("/user", userRouter);

    // post
    app.use("/post", postRouter);

    // comment
    app.use("/comment", commentRouter);

    // chat
    app.use("/chat", chatRouter);


    app.use("/{*dummy}", (req: Request, res: Response) => {
        return res.status(404).send({message:"Not Found", success:false});
    })

    app.use((error:AppError, req:Request, res:Response, next:NextFunction)=>{
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message, success: false});
    })
}
