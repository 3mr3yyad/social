import type { Express, Request, Response, NextFunction } from "express";
import { createHandler} from "graphql-http/lib/use/express"
import { connectDB } from "./DB";
import { AppError } from "./utils";
import { authRouter, chatRouter, commentRouter, postRouter, userRouter } from "./module";
import { appSchema } from "./app.schema";
import cors from "cors";
import { GraphQLError } from "graphql";

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

    // graphql
    app.all("/graphql", createHandler({
        schema: appSchema,
        formatError: (err:GraphQLError)=>{
            return {
                message: err.message,
                success: false,
                path: err.path,
                errorDetails: err.originalError
            } as unknown as GraphQLError
        },
        context: (req: any) => {
            const token = req.headers["authorization"];
            return {token}
        }
    }))


    app.use("/{*dummy}", (req: Request, res: Response) => {
        return res.status(404).send({message:"Not Found", success:false});
    })

    app.use((error:AppError, req:Request, res:Response, next:NextFunction)=>{
        return res
            .status(error.statusCode || 500)
            .json({ message: error.message, success: false});
    })
}
