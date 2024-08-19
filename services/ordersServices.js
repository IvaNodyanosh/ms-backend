import { Order } from "../schemas/ordersSchemas.js";

import HttpError from "../generalFiles/HttpError.js";

export async function createOrder(userId, message, files) {
  return await Order.create({ userId, message, files });
}

export async function changeStatusForOwnerOrder(orderId, status) {
  return await Order.findByIdAndUpdate(orderId, { status }, { new: true });
}

export async function cancelledByUserOrder(orderId, id) {
  const { userId } = await Order.findById(orderId);

  if (userId.toString() === id.toString()) {
    return await Order.findByIdAndUpdate(
      orderId,
      {
        status: "cancelledUser",
      },
      { new: true }
    );
  }

  throw HttpError(403, "user has not rights");
}

export async function getOrders(userId, statusUser, page, pageSize) {
  const skipDocuments = (page - 1) * pageSize;
  if (statusUser === "owner") {
    const totalItems = await Order.countDocuments();
    const orders = await Order.find().skip(skipDocuments).limit(pageSize);

    return { totalItems, orders };
  } else {
    const totalItems = await Order.countDocuments({ userId });
    const orders = await Order.find({ userId })
      .skip(skipDocuments)
      .limit(pageSize);

    return { totalItems, orders };
  }
}
