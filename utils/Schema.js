const Joi = require('joi');

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().allow(""),
        image: Joi.string().allow("", null),
        price: Joi.number().required(),
        country: Joi.string().required(),
        location: Joi.string().required()
    }).required()
});

module.exports.listingSchema = listingSchema;

const reviewSchema = Joi.object({
    review: Joi.object({
        rating:Joi.number().required(),
        comment: Joi.string().required()
   }).required()
}).prefs({ convert: true }); 

module.exports.reviewSchema = reviewSchema;