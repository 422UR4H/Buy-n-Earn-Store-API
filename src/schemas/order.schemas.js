import Joi from "@hapi/joi";
import { stripHtml } from "string-strip-html";

export const orderSchema = Joi.object({
    cardNumber: Joi.string().creditCard().required(),
    description: Joi.string().custom(v => stripHtml(v)).trim(),
    mail: Joi.string().custom(v => stripHtml(v)).trim().required(),
    idCart: Joi.string().custom(v => stripHtml(v)).trim().required()
});