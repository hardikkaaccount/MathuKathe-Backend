
import { ArenaModel } from '../arena';

describe('Arena Model', () => {
    it('selectContestants should return two distinct contestants', () => {
        const members = ['Bob', 'Alice', 'Eve', 'Dave'];
        const result = ArenaModel.selectContestants(members);

        expect(members).toContain(result.challenger_id);
        expect(members).toContain(result.player_id);
        expect(result.challenger_id).not.toBe(result.player_id);
    });

    it('should throw if less than 2 members', () => {
        expect(() => ArenaModel.selectContestants(['Bob'])).toThrow('Arena requires at least 2 members.');
    });
});
