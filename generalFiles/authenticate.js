import HttpError from "./HttpError.js";
import jsonwebtoken from "jsonwebtoken";
import { User } from "../schemas/usersSchemas.js";
import { config } from "dotenv";

config();

const { SECRET_KEY } = process.env;

export const authenticate = async (req, __, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  try {
    if (bearer !== "Bearer") {
      next(HttpError(401));
    }

    const { id } = jsonwebtoken.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (!user || !user.token || user.token !== token) {
      next(HttpError(401));
    }

    if (user.statusUser === "block") {
      next(HttpError(403, "User is blocked"));
    }

    if (user.statusUser === "unregistered") {
      next(HttpError(403, "User is not register"));
    }

    req.user = user;

    next();
  } catch {
    next(HttpError(401));
  }
};

export const authenticateNotForUser = async (req, __, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  try {
    if (bearer !== "Bearer") {
      next(HttpError(401));
    }

    const { id } = jsonwebtoken.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (!user || !user.token || user.token !== token) {
      next(HttpError(401));
    }

    if (user.statusUser === "block") {
      next(HttpError(403, "User is blocked"));
    }

    if (user.statusUser === "user" || "unregistered") {
      next(HttpError(403, "user has not rights"));
    }


    req.user = user;

    next();
  } catch {
    next(HttpError(401));
  }
};

export const authenticateForAdmin = async (req, __, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  try {
    if (bearer !== "Bearer") {
      next(HttpError(401));
    }

    const { id } = jsonwebtoken.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (!user || !user.token || user.token !== token) {
      next(HttpError(401));
    }

    if (user.statusUser !== "admin") {
      next(HttpError(403, "user has not rights"));
    }

    req.user = user;

    next();
  } catch {
    next(HttpError(401));
  }
};
