import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, ".env") });

import KaizenRoutes from "./Routes/KaizenRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

const app = express();
const PORT = process.env.PORT || 5001;

//middleware
if (process.env.NODE_ENV !== "production"){
    app.use(
    cors({
        origin: "http://localhost:5173",
    })
);
}

app.use(express.json()); //this will parse JSON bodies: req.body
app.use(rateLimiter);


// simple custom middleware
// app.use((req,res,next) =>{
//     console.log(`Req method is ${req.method} & Req URL is ${req.url}`);
//     next();
// });

app.use("/api/Kaizen", KaizenRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../Frontend/dist")))

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html"));
    });
}


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server started on PORT:", PORT);
    });
});