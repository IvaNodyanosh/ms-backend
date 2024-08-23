import { fileTypeChecking } from "../generalFiles/variables.js";

import { createReviewsSchema } from "../schemas/reviewsSchemas.js";

import { config } from "dotenv";

import { sendEmailCreateReviews } from "../generalFiles/sendEmails.js";

import path from "path";
import fs from "fs/promises";

import { __dirname } from "../generalFiles/variables.js";

import { createReview } from "../services/reviewsServices.js";

config()

const BACK_URL = process.env.BACK_URL;

export const createReviewController = async (req, res, next) => {
  try {
    const { comment, orderId } = req.body;
    const files = [];

    req.files.forEach((file) => {
      const { path: temporaryName, mimetype, originalname } = file;

      const [__, typeFile] = mimetype.split("/");

      if (fileTypeChecking(typeFile)) {
        throw HttpError(400, "Invalid format");
      }

      const nameFile = `${Date.now()}_${originalname}`;
      const fileSrc = path.join(__dirname, `../public/reviews/${nameFile}`);
      const fileUrl = `${BACK_URL}reviews/${nameFile}`;
      fs.rename(temporaryName, fileSrc);
      files.push(fileUrl);
    });

    const data = await createReview(orderId, comment, files);

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};
