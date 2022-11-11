const mongoose = require('mongoose');
const Joi = require('joi');

const messengerSchema = new mongoose.Schema({
    person_id: String,
    message_id:{
        type: Array, default:[]
    },
    date_created:{
        type:Date, default:Date.now()
    }
});

exports.MessengerModel = mongoose.model("messangers" , messengerSchema);

exports.validMessanger= (_messengerBody) => {
    let JoiSchema = Joi.object({
        person_id:Joi.string().min(1).max(),
        message_id:Joi.array().min(1),
    })

    return JoiSchema.validate(_messengerBody);
};