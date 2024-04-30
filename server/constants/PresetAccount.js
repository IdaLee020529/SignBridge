const bcrypt = require("bcrypt");

const PRESET_ACCOUNTS = [
    {
        username: "admin",
        email: "admin@gmail.com",
        password: bcrypt.hashSync("123456", 10),
        picture: "./images/admin-profile.png",
        acc_type: "traditional",
        role_access: "admin",
        email_verified: true,
    },
    {
        username: "signexpert",
        email: "signexpert@gmail.com",
        password: bcrypt.hashSync("123456", 10),
        picture: "./images/sign-expert-profile.png",
        acc_type: "traditional",
        role_access: "signexpert",
        email_verified: true,
    },
];

module.exports = {
    PRESET_ACCOUNTS
}