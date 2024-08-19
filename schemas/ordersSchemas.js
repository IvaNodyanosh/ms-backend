import Joi from "joi";
import { Schema, model } from "mongoose";

import { allowEmail } from "../generalFiles/variables.js";
import { phoneRegex } from "../generalFiles/variables.js";

export const createOrderSchema = Joi.object({
  message: Joi.string(),
  name: Joi.string().required(),
  surname: Joi.string().required(),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: allowEmail } })
    .required(),

  phone: Joi.string().regex(phoneRegex).required(),
});

export const validateIdSchema = Joi.object({
  orderId: Joi.valid(Schema.Types.ObjectId).required(),
});

export const changeStatusForOwnerOrderSchema = Joi.object({
  status: Joi.string().valid(
    "registered",
    "accepted",
    "completed",
    "cancelled"
  ).required(),
});

export const cancelledByUserOrderSchema = Joi.object({
  status: Joi.string().valid("cancelledUser").required(),
});

const order = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "Id is required"],
    },
    status: {
      type: String,
      enum: [
        "registered",
        "accepted",
        "completed",
        "cancelled",
        "cancelledUser",
      ],
      default: "registered",
    },
    message: {
      type: String,
    },
    files: { type: Array },
  },
  { versionKey: false, timestamps: true }
);

export const Order = model("order", order);
