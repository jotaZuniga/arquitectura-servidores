const UTILS = {
    emailPattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    passwordPattern: /^.{8,}$/,
    bcryptSalt: 10,
};

module.exports = UTILS;