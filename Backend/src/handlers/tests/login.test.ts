import { handler } from '../login';
import { User } from '../../models/user';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

// 1. "ROBOT FOR USER MODEL"
// We don't want to use real DB logic.
jest.mock('../../models/user');

describe('Login Handler', () => {

    // Helper to create a Fake Event (Postman Request)
    // apiHandler expects: { input: { input: YOUR_ARGS } }
    const createEvent = (args: any): APIGatewayProxyEvent => ({
        body: JSON.stringify({
            input: {
                input: args.input // Matches nesting in apiHandler.ts line 26
            }
        }),
    } as any);

    const mockContext = {} as Context;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and token on success', async () => {
        // A. SETUP
        const input = { email: 'test@test.com', password: '123' };
        // "Robot script: User.login returns a valid user"
        (User.login as jest.Mock).mockResolvedValue({ id: '1', email: 'test@test.com' });
        // "Robot script: User.generateToken returns a token"
        (User.generateToken as jest.Mock).mockReturnValue('fake_token_abc');

        // B. ACTION
        // Note: The structure of 'body' depends on how 'apiHandler' parses it.
        // Based on apiHandler.ts: const { input } = JSON.parse(event.body); 
        // So we need to wrap our input in an 'input' key if that's what Hasura Actions send.
        // Checking login.ts... it uses `const { email, password } = body`.
        // AND apiHandler passes `validatedBody` as `body`.
        // AND apiHandler parses `const { input } = ...`.
        // So our event body must be: { "input": { email, password } }
        const event = createEvent({ input: input });

        const result = await handler(event, mockContext);

        // C. VERIFY
        expect(result?.statusCode).toBe(200);
        // Parse the body because Lambda returns it as a string
        const body = JSON.parse(result?.body || '{}');
        expect(body.token).toBe('fake_token_abc');
    });

    it('should return 401 if login fails', async () => {
        // A. SETUP
        // "Robot script: User.login returns NULL (fail)"
        (User.login as jest.Mock).mockResolvedValue(null);

        // B. ACTION
        const event = createEvent({ input: { email: 'fail@test.com', password: 'wrong' } });
        const result = await handler(event, mockContext);

        // C. VERIFY
        expect(result?.statusCode).toBe(401);
    });

    it('should return 400 if validation fails (Bad Email)', async () => {
        // A. SETUP - No mock needed for User, it shouldn't even reach there!
        // B. ACTION
        const event = createEvent({ input: { email: 'not-an-email', password: '123' } });
        const result = await handler(event, mockContext);

        // C. VERIFY
        expect(result?.statusCode).toBe(400); // Validation error
        // Ensure we NEVER called the User model (Efficiency check)
        expect(User.login).not.toHaveBeenCalled();
    });
});
