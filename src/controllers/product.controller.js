import { mongoClient } from "../database/db.connection.js";
import handleApiError from "../scripts/handleApiError.js";
import { ObjectId } from "mongodb";


export async function createProduct(req, res) {
    const { body } = res.locals;
    try {
        const db = (await mongoClient.connect()).db();
        await db.collection("products").insertOne({ ...body });
        res.sendStatus(201);
    } catch (err) {
        handleApiError(err);
        res.status(500).send(err.message);
    }
}

export async function getAllProducts(req, res) {
    try {
        const db = (await mongoClient.connect()).db();
        res.send(await db.collection("products").find().sort({ _id: -1 }).toArray());
    } catch (err) {
        handleApiError(err);
        res.status(500).send(err.message);
    }
}

export async function getProduct(req, res) {
    const { productId } = res.locals;
    try {
        const db = (await mongoClient.connect()).db();
        const product = await db.collection("products").findOne({ _id: new ObjectId(productId) });
        if (!product) return res.sendStatus(404);
        res.send(product);
    } catch (err) {
        handleApiError(err);
        res.status(500).send(err.message);
    }
}

export async function deleteProduct(req, res) {
    const { productId } = res.locals;

    try {
        const db = (await mongoClient.connect()).db();
        const product = await db.collection("products").findOne({ _id: new ObjectId(productId) });
        if (!product) return res.sendStatus(404);

        const result = await db.collection("products").deleteOne({ _id: new ObjectId(productId) });
        if (result.deletedCount === 0) return res.sendStatus(409);

        res.sendStatus(204);
    } catch (err) {
        handleApiError(err);
        res.status(500).send(err.message);
    }
}

export async function editProduct(req, res) {
    const { productId, body } = res.locals;

    try {
        const db = (await mongoClient.connect()).db();
        const product = await db.collection("products").findOne({ _id: new ObjectId(productId) });
        if (!product) return res.sendStatus(404);

        const result = await db.collection("products").updateOne(
            { _id: new ObjectId(productId) },
            { $set: { ...body } }
        );
        if (result.matchedCount === 0) return res.sendStatus(409);

        res.sendStatus(200);
    } catch (err) {
        handleApiError(err);
        res.status(500).send(err.message);
    }
}