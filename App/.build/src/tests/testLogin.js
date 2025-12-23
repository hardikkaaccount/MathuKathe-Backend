"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testLogin = testLogin;
const user_1 = require("../models/user");
const password_1 = require("../utils/password");
async function testLogin() {
    const user = await user_1.User.findByEmail("a@b.com");
    if (!user) {
        console.log("user not found");
        process.exit(1);
    }
    const isValidPassword = await (0, password_1.verifyPassword)("1a", user.password_hash);
    if (!isValidPassword) {
        console.log("invalid password");
        process.exit(1);
    }
    console.log("login successful");
    process.exit(0);
}
//# sourceMappingURL=testLogin.js.map