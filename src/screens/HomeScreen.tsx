// filepath: /Users/ethanmerrill/Documents/Code/HabitTracker/habit-tracker/src/screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/RootNavigator';

function HomeScreen() {
    // Define the type for the navigation prop
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();

    return (
        <View style={styles.container}>
            <Text>Home Screen</Text>
            <Button title="Go to Login" onPress={() => navigation.navigate("Login")} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HomeScreen;