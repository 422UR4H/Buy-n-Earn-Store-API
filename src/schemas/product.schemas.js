import { stripHtml } from "string-strip-html";
import Joi from "@hapi/joi";

export const productSchema = Joi.object({
    type: Joi.string().custom(v => stripHtml(v)).valid("premium", "classic", "smashes", "tradicional", ),
    name: Joi.string().min(3).max(30).custom(v => stripHtml(v)).trim().required(),
    description: Joi.string().custom(v => stripHtml(v)).trim(),
    linkPng: Joi.string().uri().required(),
    linkJpg: Joi.string().uri().required(),
    value: Joi.number().required()
});