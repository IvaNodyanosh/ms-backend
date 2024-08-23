import {
  __dirname,
  maxSize,
  fileTypeChecking,
} from "../generalFiles/variables.js";
import path from "path";
import fs from "fs/promises";
import { nanoid } from "nanoid";

import { createUser } from "../services/usersServices.js";
import {
  createOrder,
  cancelledByUserOrder,
  changeStatusForOwnerOrder,
  getOrders,
} from "../services/ordersServices.js";

import {
  createOrderSchema,
  changeStatusForOwnerOrderSchema,
  cancelledByUserOrderSchema,
} from "../schemas/ordersSchemas.js";

import { config } from "dotenv";

config();

const BACK_URL = process.env.BACK_URL;

import { sendEmailForOwnerCreateOrder } from "../generalFiles/sendEmails.js";

import HttpError from "../generalFiles/HttpError.js";

export const createOrderController = async (req, res, next) => {
  const { message } = req.body;
  try {
    const { error } = createOrderSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const files = [];
    const attachments = [];
    let sizeFiles = 0;
    req.files.forEach((file) => {
      const { path: temporaryName, mimetype, originalname, size } = file;
      sizeFiles = sizeFiles + size;

      const [__, typeFile] = mimetype.split("/");
      if (fileTypeChecking(typeFile)) {
        throw HttpError(400, "Invalid format");
      }

      const nameFile = `${Date.now()}_${originalname}`;
      const fileUrl = path.join(__dirname, `../public/orders/${nameFile}`);
      fs.rename(temporaryName, fileUrl);
      files.push(fileUrl);
      attachments.push({ filename: nameFile, path: fileUrl });
    });
    if (sizeFiles > maxSize) {
      throw HttpError(400, "too much size files");
    }
    const { _id: userId } = await createUser(req.body, nanoid());
    const data = await createOrder(userId, message, files);
    await sendEmailForOwnerCreateOrder(req.body, attachments);
    res.status(201).json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const registerOrderController = async (req, res, next) => {
  const maxSize = 25 * 1024 * 1024;
  const { message } = req.body;
  const { _id: userId, email, phone, name, surname } = req.user;
  try {
    const files = [];
    const attachments = [];
    let sizeFiles = 0;
    req.files.forEach((file) => {
      const { path: temporaryName, mimetype, originalname, size } = file;
      sizeFiles = sizeFiles + size;

      const [__, typeFile] = mimetype.split("/");
      if (fileTypeChecking(typeFile)) {
        throw HttpError(400, "Invalid format");
      }

      const nameFile = `${Date.now()}_${originalname}`;
      const fileSrc = path.join(__dirname, `../public/orders/${nameFile}`);
      const fileUrl = `${BACK_URL}orders/${nameFile}`;
      fs.rename(temporaryName, fileSrc);
      files.push(fileUrl);
      attachments.push({ filename: nameFile, path: fileUrl });
    });
    if (sizeFiles > maxSize) {
      throw HttpError(400, "too much size files");
    }
    const data = await createOrder(userId, message, files);
    await sendEmailForOwnerCreateOrder(
      { name, surname, phone, email, message },
      attachments
    );
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const changeStatusOrderController = async (req, res, next) => {
  try {
    let data;
    const { statusUser, _id: userId } = req.user;
    const { status } = req.body;
    const { orderId } = req.params;
    if (statusUser === "owner") {
      const { error } = changeStatusForOwnerOrderSchema.validate({ status });
      if (error) {
        throw HttpError(400, "Invalid format");
      }

      data = await changeStatusForOwnerOrder(orderId, status);
    } else if (statusUser === "user") {
      console.log(status);
      const { error } = cancelledByUserOrderSchema.validate({ status });
      if (error) {
        throw HttpError(400, "Invalid format");
      }

      data = await cancelledByUserOrder(orderId, userId);
    } else {
      throw HttpError(403, "user has not rights");
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getOrdersController = async (req, res, next) => {
  try {
    const { page, pageSize } = req.query;
    const { statusUser, _id: userId } = req.user;
    console.log(userId);
    const data = await getOrders(userId.toString(), statusUser, page, pageSize);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
