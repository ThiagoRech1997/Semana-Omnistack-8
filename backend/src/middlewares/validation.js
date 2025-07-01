const Joi = require('joi');

// Schema de validação para criação de Dev
const devSchema = Joi.object({
    username: Joi.string().required().min(1).max(39).pattern(/^[a-zA-Z0-9-]+$/),
});

// Schema de validação para likes/dislikes
const interactionSchema = Joi.object({
    devId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/),
});

// Middleware de validação genérico
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: 'Dados inválidos',
                details: error.details.map(detail => detail.message)
            });
        }
        next();
    };
};

// Middleware de validação para parâmetros
const validateParams = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.params);
        if (error) {
            return res.status(400).json({
                error: 'Parâmetros inválidos',
                details: error.details.map(detail => detail.message)
            });
        }
        next();
    };
};

module.exports = {
    validate,
    validateParams,
    devSchema,
    interactionSchema
}; 