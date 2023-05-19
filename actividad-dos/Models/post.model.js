const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        minLength: 5,
        required: true,
    },
    text: {
        type: String,
        minLength: 5,
        required: true,
    },
    author: {
        type: String,
        required: true,
        default: 'Jose Manuel',
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

module.exports = mongoose.model('Post', postSchema);