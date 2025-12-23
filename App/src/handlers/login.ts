import { APIGatewayProxyHandler } from 'aws-lambda';
import { User } from '../models/user';
import { verifyPassword } from '../utils/password';
import * as jwt from 'jsonwebtoken';

export const handler: APIGatewayProxyHandler = async (event) => {
    try {
        const { input } = JSON.parse(event.body || '{}');
        // Hasura wraps arguments in an 'input' object, and our argument is named 'input'
        const { email, password } = input?.input || {};

        if (!email || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required fields: email, password' }),
            };
        }

        const user = await User.findByEmail(email);

        if (!user) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Invalid email or password' }),
            };
        }

        const isValidPassword = await verifyPassword(password, user.password_hash);

        if (!isValidPassword) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Invalid email or password' }),
            };
        }

        const HASURA_GRAPHQL_JWT_SECRET = process.env.HASURA_JWT_SECRET || 'secret';

        const token = jwt.sign(
            {
                'https://hasura.io/jwt/claims': {
                    'x-hasura-allowed-roles': ['user'],
                    'x-hasura-default-role': 'user',
                    'x-hasura-user-id': user.id,
                },
            },
            HASURA_GRAPHQL_JWT_SECRET,
            { expiresIn: '1h' }
        );

        return {
            statusCode: 200,
            body: JSON.stringify({
                token,
            }),
        };
    } catch (error: any) {
        console.error('Error logging in:', error);
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
