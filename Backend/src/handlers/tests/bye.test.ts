
import { handler } from '../bye';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

describe('Bye Handler', () => {
    it('should return 200 and bye message', async () => {
        const event = {} as APIGatewayProxyEvent;
        const context = {} as Context;

        const result = await handler(event, context, () => { }) as any;

        expect(result.statusCode).toBe(200);
        const body = JSON.parse(result.body);
        expect(body.message).toBe('Bye! Serverless Typescript function executed successfully!');
    });
});
