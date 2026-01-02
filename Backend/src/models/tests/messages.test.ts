import { Message } from '../message';
import { execute } from '../../utils/hasura';
import { GetMessagesResponse, MessageData } from '../../types/message';
import { GET_MESSAGES_BY_GROUP_AND_DATE } from '../../queries/message';

//mock execute

jest.mock('../../utils/hasura');


describe('Messages Fetch', () => {

    it('should fetch messages', async () => {
        const mockInput = {
            group_id: '1',
            from_date: '2022-01-01T00:00:00.000Z',
            to_date: '2022-01-01T00:00:00.000Z'
        }
        const mockMessage: MessageData[] = [
            {
                id: '1',
                content: 'Hello',
                created_at: '2022-01-01T00:00:00.000Z',
                sender: {
                    display_name: 'Test User'
                }
            },
            {
                id: '2',
                content: 'Hello',
                created_at: '2022-01-01T00:00:00.000Z',
                sender: {
                    display_name: 'Test User'
                }
            }
        ]

        const mockResponse = { messages: mockMessage };
        (execute as jest.Mock).mockResolvedValue(mockResponse);

        const result = await Message.fetchByGroupAndDateRange(mockInput.group_id, mockInput.from_date, mockInput.to_date);

        expect(result).toEqual(mockMessage);
        expect(execute).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining(mockInput)
        );
        expect(execute).toHaveBeenCalledTimes(1);
    });

    it('should fetch recent messages and reverse them', async () => {
        const mockMessages = [
            { id: '2', content: 'Newer', created_at: '2023-01-02' },
            { id: '1', content: 'Older', created_at: '2023-01-01' }
        ];
        // The query likely returns newest first (desc output from DB usually), 
        // so fetchRecent implementation says: return (data.messages || []).reverse();
        // If Hasura returns [Newer, Older], reverse makes it [Older, Newer].

        // Return a copy so that in-place reverse doesn't affect our local variable
        (execute as jest.Mock).mockResolvedValue({ messages: [...mockMessages] });

        const result = await Message.fetchRecent('group-1', 10);

        // Expect reverse order: Older first, then Newer
        expect(result).toEqual([mockMessages[1], mockMessages[0]]);
        expect(execute).toHaveBeenCalledWith(
            expect.any(String),
            { group_id: 'group-1', limit: 10 }
        );
    });
});
