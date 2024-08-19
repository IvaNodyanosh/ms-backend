import { Order } from "../schemas/ordersSchemas.js";
import { Review } from "../schemas/reviewsSchemas.js";
import HttpError from "../generalFiles/HttpError.js";
import { User } from "../schemas/usersSchemas.js";

export async function createReview(orderId, comment, files) {
  const order = await Order.findById(orderId);
  const user = await User.findById(order.userId);

  if (user.statusUser === "block") {
    throw HttpError(403, "user is blocked");
  } else if (user.statusUser === "user" || user.statusUser === "unregistered") {
    if (!order) {
      throw HttpError(404);
    } else if (order.status === "completed") {
      return await Review.create({
        orderId,
        comment,
        files,
      });
    }

    throw HttpError(403, "user has not rights");
  } else if (user.statusUser === "owner") {
    return await Review.create({
      orderId,
      comment,
      files,
    });
  }
}