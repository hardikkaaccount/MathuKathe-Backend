import { User } from "../models/user";
import { verifyPassword } from "../utils/password";

export async function testLogin() {
    const user = await User.findByEmail("a@b.com");
    if (!user) {
        console.log("user not found");
        process.exit(1);
    }

    const isValidPassword = await verifyPassword("1a", user.password_hash);
    if (!isValidPassword) {
        console.log("invalid password");
        process.exit(1);
    }

    console.log("login successful");
    process.exit(0);


}