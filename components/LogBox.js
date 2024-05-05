import React from 'react';
import { View, TextInput, useWindowDimensions, KeyboardAvoidingView, Text} from 'react-native';

export function LogBox({ x, y, pressed }) {

    return (<>
            <View style={{
                position:'relative',
                height:'100%',
                display:'flex',
                justifyContent:'center',
                alignItems:'center',
                backgroundColor:'gray',
                // borderRadius:5,
                
            }}>
            <TextInput multiline={true}
                style={{
                    position: 'relative',
                    height: '90%',
                    width: '90%',
                    borderRadius: 5,
                    backgroundColor: 'white',
                    textAlignVertical: 'top'
                }}
            />
            </View>
            <View style={{
                position:'absolute',
                top:'90%',
                left:'10%',
                display:'flex',
                justifyContent:'center',
                alignItems:'center',
                backgroundColor:'gray',
                borderRadius:5,
            }}>
            </View>
            <View>
            <Text style={{
                    color:'gray',
                    marginHorizontal:"auto"
                }}>Swipe left to SAVE</Text>
                </View>
            </>
    );
}
