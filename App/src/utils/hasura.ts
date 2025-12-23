export const HASURA_ENDPOINT = (process.env.HASURA_GRAPHQL_ID || '') + '/v1/graphql';
const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET || '';

if (!process.env.HASURA_GRAPHQL_ID) {
    console.error("HASURA_GRAPHQL_ID is missing!");
}

interface HasuraResponse<T> {
    data?: T;
    errors?: { message: string }[];
}

export async function execute<T>(
    query: string,
    variables?: Record<string, any>,
    role?: string,
    headers?: Record<string, string>
): Promise<T> {
    const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
        ...headers
    };

    const response = await fetch(HASURA_ENDPOINT, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify({
            query,
            variables,
        }),
    });

    const data = (await response.json()) as HasuraResponse<T>;

    if (data.errors) {
        throw new Error(data.errors[0].message);
    }

    return data.data as T;
}
