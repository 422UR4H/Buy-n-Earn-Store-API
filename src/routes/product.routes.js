import { Router } from "express";
import {
    createProduct,
    getAllProducts,
    getProduct,
    deleteProduct,
    editProduct
} from "../controllers/product.controller.js";

const router = Router();

router.post("/product", createProduct);
router.get("/products", getAllProducts);
router.get("/product/:id", getProduct);
router.delete("/product/:id", deleteProduct);
router.put("/product/:id", editProduct);

export default router;