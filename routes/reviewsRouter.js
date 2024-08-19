import express from "express";
import { upload } from "../generalFiles/uploadFilles.js";

import { createReviewController } from "../controllers/reviewsControllers.js";

const reviewsRouter = express.Router();

reviewsRouter.post("/", upload.array("files"), createReviewController);

export default reviewsRouter;
