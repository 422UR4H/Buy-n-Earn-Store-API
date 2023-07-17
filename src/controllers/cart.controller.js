import { mongoClient } from "../database/db.connection.js";
import { ObjectId } from "mongodb";
import handleApiError from "../scripts/handleApiError.js";
import dayjs from "dayjs";


export async function createCart(req, res) {
    const { body, session } = res.locals;
    const { userId } = session;

    try {
        const db = (await mongoClient.connect()).db();
        const timestamp = dayjs().valueOf();
        await db.collection("carts").insertOne({ ...body, userId, timestamp });
        res.sendStatus(201);
    } catch (err) {
        handleApiError(err);
        res.status(500).send(err.message);
    } finally {
        await mongoClient.close();
    }
}

export async function getAllCarts(req, res) {
    const { userId } = res.locals.session;

    try {
        const db = (await mongoClient.connect()).db();
        const carts = await db
            .collection("carts")
            .find({ userId })
            .sort({ _id: -1 })
            .toArray();

        res.send(carts);
    } catch (err) {
        handleApiError(err);
        res.status(500).send(err.message);
    } finally {
        await mongoClient.close();
    }
}

export async function getCart(req, res) {
    const { userId } = res.locals.session;
    const { cartId } = res.locals;

    try {
        const db = (await mongoClient.connect()).db();
        const cart = await db.collection("carts").findOne({ _id: new ObjectId(cartId) });

        if (!cart) return res.sendStatus(404);
        if (userId.toString() !== cart.userId.toString()) return res.sendStatus(401);

        res.send(cart);
    } catch (err) {
        handleApiError(err);
        res.status(500).send(err.message);
    } finally {
        await mongoClient.close();
    }
}

export async function deleteCart(req, res) {
    const { userId } = res.locals.session;
    const { cartId } = res.locals;

    try {
        const db = (await mongoClient.connect()).db();
        const cart = await db.collection("carts").findOne({ _id: new ObjectId(cartId) });

        if (!cart) return res.sendStatus(404);
        if (userId.toString() !== cart.userId.toString()) return res.sendStatus(401);

        const result = await db.collection("carts").deleteOne({ _id: new ObjectId(cartId) });
        if (result.deletedCount === 0) return res.sendStatus(409); // conflict

        res.sendStatus(204);
    } catch (err) {
        handleApiError(err);
        res.status(500).send(err.message);
    } finally {
        await mongoClient.close();
    }
}

export async function editCart(req, res) {
    const { cartId, body, session } = res.locals;
    const { userId } = session;

    try {
        const db = (await mongoClient.connect()).db();
        const cart = await db.collection("carts").findOne({ _id: new ObjectId(cartId) });

        if (!cart) return res.sendStatus(404);
        if (userId.toString() !== cart.userId.toString()) return res.sendStatus(401);

        const result = await db.collection("carts").updateOne(
            { _id: new ObjectId(cartId), userId },
            { $set: { ...body } }
        );
        if (result.matchedCount === 0) return res.sendStatus(409);

        res.sendStatus(200);
    } catch (err) {
        handleApiError(err);
        res.status(500).send(err.message);
    } finally {
        await mongoClient.close();
    }
}