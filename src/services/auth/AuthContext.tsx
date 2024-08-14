import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import {jwtDecode} from 'jwt-decode';

interface AuthProps {
    authState?: { id_token: string | null; authenticated: boolean | null; email: string | null };
    loading: boolean;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const AuthContext = createContext<AuthProps>({ loading: true });

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<{
        id_token: string | null;
        authenticated: boolean | null;
        email: string | null;
    }>({
        id_token: null,
        authenticated: null,
        email: null
    });

    const [loading, setLoading] = useState(true);

    const isTokenExpired = (token: string) => {
        try {
            const decoded: any = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decoded.exp < currentTime;
        } catch (error) {
            console.error("Error decoding token:", error);
            return true;
        }
    };

    useEffect(() => {
        const loadToken = async () => {
            const id_token = await SecureStore.getItemAsync("id_token");
            const logged = await SecureStore.getItemAsync("LOGGED");
            const email = await SecureStore.getItemAsync("email");
            
            if (id_token && logged === "true" && !isTokenExpired(id_token) && email) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${id_token}`;
                setAuthState({
                    id_token: id_token,
                    authenticated: true,
                    email: email
                });
            } else {
                setAuthState({
                    id_token: null,
                    authenticated: false,
                    email: null
                });
            }
            setLoading(false);
        }
        loadToken();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(`https://lhgkaf7rki.execute-api.us-east-1.amazonaws.com/Prod/login`, { email, password });
            const id_token = response.data.id_token;

            axios.defaults.headers.common['Authorization'] = `Bearer ${id_token}`;

            setAuthState({
                id_token: id_token,
                authenticated: true,
                email: email
            });

            await SecureStore.setItemAsync("id_token", id_token);
            await SecureStore.setItemAsync("LOGGED", "true");
            await SecureStore.setItemAsync("email", email);

  

            return { ...response.data };
        } catch (e) {
            return { error: true, msg: (e as any).response.data.msg };
        }
    };

    const logout = async () => {
        delete axios.defaults.headers.common['Authorization'];
        setAuthState({
            id_token: null,
            authenticated: false,
            email: null
        });

        await SecureStore.deleteItemAsync("id_token");
        await SecureStore.setItemAsync("LOGGED", "false");
        await SecureStore.deleteItemAsync("email");
    }

    const value = {
        onLogin: login,
        onLogout: logout,
        authState,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
