import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load env vars
dotenv.config({ path: resolve(__dirname, '../../.env') });

import { handler as registerHandler } from '../handlers/register';
import { handler as loginHandler } from '../handlers/login';
import { createGroup, addMembers } from '../handlers/group';
import { loadAppData } from '../handlers/app';
import { handler as matthuHandler } from '../handlers/matthu';
import { handler as summaryHandler } from '../handlers/summary';
import { handler as arenaHandler } from '../handlers/arena';
import { handler as twinHandler } from '../handlers/twin';

const mockContext: any = {};
const logResult = (name: string, result: any) => {
    if (!result || result.statusCode !== 200) {
        console.error(`❌ ${name} Failed:`, result?.statusCode, result?.body);
    } else {
        console.log(`✅ ${name} Success`);
    }
    return result;
};

async function runTest() {
    console.log("🚀 Starting Full Integration Test...");
    const timestamp = Date.now();

    // 1. Register
    const email = `testuser_${timestamp}@example.com`;
    const password = "password123";
    console.log(`\n--- 1. Registering User (${email}) ---`);
    const regRes = await registerHandler({
        body: JSON.stringify({ input: { input: { email, display_name: "Test User", password } } })
    } as any, mockContext) as any;

    logResult("Register", regRes);
    if (!regRes || regRes.statusCode !== 200) process.exit(1);
    const userId = JSON.parse(regRes.body).user_id;

    // 2. Login
    console.log(`\n--- 2. Logging In ---`);
    const loginRes = await loginHandler({
        body: JSON.stringify({ input: { input: { email, password } } })
    } as any, mockContext) as any;

    logResult("Login", loginRes);
    if (!loginRes || loginRes.statusCode !== 200) process.exit(1);
    const token = JSON.parse(loginRes.body).token;
    console.log("Token received.");

    // 3. Create Group
    console.log(`\n--- 3. Creating Group ---`);
    const authHeaders = { session_variables: { 'x-hasura-user-id': userId } };

    const groupRes = await createGroup({
        body: JSON.stringify({
            input: { input: { name: "Integration Group", members: [] } },
            ...authHeaders
        })
    } as any, mockContext) as any;

    logResult("Create Group", groupRes);
    if (!groupRes || groupRes.statusCode !== 200) process.exit(1);
    const groupId = JSON.parse(groupRes.body).group_id;

    // 4. Add Members
    console.log(`\n--- 4. Adding Members ---`);
    const memEmail = `member_${timestamp}@example.com`;
    const memRegRes = await registerHandler({
        body: JSON.stringify({ input: { input: { email: memEmail, display_name: "Member", password } } })
    } as any, mockContext) as any;
    const memberId = JSON.parse(memRegRes.body).user_id;

    const addMemRes = await addMembers({
        body: JSON.stringify({
            input: { input: { group_id: groupId, members: [memberId] } },
            ...authHeaders
        })
    } as any, mockContext) as any;
    logResult("Add Members", addMemRes);

    // 5. Load App Data
    console.log(`\n--- 5. Loading App Data ---`);
    const appRes = await loadAppData({
        body: JSON.stringify({ ...authHeaders })
    } as any, mockContext) as any;
    logResult("Load App Data", appRes);

    // 6. Matthu (AI Chat)
    console.log(`\n--- 6. Matthu Chat ---`);
    const matthuRes = await matthuHandler({
        body: JSON.stringify({
            input: { input: { prompt: "Hello, who are you?", group_id: groupId } }
        })
    } as any, mockContext) as any;
    logResult("Matthu Chat", matthuRes);

    // 7. Arena
    console.log(`\n--- 7. Arena Selection ---`);
    const arenaRes = await arenaHandler({
        body: JSON.stringify({
            input: { input: { members: ["User A", "User B", "User C"] } }
        })
    } as any, mockContext) as any;
    logResult("Arena", arenaRes);

    // 8. Twin (AI Reply)
    console.log(`\n--- 8. Twin Reply ---`);
    const twinRes = await twinHandler({
        body: JSON.stringify({
            input: { input: { group_id: groupId } }
        })
    } as any, mockContext) as any;
    logResult("Twin", twinRes);

    // 9. Summary
    console.log(`\n--- 9. Summary ---`);
    const summaryRes = await summaryHandler({
        body: JSON.stringify({
            input: {
                input: {
                    group_id: groupId,
                    from_date: new Date(Date.now() - 86400000).toISOString(),
                    to_date: new Date().toISOString()
                }
            }
        })
    } as any, mockContext) as any;
    logResult("Summary", summaryRes);

    console.log("\n✅ Test Suite Completed.");
}

runTest();
