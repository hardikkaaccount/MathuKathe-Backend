"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const user_1 = require("../models/user");
const password_1 = require("../utils/password");
const jwt = __importStar(require("jsonwebtoken"));
const handler = async (event) => {
    try {
        const { input } = JSON.parse(event.body || '{}');
        // Hasura wraps arguments in an 'input' object, and our argument is named 'input'
        const { email, password } = input?.input || {};
        if (!email || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required fields: email, password' }),
            };
        }
        const user = await user_1.User.findByEmail(email);
        if (!user) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Invalid email or password' }),
            };
        }
        const isValidPassword = await (0, password_1.verifyPassword)(password, user.password_hash);
        if (!isValidPassword) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Invalid email or password' }),
            };
        }
        const HASURA_GRAPHQL_JWT_SECRET = process.env.HASURA_JWT_SECRET || 'secret';
        const token = jwt.sign({
            'https://hasura.io/jwt/claims': {
                'x-hasura-allowed-roles': ['user'],
                'x-hasura-default-role': 'user',
                'x-hasura-user-id': user.id,
            },
        }, HASURA_GRAPHQL_JWT_SECRET, { expiresIn: '1h' });
        return {
            statusCode: 200,
            body: JSON.stringify({
                token,
            }),
        };
    }
    catch (error) {
        console.error('Error logging in:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message || 'Internal Server Error',
                stack: error.stack,
                debug: {
                    hasura_id_exists: !!process.env.HASURA_GRAPHQL_ID,
                    hasura_secret_exists: !!process.env.HASURA_ADMIN_SECRET,
                },
            }),
        };
    }
};
exports.handler = handler;
//# sourceMappingURL=login.js.map