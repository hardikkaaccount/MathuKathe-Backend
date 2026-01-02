import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

interface DecodedToken {
    sub: string;
    name?: string;
    exp: number;
    "https://hasura.io/jwt/claims": {
        "x-hasura-user-id": string;
        "x-hasura-default-role": string;
        "x-hasura-allowed-roles": string[];
    };
}

export interface User {
    id: string;
    role: string;
    name?: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const decoded = jwtDecode<DecodedToken>(token);

            // Check for expiration
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.removeItem('token');
                setUser(null);
                navigate('/login');
                return;
            }

            setUser({
                id: decoded["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
                role: decoded["https://hasura.io/jwt/claims"]["x-hasura-default-role"],
                name: decoded.name // Backend might need to ensure this is in token or fetch user profile separately
            });
        } catch (error) {
            console.error("Invalid token:", error);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return { user, loading, logout };
}
