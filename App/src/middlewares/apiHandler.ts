import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ZodSchema } from 'zod';

interface ApiHandlerOptions<T> {
    schema?: ZodSchema<T>;
    requireAuth?: boolean;
}

type ValidatedHandler<T> = (
    event: APIGatewayProxyEvent,
    context: Context,
    args: {
        body: T;
        user_id?: string;
    }
) => Promise<APIGatewayProxyResult>;

export const apiHandler = <T = any>(
    options: ApiHandlerOptions<T>,
    handler: ValidatedHandler<T>
) => {
    return async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
        try {
            // 1. Parse Input
            const { input, session_variables } = JSON.parse(event.body || '{}');
            const rawArgs = input?.input || {};
            const userId = session_variables?.['x-hasura-user-id'];

            // 2. Auth Check
            if (options.requireAuth && !userId) {
                return {
                    statusCode: 401,
                    body: JSON.stringify({ message: "Unauthorized" }),
                };
            }

            // 3. Validation
            let validatedBody: T = rawArgs;
            if (options.schema) {
                const validationResult = options.schema.safeParse(rawArgs);
                if (!validationResult.success) {
                    return {
                        statusCode: 400,
                        body: JSON.stringify({
                            message: 'Validation failed',
                            errors: validationResult.error.format(),
                        }),
                    };
                }
                validatedBody = validationResult.data;
            }

            // 4. Exec Logic
            return await handler(event, context, { body: validatedBody, user_id: userId });

        } catch (error: any) {
            console.error('API Handler Error:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: error.message || 'Internal Server Error',
                }),
            };
        }
    };
};
