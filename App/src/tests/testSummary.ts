import { execute } from "../utils/hasura";

export async function testSummary() {
    const groupId = "d4efdea5-6446-46f2-8130-92613acacd01";
    console.log("Inserting test messages...");

    // 3. Call the generate_summary action
    const GENERATE_SUMMARY_MUTATION = `
        mutation GenerateSummary($group_id: uuid!, $from_date: String!, $to_date: String!) {
            generate_summary(input: {group_id: $group_id, from_date: $from_date, to_date: $to_date}) {
                summary
            }
        }
    `;

    const fromDate = "2025-12-18T13:25:55.08586+00:00";
    const toDate = "2025-12-18T13:25:55.08586+00:00";

    console.log(`Requesting summary for messages between ${fromDate} and ${toDate}...`);

    try {
        const result: any = await execute(GENERATE_SUMMARY_MUTATION, {
            group_id: groupId,
            from_date: fromDate,
            to_date: toDate
        });

        console.log("Summary Response:", JSON.stringify(result, null, 2));

        if (result && result.generate_summary && result.generate_summary.summary) {
            console.log("SUCCESS: Summary generated.");
        } else {
            console.error("FAILURE: No summary in response.");
            process.exit(1);
        }
    } catch (err) {
        console.error("ERROR generating summary:", err);
        process.exit(1);
    }
}
