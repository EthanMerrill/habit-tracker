import React from 'react';
import { View, TextInput, useWindowDimensions, KeyboardAvoidingView } from 'react-native';

export function LogBox({ x, y, pressed }) {

    const { height, width } = useWindowDimensions();
    console.log(width)

    return (

        <View
            style={{
                position: 'absolute',
                left: x,
                top: y,
                width: width - 20,
                height: 200,
                borderRadius: 10,
                backgroundColor: pressed ? 'blue' : 'gray',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text style={{
                position:'absolute', 
                // transfrom:[translateX-50, rotate(90)]
            }}>SAVE</Text>
            <div style={{
                position:'absolute', 
                left:'10px',
                //paddingLeft:'10px',
                width:width - 80,
                height:'100%',
                display:'flex',
                justifyContent:'center',
                alignItems:'center'
            }}>
            <TextInput
                style={{
                    width: '80%',
                    position: 'absolute',
                    left:'0',
                    height: '90%',
                    borderRadius: 5,
                    backgroundColor: 'white',
                    paddingHorizontal: 10,
                }}
                placeholder=""
            />
            </div>
        </View>
    );
}
