// filepath: /Users/ethanmerrill/Documents/Code/HabitTracker/habit-tracker/src/navigation/RootNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen'; // Adjust the import path as needed
import LoginScreen from '../screens/LoginScreen'; // Adjust the import path as needed

const Stack = createStackNavigator();

// Define the type for the navigation stack
export type RootStackParamList = {
    Home: undefined;
    Login: undefined;
};


function RootNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator id={undefined}>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default RootNavigator;