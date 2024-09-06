import { fileTypeChecking } from "../generalFiles/variables.js";

import { createReviewsSchema } from "../schemas/reviewsSchemas.js";

import { config } from "dotenv";

import { sendEmailCreateReviews } from "../generalFiles/sendEmails.js";

import { getMediaReview } from "../services/reviewsServices.js";
import { getMediaReviewSchema } from "../schemas/reviewsSchemas.js";

import path from "path";
import fs from "fs/promises";

import { __dirname } from "../generalFiles/variables.js";

import { createReview } from "../services/reviewsServices.js";
import HttpError from "../generalFiles/HttpError.js";

config();

const BACK_URL = process.env.BACK_URL;

export const createReviewController = async (req, res, next) => {
  try {
    const { comment, orderId } = req.body;
    const { user } = req;
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

    const data = await createReview(user, orderId, comment, files);

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const getMediaReviewController = async (req, res, next) => {
  try {
    const { filter = "", page = 1, pageSize = 6 } = req.query;

    const { error } = getMediaReviewSchema.validate(req.params);

    if (error) {
      throw HttpError(400, "Invalid format");
    }

    const data = await getMediaReview(filter, page, pageSize);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
