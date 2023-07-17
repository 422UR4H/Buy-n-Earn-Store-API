import Joi from "@hapi/joi";
import { stripHtml } from "string-strip-html";

export const cartSchema = Joi.object({
    name: Joi.string().custom(value => stripHtml(value)).trim().min(3).max(30).required(),
    value: Joi.number().required(),
    linkJpg: Joi.string().custom(value => stripHtml(value)).uri(),
    weight: Joi.string().custom(value => stripHtml(value)).trim().max(30),
    point: Joi.string().custom(value => stripHtml(value)).trim().max(20)
});