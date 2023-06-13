import mongoose from "mongoose";
import { env } from "./../utils/helpers/utils";
require('dotenv').config()

const mongodbURL =  env("DATABASE_URL")

export default async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    mongoose.connect(mongodbURL).then(async (func) => {
        console.log("Successfully connected to database!");
        resolve();
      })
      .catch((error) => {
        console.log(`Error connecting to the database ${error}`);
        reject(error)
    });
  })
};
