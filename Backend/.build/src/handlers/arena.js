"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const handler = async (event) => {
    try {
        const { input } = JSON.parse(event.body || '{}');
        const { members } = input?.input || {};
        if (!members || !Array.isArray(members)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing or invalid field: members' }),
            };
        }
        if (members.length < 2) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Arena requires at least 2 members.' }),
            };
        }
        // Randomly select 2 distinct members
        const shuffled = members.sort(() => 0.5 - Math.random());
        const challenger_id = shuffled[0];
        const player_id = shuffled[1];
        return {
            statusCode: 200,
            body: JSON.stringify({
                challenger_id,
                player_id
            }),
        };
    }
    catch (error) {
        console.error('Error handling arena action:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message || 'Internal Server Error',
            }),
        };
    }
};
exports.handler = handler;
//# sourceMappingURL=arena.js.map