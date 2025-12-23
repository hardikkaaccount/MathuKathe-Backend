import { User } from '../models/user';
import { hashPassword } from '../utils/password';

export async function testRegistration() {
    const randomId: string = Math.random().toString(36).substring(7);
    const email: string = `test_${randomId}@example.com`;
    const passwordHash: string = await hashPassword(`hashed_secret_${randomId}`);
    const displayName: string = `Tester ${randomId}`;

    console.log(`Attempting to create user: ${email}`);

    try {
        const user = await User.create({
            email,
            display_name: displayName,
            password_hash: passwordHash
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
