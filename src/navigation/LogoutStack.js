import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterUserScreen from "../screens/RegisterUserScreen";
import ChangePasswordTemporaryScreen from "../screens/ChangePasswordTemporaryScreen";
import RecoverUser from "../screens/RecoverUser";
import RecoverPassword from "../screens/RecoverPassword";

const Stack = createNativeStackNavigator();

export default function LogoutStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Login" 
                component={LoginScreen} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="SignIn" 
                component={RegisterUserScreen} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="ChangePasswordTemporary" 
                component={ChangePasswordTemporaryScreen} 
                options={{ headerShown: false }} 
                initialParams={{ email: '' }} 
            />
            <Stack.Screen 
                name="RecoverUser" 
                component={RecoverUser} 
                options={{ headerShown: false }}
            />
            <Stack.Screen 
                name="RecoverPassword" 
                component={RecoverPassword} 
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
