import Joi from "joi";
import { Schema, model } from "mongoose";

import { userAvatarDefault } from "../generalFiles/variables.js";

import { allowEmail } from "../generalFiles/variables.js";
import { phoneRegex } from "../generalFiles/variables.js";


const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  surname: Joi.string().required(),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: allowEmail } })
    .required(),

  phone: Joi.string()
    .regex(phoneRegex)
    .message({ "string.pattern.base": "format phone is invalid" })
    .required(),
  password: Joi.string().min(6).required(),
}); //ok

export const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
}); //ok

export const logoutSchema = Joi.object({
  id: Joi.required(),
});

export const changeStatusUserSchema = Joi.object({
  id: Joi.string().required(),
  status: Joi.valid("user", "owner", "admin", "block").required(),
});

export const changeStatusUserForOwnerSchema = Joi.object({
  id: Joi.string().required(),
  status: Joi.valid("user", "block").required(),
});

export const deleteUserSchema = Joi.object({
  userId: Joi.valid(Schema.Types.ObjectId).required(),
});

export const verifyEmailSchema = Joi.object({
  verificationToken: Joi.string().required(),
});

export const emailValidateSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: allowEmail } })
    .required(),
});

export const changePasswordSchema = Joi.object({
  recoveryToken: Joi.string().required(),
  password: Joi.string().required(),
});

const user = new Schema(
  {
    name: {
      type: String,
    },
    surname: {
      type: String,
    },
    phone: {
      type: String,
      match: [phoneRegex, "format phone is invalid"],
    },
    email: {
      email: {
        type: String,
        match: [emailRegexp, "format email is invalid"],
      },
      verificationToken: {
        type: String,
      },
      isVerify: {
        type: Boolean,
        default: false,
      },
    },
    avatarUrl: {
      type: String,
      default: userAvatarDefault,
    },
    password: {
      type: String,
      default: null,
    },
    recoveryToken: {
      type: String,
      default: null,
    },
    token: {
      type: String,
      default: null,
    },
    statusUser: {
      type: String,
      enum: ["block", "user", "owner", "admin", "unregistered"],
      default: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

export const User = model("user", user);
