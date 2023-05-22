const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Utils = require('../config/constants.config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'name required',
    },
    email: {
        type: String,
        required: 'email required',
        match: [Utils.emailPattern, 'Email format invalid']
    },
    password: {
        type: String,
        required: 'password required',
        match: [Utils.passwordPattern, 'Password should have at least 8 characters']
    },
    bio: {
        type: String,
    },
    active: {
        type: Boolean,
        default: false,
    },
    activationId: {
        type: String,
    }
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = doc._id;
            delete ret._id;
            delete ret.__v;
            delete ret.password;
            // delete ret.activationId; (enabled only for actividad-cuatro, BUT, we should hide this id for prod)
    
            return ret
        }
    },    
});

userSchema.pre('save',  function (next) {
    if (this.isModified('password')) {
        bcrypt.hash(this.password, Utils.bcryptSalt).then((hash) => {
            this.password = hash;
            next();
        });
    } else {
        next();
    }
});

userSchema.methods.checkPassword = function (passwordToCheck) {
    return bcrypt.compare(passwordToCheck, this.password);
};

module.exports = mongoose.model('User', userSchema);