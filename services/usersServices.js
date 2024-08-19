import { User } from "../schemas/usersSchemas.js";

import HttpError from "../generalFiles/HttpError.js";

import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

import { config } from "dotenv";

config();

const { SECRET_KEY } = process.env;

export async function register(userInform, verificationToken) {
  const { name, surname, phone, email, password } = userInform;
  const user = await User.findOne({ "email.email": email });
  const hashPassword = await bcrypt.hash(password, 10);

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const data = await User.create({
    email: {
      email,
      verificationToken,
    },
    password: hashPassword,

    name,
    surname,
    phone,
  });

  return data;
} //ok

export async function login(userInform) {
  const { email, password } = userInform;
  const user = await User.findOne({ "email.email": email });

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!user || !passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.email.isVerify) {
    throw HttpError(401, "Email is not verify");
  }

  const payload = { id: user._id };

  const token = jsonwebtoken.sign(payload, SECRET_KEY, {
    expiresIn: "23h",
  });

  return await User.findOneAndUpdate({ _id: user._id }, { token }, {new: true});
  
} //ok

export async function logout(_id) {
  return await User.findByIdAndUpdate(_id, { token: "" }, { new: true });
} //ok

export async function changeStatusUser(id, status) {
  const { statusUser } = await User.findById(id);
  if (statusUser === "admin" || "owner") {
    return "user has not rights";
  }
  return await User.findByIdAndUpdate(
    id,
    { statusUser: status },
    { new: true }
  );
} //ok

export async function changeAvatar(id, avatarURL) {
  return await User.findByIdAndUpdate(
    id,
    { avatarUrl: avatarURL },
    { new: true }
  );
} //ok

export async function verifyEmail(verificationToken) {
  const user = await User.findOne({
    "email.verificationToken": verificationToken,
  });

  const data = { isError: false, message: "" };

  if (!user) {
    data.isError = true;
    data.message = "User not found";
    return data;
  } else if (user.statusUser === "block") {
    data.isError = true;
    data.message = "The user is blocked";
    return data;
  }

  const userUpdate = await User.findOneAndUpdate(
    { "email.verificationToken": verificationToken },
    {
      "email.verificationToken": null,
      "email.isVerify": true,
    }
  );

  if (userUpdate) {
    data.message = "Verification successful";
    return data;
  }
} //ok

export async function repeatedVerifyEmail(email) {
  const user = await User.findOne({ "email.email": email });
  const data = { isError: false, message: "" };

  if (!user) {
    data.isError = true;
    data.message = "User not found";
    return data;
  } else if (user.statusUser === "block") {
    data.isError = true;
    data.message = "The user is blocked";
  } else if (user.email.isVerify) {
    data.isError = true;
    data.message = "Verification has already been passed";
    return data;
  }

  data.token = user.verificationToken;
  data.message = "Verification email sent";

  return data;
} // ok

export async function recoveryPassword(email, recoveryToken) {
  const user = await User.findOne({ "email.email": email });
  const data = { isError: false, message: "", token: "" };

  if (!user) {
    data.isError = true;
    data.message = "User not found";
    return data;
  } else if (user.statusUser === "block") {
    data.isError = true;
    data.message = "The user is blocked";
    return data;
  }
  if (user.statusUser === "unregistered") {
    data.isError = true;
    data.message = "The user is not register";
    return data;
  }

  const userUpdate = await User.findOneAndUpdate(
    { "email.email": email },
    {
      recoveryToken: recoveryToken,
    }
  );

  if (userUpdate) {
    data.message = "Recovery email sended";
    data.token = recoveryToken;
  }

  return data;
}

export async function changePassword(recoveryToken, password) {
  const user = await User.findOne({
    recoveryToken,
  });

  const data = { isError: false, message: "" };
  const hashPassword = await bcrypt.hash(password, 10);

  if (!user) {
    data.isError = true;
    data.message = "User not found";
    return data;
  } else if (user.statusUser === "block") {
    data.isError = true;
    data.message = "The user is blocked";
    return data;
  }

  const userUpdate = await User.findOneAndUpdate(
    { recoveryToken },
    {
      "email.isVerify": true,
      "email.verificationToken": null,
      password: hashPassword,
      recoveryToken: null,
    }
  );

  if (userUpdate) {
    data.message = "Reset password successful";
  }

  return data;
}

export async function getAllUsers() {
  return await User.find({});
}

export async function getUser(id) {
  return await User.findById(id);
}

export async function deleteUser(id) {
  const data = await User.findByIdAndDelete(id);

  if (data) {
    return { message: "User deleted" };
  }
}

export async function deleteCurrentUser(id) {
  const data = await User.findByIdAndDelete(id);

  if (data) {
    return { message: "User deleted" };
  }
}

export async function createUser(userInform, verificationToken) {
  const { name, surname, phone, email } = userInform;
  const user = await User.findOne({ "email.email": email });

  if (!user) {
    const data = await User.create({
      name,
      surname,
      phone,
      email: {
        email,
        verificationToken,
      },
      statusUser: "unregistered",
    });

    return data;
  }

  if (user.statusUser === "unregistered") {
    return user;
  }

  throw HttpError(409, "Email is registered");
}

export async function createPassword(token, password) {
  const user = await User.findOne({ "email.verificationToken": token });

  if (user.statusUser !== "unregistered") {
    throw HttpError(409, "Email is registered");
  }

  const data = await User.findOneAndUpdate(
    {
      "email.verificationToken": token,
    },
    {
      email: {
        verificationToken: null,
        isVerify: true,
      },
      statusUser: "user",
      password,
    }
  );

  return data;
}

