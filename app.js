import express from "express";
import cors from "cors";
import morgan from "morgan";
import { mongoose } from "mongoose";
import { config } from "dotenv";
import { __dirname } from "./generalFiles/variables.js";

import usersRouter from "./routes/usersRouter.js";
import ordersRouter from "./routes/ordersRouter.js";
import reviewsRouter from "./routes/reviewsRouter.js";

config();

mongoose.promise = global.promise;

const app = express();

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use("/api", express.static("public"));

app.use("/api/users", usersRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/reviews", reviewsRouter);

app.use((_, res, __) => {
  res.status(404).json({
    message: "Use api on routes",
  });
});

app.use((err, __, res, ___) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({
    message,
  });
});

const PORT = process.env.PORT || 3000;
const uriDb = process.env.DB_HOST;

const connection = mongoose.connect(uriDb);

connection
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log("Database connection successful");
    });

    server.setTimeout(30 * 60 * 1000);
  })
  .catch((err) =>
    console.log(`Server not connection. Error message: ${err.message}`)
  );
