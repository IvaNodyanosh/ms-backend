import { Order } from "../schemas/ordersSchemas.js";
import { Review } from "../schemas/reviewsSchemas.js";
import HttpError from "../generalFiles/HttpError.js";

export async function createReview(user, orderId, comment, files) {
  const order = await Order.findById(orderId);

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

export async function getMediaReview(filter, page, pageSize) {
  const reviews = await Review.find();

  const data = [];

  const per = (page - 1) * pageSize;
  const last = per + Number(pageSize);

  console.log({ per, last, page });

  reviews.map(function (review) {
    if (review.comment.includes(filter)) {
      data.push(...review.files);
    }
  });

  return { totalItems: data.length, items: data.slice(per, last) };
}
