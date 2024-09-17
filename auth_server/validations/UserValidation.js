const Joi = require('joi');

module.exports={
    createUser: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        name: Joi.string().required(),
    })
}
