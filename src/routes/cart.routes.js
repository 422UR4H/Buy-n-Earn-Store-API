import schemaValidate from "../middlewares/schemaValidate.js";
import { cartSchema } from "../schemas/cart.schemas.js";
import { Router } from "express";
import {
    createCart,
    getAllCarts,
    getCart,
    deleteCart,
    editCart
} from "../controllers/cart.controller.js";

const router = Router();

router.post("/cart", schemaValidate(cartSchema), createCart);
router.get("/carts", getAllCarts);
router.get("/cart/:id", getCart);
router.delete("/cart/:id", deleteCart);
router.put("/cart/:id", editCart);

export default router;