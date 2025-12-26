import { User } from '../models/user';
import { Group } from '../models/group';
import { apiHandler } from '../middlewares/apiHandler';

export const loadAppData = apiHandler({ requireAuth: true }, async (event, context, { user_id }) => {
    // user_id is guaranteed by requireAuth
    const userId = user_id!;

    // 1. Fetch User Profile
    const user = await User.getProfile(userId);
    if (!user) {
        return { statusCode: 404, body: JSON.stringify({ message: "User not found" }) };
    }

    // 2. Fetch User Groups
    const groups = await Group.listForUser(userId);

    const groupSummaries = groups.map(g => ({
        id: g.id,
        name: g.name,
        unread_count: 0 // Placeholder
    }));

    return {
        statusCode: 200,
        body: JSON.stringify({
            user_profile: {
                id: user.id,
                email: user.email,
                display_name: user.display_name
            },
            groups: groupSummaries
        })
    };
});
