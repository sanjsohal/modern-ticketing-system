import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { useAuth } from './AuthContext';
import { fetchUsers } from '../services/userService';

interface UserContextType {
    users: User[];
    loading: boolean;
    error: string | null;
}

const UserContext = createContext<UserContextType>({
    users: [],
    loading: false,
    error: null,
});

export const useUsers = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { loading: authLoading } = useAuth();

    useEffect(() => {
        // Wait for auth to be ready before fetching users
        if (authLoading) {
            return; // Auth is still loading, don't fetch yet
        }

        // Fetch Users from backend API
            const loadUsers = async () => {
              try {
                setLoading(true);
                setError(null);

                // Fetch users from the backend
                const data = await fetchUsers();
                setUsers(data);
              } catch (err) {
                setError('Failed to fetch users');
                console.error('Error fetching users:', err);
              } finally {
                setLoading(false);
              }
            };

            loadUsers();
    }, [authLoading]);

    return (
        <UserContext.Provider value={{ 
            users,
            loading,
            error
         }}>
            {children}
        </UserContext.Provider>
    );
};