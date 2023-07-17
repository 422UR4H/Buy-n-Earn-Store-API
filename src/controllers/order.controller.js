import { mongoClient } from "../database/db.connection.js";
import dayjs from "dayjs";
import handleApiError from "../scripts/handleApiError.js";
import { ObjectId } from "mongodb";


export async function createOrder(req, res) {
    const { body, session } = res.locals;
    const { userId } = session;

    try {
        const db = (await mongoClient.connect()).db();
        const timestamp = dayjs().valueOf();
        await db.collection("orders").insertOne({ ...body, userId, timestamp });
        res.sendStatus(201);
    } catch (err) {
        handleApiError(err);
        res.status(500).send(err.message);
    } finally {
        await mongoClient.close();
    }
}

export async function getAllOrders(req, res) {
    const { userId } = res.locals.session;

    try {
        const db = (await mongoClient.connect()).db();
        const orders = await db
            .collection("orders")
            .find({ userId })
            .sort({ _id: -1 })
            .toArray();

        res.send(orders);
    } catch (err) {
        handleApiError(err);
        res.status(500).send(err.message);
    } finally {
        await mongoClient.close();
    }
}

export async function getOrder(req, res) {
    const { userId } = res.locals.session;
    const { orderId } = res.locals;

    try {
        const db = (await mongoClient.connect()).db();
        const order = await db.collection("orders").findOne({ _id: new ObjectId(orderId) });

        if (!order) return res.sendStatus(404);
        if (userId.toString() !== order.userId.toString()) return res.sendStatus(401);

        res.send(order);
    } catch (err) {
        handleApiError(err);
        res.status(500).send(err.message);
    } finally {
        await mongoClient.close();
    }
}

export async function deleteOrder(req, res) {
    const { userId } = res.locals.session;
    const { orderId } = res.locals;

    try {
        const db = (await mongoClient.connect()).db();
        const order = await db.collection("orders").findOne({ _id: new ObjectId(orderId) });

        if (!order) return res.sendStatus(404);
        if (userId.toString() !== order.userId.toString()) return res.sendStatus(401);

        const result = await db.collection("orders").deleteOne({ _id: new ObjectId(orderId), userId });
        if (result.deletedCount === 0) return res.status(409).send("Conflito");

        res.sendStatus(204);
    } catch (err) {
        handleApiError(err);
        res.status(500).send(err.message);
    } finally {
        await mongoClient.close();
    }
}

export async function editOrder(req, res) {
    const { orderId, body, session } = res.locals;
    const { userId } = session;

    try {
        const db = (await mongoClient.connect()).db();
        const order = await db.collection("orders").findOne({ _id: new ObjectId(orderId) });

        if (!order) return res.sendStatus(404);
        if (userId.toString() !== order.userId.toString()) return res.sendStatus(401);

        const result = await db.collection("orders").updateOne(
            { _id: new ObjectId(orderId), userId },
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