import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../services/auth/AuthContext';
import LoginStack from './LoginStack';
import LogoutStack from './LogoutStack';

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
    const { authState } = useAuth();

    return (
        <NavigationContainer>
            {authState?.authenticated ? (
                <LoginStack />
            ) : (
                <LogoutStack />
            )}
        </NavigationContainer>
    );
}
