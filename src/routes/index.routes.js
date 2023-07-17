import { Router } from "express";
import cartRouter from "./cart.routes.js";
import orderRouter from "./order.routes.js";
import productRouter from "./product.routes.js";

const router = Router();

router.use(cartRouter);
router.use(orderRouter);
router.use(productRouter);

export default router;