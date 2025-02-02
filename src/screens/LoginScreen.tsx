// filepath: /Users/ethanmerrill/Documents/Code/HabitTracker/habit-tracker/src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import firebase from 'firebase/app';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const handleRegister = async () => {
        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("You're signed up!");
            // Handle successful registration
        } catch (err: any) {
            setError(err.message);
            alert("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Handle successful login
        } catch (err) {
            setError(err.message);
            alert("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior="padding">
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <>
                        <Button title="Register" onPress={handleRegister} />
                        <Button title="Login" onPress={handleLogin} />
                    </>
                )}
                {error && <Text style={styles.errorText}>{error}</Text>}
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
});

export default LoginScreen;
