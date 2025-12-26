import { z } from 'zod';
import { User } from '../models/user';
import { apiHandler } from '../middlewares/apiHandler';

// Define the schema
const registerSchema = z.object({
    email: z.string().email(),
    display_name: z.string().min(1, "Display name is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const handler = apiHandler({ schema: registerSchema }, async (event, context, { body }) => {
    const { email, display_name, password } = body;

    // Business Logic via Model
    const user = await User.register({
        email,
        display_name,
        password
    });

    return {
        statusCode: 200,
        body: JSON.stringify({
            user_id: user.id,
        }),
    };
});
