import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose
        .connect(process.env.DB_URL as string)
        .then(() => {
            console.log("DB connected successfully");
        })
        .catch((error) => {
            console.log({ message: "DB connection error", error });
        });
}
