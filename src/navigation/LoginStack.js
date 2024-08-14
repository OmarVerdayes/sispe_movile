import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from '../screens/HomeScreen';
import MovieScreen from "../screens/MovieScreen";
import SearchScreen from "../screens/SearchScreen";
import ProfileScreen from '../screens/ProfileScreen';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';
import UpdatePasswordScreen from '../screens/UpdatePasswordScreen';
import LoginScreen from '../screens/LoginScreen';
import ListMoviesCategory from "../screens/ListMoviesCategory";

const Stack = createNativeStackNavigator();

export default function LoginStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Home" 
                options={{ headerShown: false }} 
                component={HomeScreen} 
            />
            <Stack.Screen 
                name="Movie" 
                options={{ headerShown: false }} 
                component={MovieScreen} 
            />
            <Stack.Screen 
                name="Search" 
                options={{ headerShown: false }} 
                component={SearchScreen} 
            />
            <Stack.Screen 
                name="Profile" 
                options={{ headerShown: false }} 
                component={ProfileScreen} 
            />
            <Stack.Screen 
                name="VideoPlayer" 
                options={{ headerShown: false }} 
                component={VideoPlayerScreen} 
            />
            <Stack.Screen 
                name="UpdatePassword" 
                options={{ headerShown: false }} 
                component={UpdatePasswordScreen} 
            />
            <Stack.Screen 
                name="Login" 
                options={{ headerShown: false }} 
                component={LoginScreen} 
            />
            <Stack.Screen 
                name="ListMovies" 
                options={{ headerShown: false }} 
                component={ListMoviesCategory} 
            />
        </Stack.Navigator>
    );
}
