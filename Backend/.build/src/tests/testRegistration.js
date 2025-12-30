"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRegistration = testRegistration;
const user_1 = require("../models/user");
const password_1 = require("../utils/password");
async function testRegistration() {
    const randomId = Math.random().toString(36).substring(7);
    const email = `test_${randomId}@example.com`;
    const passwordHash = await (0, password_1.hashPassword)(`hashed_secret_${randomId}`);
    const displayName = `Tester ${randomId}`;
    console.log(`Attempting to create user: ${email}`);
    try {
        const user = await user_1.User.create({
            email,
            display_name: displayName,
            password_hash: passwordHash
        });
        console.log('User created:', user);
        if (user && user.id) {
            console.log('SUCCESS: User created with ID ' + user.id);
            process.exit(0);
        }
        else {
            console.error('FAILURE: No ID returned');
            process.exit(1);
        }
    }
    catch (err) {
        console.error('ERROR:', err);
        process.exit(1);
    }
}
//# sourceMappingURL=testRegistration.js.map