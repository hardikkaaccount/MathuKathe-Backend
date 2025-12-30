import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load env vars
dotenv.config({ path: resolve(__dirname, '../../.env') });

// Load env vars
dotenv.config({ path: resolve(__dirname, '../../.env') });

import { handler } from '../handlers/arena';

const mockEvent: any = {
    body: JSON.stringify({
        input: {
            input: {
                members: ["user1", "user2", "user3", "user4"]
            }
        }
    })
};

async function runTest() {
    console.log("Running manual arena handler test...");
    const context: any = {};
    const callback: any = () => { };

    try {
        const result = await handler(mockEvent, context, callback);
        console.log("Result:", result);
    } catch (error) {
        console.error("Handler error:", error);
    }
}

runTest();
