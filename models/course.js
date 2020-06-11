const {Schema, model} = require('mongoose')

const course = new Schema({
    title: {
        type: String,
        required: true,
        maxlength: 30,
        minlength: 3
    },
    price: {
        type: Number,
        required: true,
        max: 10000,
        min: 1
    },
    img: String
})

module.exports = model('Course', course)