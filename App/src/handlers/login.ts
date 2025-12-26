import { z } from 'zod';
import { User } from '../models/user';
import { apiHandler } from '../middlewares/apiHandler';

// Define the schema
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password is required"),
});

export const handler = apiHandler({ schema: loginSchema }, async (event, context, { body }) => {
    const { email, password } = body;

    // Business Logic via Model
    const user = await User.login({ email, password });

    if (!user) {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Invalid email or password' }),
        };
    }

    // Generate Token via Model
    const token = User.generateToken(user);

    return {
        statusCode: 200,
        body: JSON.stringify({
            token,
        }),
    };
});
