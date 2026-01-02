"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HASURA_ENDPOINT = void 0;
exports.execute = execute;
exports.HASURA_ENDPOINT = (process.env.HASURA_GRAPHQL_ID || '') + '/v1/graphql';
const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET || '';
if (!process.env.HASURA_GRAPHQL_ID) {
    console.error("HASURA_GRAPHQL_ID is missing!");
}
async function execute(query, variables, role, headers) {
    const requestHeaders = {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
        ...headers
    };
    const response = await fetch(exports.HASURA_ENDPOINT, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify({
            query,
            variables,
        }),
    });
    const data = (await response.json());
    if (data.errors) {
        throw new Error(data.errors[0].message);
    }
    return data.data;
}
//# sourceMappingURL=hasura.js.map