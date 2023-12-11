import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withDecay,
    withTiming,
    createAnimatedPropAdapter,
    useAnimatedProps,
    interpolate
} from 'react-native-reanimated';
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';

export default function ReanimatedDemo() {
    const pressed = useSharedValue(false);
    const offset = useSharedValue(0);
    const xOffset = useSharedValue(0);
    //const width = useSharedValue(0);
    const { height, width } = useWindowDimensions();

    const pan = Gesture.Pan()
        .onBegin(() => {
            pressed.value = true;
        })
        .onChange((event) => {
            offset.value += event.changeY;
        })
        .onFinalize(() => {
            offset.value = withDecay({
                velocity: 1,
                rubberBandEffect: true,
                clamp: [0, offset.value],
            });
            xOffset.value = withTiming(-150, { duration: 800 });


            pressed.value = false;
        });    

    const AnimatedPath = Animated.createAnimatedComponent(Path);

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [
            { translateY: offset.value },
            { translateX: xOffset.value },
            { scale: withTiming(pressed.value ? 1.2 : 1) },
        ],
        backgroundColor: pressed.value ? '#FFE04B' : '#b58df1',
    }));


    const animatedProps = useAnimatedProps(() => ({
        d: `M0 ${height / 2} C30, ${(height) / 2}, 0, ${offset.value + height / 2}, ${xOffset.value + width / 2}, ${offset.value + height / 2} `
        //d:`M50 ${height / 2} Q25 ${splineY} 0 ${pathY}`
    }));

    return (<>
        <Svg style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, height: height, width: width }}>
            <AnimatedPath animatedProps={animatedProps} stroke="black" strokeWidth={12} fill={"transparent"} />
        </Svg>

        <GestureHandlerRootView style={styles.container}>

            <View style={styles.container}>

                <GestureDetector gesture={pan}>
                    <Animated.View style={[styles.circle, animatedStyles]} />
                </GestureDetector>
            </View>
        </GestureHandlerRootView>
    </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    circle: {
        height: 50,
        width: 50,
        backgroundColor: '#b58df1',
        borderRadius: 200,
        cursor: 'grab',
    },
});