import {config} from "dotenv";

config();

export const devConfig = {
    // # DB
DB_URL: process.env.DB_URL,
PORT: process.env.PORT,

// # email
EMAIL : process.env.EMAIL,
EMAIL_PASSWORD : process.env.EMAIL_PASSWORD,

// # JWT
JWT_SECRET : process.env.JWT_SECRET,
}