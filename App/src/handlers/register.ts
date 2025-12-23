import { APIGatewayProxyHandler } from 'aws-lambda';
import { User } from '../models/user';
import { hashPassword } from '../utils/password';

export const handler: APIGatewayProxyHandler = async (event) => {
    try {
        const { input } = JSON.parse(event.body || '{}');

        // Hasura wraps arguments in an 'input' object, and our argument is named 'input'
        const { email, display_name, password } = input?.input || {};

        if (!email || !display_name || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required fields: email, display_name, password' }),
            };
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            email,
            display_name,
            password_hash: hashedPassword,
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                user_id: user.id,
            }),
        };
    } catch (error: any) {
        console.error('Error creating user:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message || 'Internal Server Error',
                stack: error.stack,
                debug: {
                    hasura_id_exists: !!process.env.HASURA_GRAPHQL_ID,
                    hasura_secret_exists: !!process.env.HASURA_ADMIN_SECRET,
                },
            }),
        };
    }
};
