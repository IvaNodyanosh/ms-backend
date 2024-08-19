import express from "express";

import { createOrderController, registerOrderController, changeStatusOrderController, getOrdersController } from "../controllers/ordersControllers.js";
import { upload } from "../generalFiles/uploadFilles.js";

import { authenticate } from "../generalFiles/authenticate.js";

const ordersRouter = express.Router();

ordersRouter.post("/", upload.array("files"), createOrderController);
ordersRouter.patch("/:orderId", authenticate, changeStatusOrderController);
ordersRouter.post("/register", authenticate, upload.array('files'), registerOrderController);
ordersRouter.get("/", authenticate, getOrdersController);

export default ordersRouter;