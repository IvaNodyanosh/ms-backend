import {
  registerSchema,
  loginSchema,
  logoutSchema,
  changeStatusUserSchema,
  changeStatusUserForOwnerSchema,
  emailValidateSchema,
  changePasswordSchema,
  verifyEmailSchema,
} from "../schemas/usersSchemas.js";

import {
  register,
  logout,
  login,
  changeStatusUser,
  changeAvatar,
  verifyEmail,
  repeatedVerifyEmail,
  recoveryPassword,
  changePassword,
  getAllUsers,
  getUser,
  deleteUser,
  createPassword,
} from "../services/usersServices.js";

import { __dirname } from "../generalFiles/variables.js";

import Jimp from "jimp";

import { nanoid } from "nanoid";

import HttpError from "../generalFiles/HttpError.js";
import {
  sendEmailVerification,
  sendEmailRecoveryPassword,
} from "../generalFiles/sendEmails.js";

import { config } from "dotenv";

config();

const BACK_URL = process.env.BACK_URL;

import fs from "fs/promises";

import path from "path";

export const registerController = async (req, res, next) => {
  const verificationToken = nanoid();

  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const data = await register(req.body, verificationToken);

    await sendEmailVerification(data.email.email, data.email.verificationToken);

    res.status(201).json({
      user: {
        name: data.name,
        surname: data.surname,
        email: data.email.email,
      },
    });
  } catch (error) {
    next(error);
  }
}; //ok

export const loginController = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }

    const data = await login(req.body);

    if (data === "Email or password is wrong") {
      throw HttpError(401, "Email or password is wrong");
    } else if (data === "Email is not verify") {
      throw HttpError(401, "Email is not verify");
    } else if (data.statusUser) {
      const { name, surname, avatarUrl, statusUser, token } = data;
      res.status(200).json({
        name,
        surname,
        avatarUrl,
        statusUser,
        token,
      });
    }
  } catch (error) {
    next(error);
  }
}; //ok

export const currentController = async (req, res) => {
  const { name, surname, statusUser, token, avatarUrl } = req.user;

  res.status(200).json({ name, surname, statusUser, token, avatarUrl });
}; //ok

export const logoutController = async (req, res, next) => {
  const { _id: id } = req.user;

  try {
    const { error } = logoutSchema.validate({ id });
    if (error) {
      throw HttpError(400, error.message);
    }
    await logout(id);

    res.status(204).json({ message: "logout success" });
  } catch (error) {
    next(error);
  }
}; //ok

export const changeStatusUserController = async (req, res, next) => {
  const { error } = changeStatusUserSchema.validate(req.body);

  if (error) {
    throw HttpError(400, error.message);
  }

  const { statusUser } = req.user;
  const { status, id } = req.body;

  try {
    let data = null;
    if (statusUser === "admin") {
      const { error } = changeStatusUserSchema.validate(req.body);

      if (error) {
        throw HttpError(400, error.message);
      }
      data = await changeStatusUser(id, status);
    } else if (statusUser === "owner") {
      const { error } = changeStatusUserForOwnerSchema.validate(req.body);

      if (error) {
        throw HttpError(400, error.message);
      }
      data = await changeStatusUser(id, status);
    } else {
      throw HttpError(403, "user has not rights");
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}; //ok

export const changeAvatarController = async (req, res, next) => {
  const { _id: id, avatarUrl } = req.user;
  const { path: temporaryName, mimetype } = req.file;
  const [__, typeFile] = mimetype.split("/");
  const nameFile = `${id}_avatar.${typeFile}`;
  const avatarSrc = path.join(__dirname, `../public/avatars/${nameFile}`);

  const avatarURL = `${BACK_URL}avatars/${nameFile}`;

  try {
    if (typeFile !== "png" && typeFile !== "jpeg") {
      fs.unlink(temporaryName);
      throw HttpError(400, "Invalid format file");
    }

    const { avatarUrl: url } = await changeAvatar(id, avatarURL);

    Jimp.read(temporaryName, (err, img) => {
      if (err) next(err);
      img.write(avatarSrc); // save
    });

    fs.unlink(temporaryName);

    res.status(200).json({ url });
  } catch (error) {
    next(error);
  }
}; //ok

export const verifyEmailController = async (req, res, next) => {
  const { verificationToken } = req.params;

  try {
    const { error } = verifyEmailSchema.validate({ verificationToken });

    if (error) {
      throw HttpError(400, error.message);
    }

    const { isError, message } = await verifyEmail(verificationToken);

    if (isError) {
      throw HttpError(404, message);
    }

    res.status(200).json({
      message,
    });
  } catch (error) {
    next(error);
  }
}; //ok

export const repeatedVerifyEmailController = async (req, res, next) => {
  try {
    const { error } = emailValidateSchema.validate(req.body);
    const { email } = req.body;

    if (error) {
      throw HttpError(400, error.message);
    }

    const { isError, message, token } = await repeatedVerifyEmail(email);

    if (isError) {
      throw HttpError(404, message);
    }

    await sendEmailVerification(email, token);

    res.status(200).json({ message });
  } catch (error) {
    next(error);
  }
}; //ok

export const recoveryPasswordController = async (req, res, next) => {
  try {
    const { error } = emailValidateSchema.validate(req.body);
    const { email } = req.body;
    const recoveryToken = nanoid();

    if (error) {
      throw HttpError(400, error.message);
    }

    const { isError, message, token } = await recoveryPassword(
      email,
      recoveryToken
    );

    if (isError) {
      throw HttpError(404, message);
    }

    await sendEmailRecoveryPassword(email, token);

    res.status(200).json({ message });
  } catch (error) {
    next(error);
  }
};

export const changePasswordController = async (req, res, next) => {
  try {
    const { recoveryToken } = req.params;
    const { password } = req.body;

    const { error } = changePasswordSchema.validate({
      recoveryToken,
      password,
    });

    if (error) {
      throw HttpError(400, error.message);
    }

    const { isError, message } = await changePassword(recoveryToken, password);

    if (isError) {
      throw HttpError(400, message);
    }

    res.status(200).json({ message });
  } catch (error) {
    next(error);
  }
};

export const getAllUsersController = async (__, res, next) => {
  try {
    const data = await getAllUsers();

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getUserController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await getUser(id);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteUserController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await deleteUser(id);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteCurrentUserController = async (req, res, next) => {
  try {
    const { _id: id } = req.user;
    const data = await deleteUser(id);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const createPasswordController = async (req, res, next) => {
  try {
    const { verificationToken: token } = req.params;
    const { password } = req.body;

    const data = await createPassword(token, password);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
