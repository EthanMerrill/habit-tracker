import React from 'react';
import { View, TextInput, useWindowDimensions, KeyboardAvoidingView } from 'react-native';

export function LogBox({ x, y, pressed }) {

    const { height, width } = useWindowDimensions();
    console.log(width)

    return (
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={300} >
        <View
            style={{
                position: 'absolute',
                left: x,
                top: y,
                width: width - 80,
                height: 200,
                borderRadius: 10,
                backgroundColor: pressed ? 'blue' : 'gray',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <TextInput
                style={{
                    width: '80%',
                    height: 'auto',
                    borderRadius: 5,
                    backgroundColor: 'white',
                    paddingHorizontal: 10,
                }}
                placeholder=""
            />
        </View>
        </KeyboardAvoidingView>
    );
}
