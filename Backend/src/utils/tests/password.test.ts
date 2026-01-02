import { hashPassword, verifyPassword } from '../password';

// "THE FOLDER": This suite holds all tests for passwords
describe('Password Utility', () => {
    // 1. "CHECKLIST ITEM": Testing the hashing function
    it('should hash a password correctly', async () => {
        // A. "INPUT": We start with a known value
        const plainText = 'mySecretPassword';

        // B. "ACTION": We run the actual function
        const hash = await hashPassword(plainText);

        // C. "INSPECTION":
        // "I expect the hash to look DIFFERENT from the original password (scrambled)"
        expect(hash).not.toBe(plainText);
    });

    // 2. Test Verification (Success)
    it('should return true for valid password', async () => {
        const plainText = 'password123';
        const hash = await hashPassword(plainText);
        const isValid = await verifyPassword(plainText, hash);

        expect(isValid).toBe(true);
    });

    // 3. Test Verification (Failure)
    it('should return false for invalid password', async () => {
        const plainText = 'password123';
        const hash = await hashPassword(plainText);
        const isValid = await verifyPassword('WRONG_PASSWORD', hash);

        expect(isValid).toBe(false);
    });
});
