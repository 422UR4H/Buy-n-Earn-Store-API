import { Router } from "express";
import {
    createOrder,
    getAllOrders,
    getOrder,
    deleteOrder,
    editOrder
} from "../controllers/order.controller.js";

const router = Router();

router.post("/order", createOrder);
router.get("/orders", getAllOrders);
router.get("/order/:id", getOrder);
router.delete("/order/:id", deleteOrder);
router.put("/order/:id", editOrder);

export default router;