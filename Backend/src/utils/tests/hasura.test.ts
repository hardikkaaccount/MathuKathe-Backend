import { execute } from '../hasura';

// 1. "HIJACKING":
// We replace the global 'fetch' (internet) with a special Jest Robot (jest.fn)
// Now, when the app tries to go online, it hits our Robot instead.
global.fetch = jest.fn();

describe('Hasura Utility', () => {
    // 2. "CLEANUP":
    // Before every single test case, wipe the Robot's memory.
    // We don't want it remembering things from previous tests.
    beforeEach(() => {
        (global.fetch as jest.Mock).mockClear();
    });

    it('should return data when query is successful', async () => {
        // 3. "PROGRAMMING THE ROBOT":
        // We define exactly what the Robot should give back.
        // We ignore the real Hasura. We just want to see if our code handles THIS specific data correctly.
        const mockResponseData = {
            data: {
                users: [{ id: 1, name: 'Alice' }]
            }
        };

        // "Robot, when called, promise to give back this JSON."
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockResponseData
        });

        // 4. "ACTION":
        // We run the real 'execute' function.
        const result = await execute<{ users: any[] }>('query { users { id name } }');

        // 5. "VERIFICATION":
        // Did our code return the data inside the JSON?
        expect(result).toEqual(mockResponseData.data);
        // Did the code actually try to fetch something?
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when Hasura returns errors', async () => {
        // 1. Setup the Mock Response (Error Case)
        const mockErrorResponse = {
            errors: [{ message: 'Syntax Error in GraphQL' }]
        };

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockErrorResponse
        });

        // 2. Call & Assert (expecting it to fail)
        await expect(execute('bad query')).rejects.toThrow('Syntax Error in GraphQL');
    });
});
