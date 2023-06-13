import express from "express";
import cors from "cors";
import routes from "./route";

const app = express();
app.use(cors());
app.enable("trust proxy");

app.use(express.json());
//Body parser, reading data from body to req.body
app.use(express.urlencoded({ extended: true }));



app.use("/api", routes);

app.get("/", (req, res) => {
    res.status(200).send("Welcome to Fincra Customer Support");
});

export default app;

