import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load env vars
dotenv.config({ path: resolve(__dirname, '../../.env') });

import { handler } from '../handlers/matthu';

const mockEvent: any = {
    body: JSON.stringify({
        input: {
            input: {
                prompt: "What are they talking about?",
                group_id: "d4efdea5-6446-46f2-8130-92613acacd01"
            }
        }
    })
};

async function runTest() {
    console.log("Running manual matthu handler test...");
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
