export default function schemaValidate(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false });

        if (error) return res.status(422).send(error.details.map(d => d.message));

        res.locals.body = value;
        next();
    };
}