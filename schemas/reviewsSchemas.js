import Joi from "joi";
import { model, Schema } from "mongoose";

export const createReviewsSchema = Joi.object({
  orderId: Joi.string().required(),
  files: Joi.array(),
  comment: Joi.string(),
});

export const deletePhotoSchema = Joi.object({
  userId: Joi.valid(Schema.Types.ObjectId).required(),
});

export const changePhotoMessageSchema = Joi.object({
  userId: Joi.valid(Schema.Types.ObjectId).required(),
  comment: Joi.string(),
});

export const getMediaReviewSchema = Joi.object({
  filter: Joi.string(),
  page: Joi.number(),
  pageSize: Joi.number(),
});

const review = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    required: [true, "Id is required"],
  },
  files: {
    type: Array,
  },
  comment: {
    type: String,
  },
});

export const Review = model("review", review);
