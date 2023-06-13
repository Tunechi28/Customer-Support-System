import app from "./app";
import * as logger from "../src/utils";
import { env } from "../src/utils";
import "./utils/polyfills/bigint";
import connectDB from "./database/index"
const port = env("PORT");


connectDB().then(() => { 
    app.listen(+port, () => {
        logger.info(`server Started on port : ${port}`);
    }); 
  }).catch(error => {
    console.log("Error while initializing mongo", error);
    process.exit(1);
})
