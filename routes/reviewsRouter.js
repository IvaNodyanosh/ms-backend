import express from "express";
import { upload } from "../generalFiles/uploadFilles.js";

import {
  createReviewController,
  getMediaReviewController,
} from "../controllers/reviewsControllers.js";
import { authenticate } from "../generalFiles/authenticate.js";

const reviewsRouter = express.Router();

reviewsRouter.post(
  "/",
  authenticate,
  upload.array("files"),
  createReviewController
);
reviewsRouter.get("/media", getMediaReviewController);

export default reviewsRouter;
