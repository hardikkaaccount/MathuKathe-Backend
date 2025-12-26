import { User } from '../models/user';
import { hashPassword } from '../utils/password';

export async function testRegistration() {
    const randomId: string = Math.random().toString(36).substring(7);
    const email: string = `test_${randomId}@example.com`;
    const plainPassword = `secret_${randomId}`; // Define plainPassword for User.register
    const passwordHash: string = await hashPassword(plainPassword); // Keep passwordHash for potential other uses or if User.register still needs it, but the instruction implies plain password.
    const displayName: string = `Tester ${randomId}`;

    console.log(`Attempting to create user: ${email}`);

    // 3. Call User.register
    try {
        const user = await User.register({
            email,
            display_name: displayName,
            password: plainPassword // Use the plain password for User.register
        });

        console.log('User created:', user);
        if (user && user.id) {
            console.log('SUCCESS: User created with ID ' + user.id);
            process.exit(0);
        } else {
            console.error('FAILURE: No ID returned');
            process.exit(1);
        }
    } catch (err: any) {
        console.error('ERROR:', err);
        process.exit(1);
    }
}
