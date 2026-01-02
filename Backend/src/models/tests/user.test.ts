import { User } from '../user';
import { execute } from '../../utils/hasura';
import { hashPassword, verifyPassword } from '../../utils/password';
import * as jwt from 'jsonwebtoken';

// 1. "HIRE STUNT DOUBLES"
// We tell Jest: "Don't run the real code from these files. Use our robots instead."
jest.mock('../../utils/hasura');
jest.mock('../../utils/password');
jest.mock('jsonwebtoken');

describe('User Model', () => {

    // 2. "CLEANUP"
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should hash password and save to DB', async () => {
            // A. SCENE SETUP
            const mockInput = { email: 'test@test.com', password: '123', display_name: 'Test' };
            const mockHashedPass = 'hashed_123';
            const mockDbResponse = { insert_users_one: { id: 'user-1', ...mockInput } };

            // "Robot script: When asked to hash, return 'hashed_123'"
            (hashPassword as jest.Mock).mockResolvedValue(mockHashedPass);

            // "Robot script: When asked to execute DB query, return success"
            (execute as jest.Mock).mockResolvedValue(mockDbResponse);

            // B. ACTION
            const result = await User.register(mockInput);

            // C. REVIEW
            // Check if we called hash function
            expect(hashPassword).toHaveBeenCalledWith('123');
            // Check if we called DB with the HASHED password (security check)
            expect(execute).toHaveBeenCalledWith(
                expect.any(String), // The query string
                expect.objectContaining({ password_hash: mockHashedPass }) // The variables
            );
            expect(result).toEqual(mockDbResponse.insert_users_one);
        });
    });

    describe('login', () => {
        it('should return user if email and password match', async () => {
            // A. SCENE SETUP
            const loginInput = { email: 'alice@test.com', password: 'password123' };
            const mockUserFromDb = {
                id: '1',
                email: 'alice@test.com',
                password_hash: 'real_hash_in_db'
            };

            // "Robot script: DB returns one user"
            (execute as jest.Mock).mockResolvedValue({ users: [mockUserFromDb] });

            // "Robot script: Password verify says TRUE"
            (verifyPassword as jest.Mock).mockResolvedValue(true);

            // B. ACTION
            const result = await User.login(loginInput);

            // C. REVIEW
            expect(result).toEqual(mockUserFromDb);
            expect(verifyPassword).toHaveBeenCalledWith('password123', 'real_hash_in_db');
        });

        it('should return null if password is wrong', async () => {
            // A. SCENE SETUP
            (execute as jest.Mock).mockResolvedValue({
                users: [{ id: '1', password_hash: 'hash' }]
            });
            // "Robot script: Password verify says FALSE (Wrong password)"
            (verifyPassword as jest.Mock).mockResolvedValue(false);

            // B. ACTION
            const result = await User.login({ email: 'a', password: 'wrong' });

            // C. REVIEW
            expect(result).toBeNull();
        });
    });
    describe('getProfile', () => {
        it('should return user profile if found', async () => {
            const mockUser = { id: 'u1', email: 'e', display_name: 'd' };
            (execute as jest.Mock).mockResolvedValue({ users_by_pk: mockUser });

            const result = await User.getProfile('u1');
            expect(result).toEqual(mockUser);
            expect(execute).toHaveBeenCalledWith(expect.any(String), { id: 'u1' });
        });

        it('should return null if user not found', async () => {
            (execute as jest.Mock).mockResolvedValue({ users_by_pk: null });

            const result = await User.getProfile('unknown');
            expect(result).toBeNull();
        });
    });
});
