import { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: 'Bye! Serverless Typescript function executed successfully!',
                input: event,
            },
            null,
            2
        ),
    };
};
