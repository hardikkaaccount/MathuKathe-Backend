import { execute } from "../utils/hasura";

export async function testMatthu() {
    console.log("Testing Matthu Query...");
    try {
        // 1. Create a group for context
        const groupId = "d4efdea5-6446-46f2-8130-92613acacd01";
        console.log(`Context Group ID: ${groupId}`);

        // 3. Ask a context-aware question
        const MATTHU_QUERY_MUTATION = `
            mutation MatthuQuery($prompt: String!, $group_id: uuid) {
                matthu_query(input: {prompt: $prompt, group_id: $group_id}) {
                    answer
                }
            }
        `;

        const prompt = "do u think hardik is tech intusiast?";
        console.log(`Sending prompt: "${prompt}" with group_id: ${groupId}`);

        const result: any = await execute(MATTHU_QUERY_MUTATION, { prompt, group_id: groupId });
        console.log("Matthu Response:", JSON.stringify(result, null, 2));

        if (result && result.matthu_query && result.matthu_query.answer) {
            console.log("SUCCESS: Answer received.");
            console.log("Answer:", result.matthu_query.answer);
        } else {
            console.error("FAILURE: No answer in response.");
            process.exit(1);
        }

    } catch (err) {
        console.error("ERROR executing matthu query:", err);
        process.exit(1);
    }
}
