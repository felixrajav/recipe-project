import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import { userRouter } from "./routes/auth.js";
import { recipesRouter } from "./routes/recipes.js";


const app = express();

app.use(express.json());
app.use(cors()); 

app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);





const PORT = 3001
const DATABASE_URL="mongodb+srv://felixvictorraj:felix123@cluster0.puir6hi.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(DATABASE_URL)
  .then(() => app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); }))
  .catch((err) => console.log(err.message));
    