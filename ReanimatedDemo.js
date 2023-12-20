import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withDecay,
    withTiming,
    createAnimatedPropAdapter,
    useAnimatedProps,
    interpolate,
    runOnJS
} from 'react-native-reanimated';
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
    Directions
} from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';
// my component imports
import { LogBox } from './components/LogBox'


export default function ReanimatedDemo() {
    const pressed = useSharedValue(false);
    const Yoffset = useSharedValue(0);
    const xOffset = useSharedValue(0);
    const boxXOffset = useSharedValue(0);
    const boxYOffset = useSharedValue(0); // THis is used for when the keyboard is open Considered using keyboardAvoidingView but it was hard to isolate to one component.
    const pathXOffset = useSharedValue(0);
    const pathYOffset = useSharedValue(0)
    const globalOpacity = useSharedValue(1);
    //const width = useSharedValue(0);
    const { height, width } = useWindowDimensions();

    // HAPTICS
    const triggerHaptic = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        return;
    };

    const triggerHapticHeavy = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        return;
    }

    // STATE RESET POSITIONS
    const resetPositions = () => {
        xOffset.value = 0
        Yoffset.value = 0
        boxXOffset.value = 0
        boxYOffset.value = 0
        pathXOffset.value = 0
        globalOpacity.value = withTiming(1, {duration: 2000})
    }


    // CIRCLE
    const pan = Gesture.Pan()
        .onBegin((_, ctx) => {
            pressed.value = true;
            triggerHapticHeavy && runOnJS(triggerHapticHeavy)()
        })
        .onChange((event) => {
            // only move if the circle stays on the screen or roughly in the area where the user can drag it. 
            if (Math.abs(Yoffset.value + event.changeY) < (height / 2) - 50) {
                Yoffset.value += event.changeY;
            }
            if (Math.round(Yoffset.value) % 15 == 0) {
                triggerHaptic && runOnJS(triggerHaptic)()
            }
        })
        .onFinalize(() => {
            Yoffset.value = withDecay({
                velocity: 1,
                rubberBandEffect: true,
                clamp: [0, Yoffset.value],
            });
            xOffset.value = withTiming(-150, { duration: 800 });
            boxXOffset.value = withTiming(-width / 2 + 15, { duration: 1600 });
            pressed.value = false;
            triggerHaptic && runOnJS(triggerHaptic)()
        });


    const animatedCircleStyles = useAnimatedStyle(() => ({
        transform: [
            { translateY: Yoffset.value },
            { translateX: xOffset.value },
            { scale: withTiming(pressed.value ? 1.2 : 1) },
        ],
        backgroundColor: pressed.value ? '#FFE04B' : '#b58df1',
        opacity:globalOpacity.value
    }));

    // BOX

    const boxDrag = Gesture.Pan()
        .onBegin(() => {
            pressed.value = true;
            //triggerHaptic();
        })
        .onChange((event) => {
            if (event.translationX < 0) {
                xOffset.value += event.changeX;
                pathXOffset.value += event.changeX;
                if (xOffset.value < -240 && xOffset.value > -250) {
                    console.log('swipe left');
                    pressed.value = false;
                    triggerHapticHeavy && runOnJS(triggerHapticHeavy)()
                }
            }
        })
        .onFinalize((e) => {

            if (e.translationX < -90) {
                boxXOffset.value = withDecay({
                    velocity: 1,
                    rubberBandEffect: true,
                    clamp: [0, -500],
                });
                triggerHaptic && runOnJS(triggerHaptic)()
                console.log('swipe left. Hide Objects, Reset Positions, Then fade in. ');
                globalOpacity.value = 0
                // SAVE POINT TO DATABSE HERE 
                pathYOffset.value = Yoffset.value// Placeholder to accomplish the same thing
                resetPositions()
            } else {
                xOffset.value = withTiming(-150, { duration: 300 });
                boxXOffset.value = withTiming(-width / 2 + 15, { duration: 300 });
                console.log('swipe not enough', height, Yoffset.value)
            }
            pressed.value = false;
        });


    const animatedBoxStyles = useAnimatedStyle(() => ({
        transform: [
            { translateY: Yoffset.value + boxYOffset.value },
            { translateX: xOffset.value + boxXOffset.value },
            //{ scale: withTiming(pressed.value ? 1.2 : 1) },
        ],
        width: width - 80,
        right: -width - (width - 120) / 2,
        backgroundColor: pressed.value ? '#FFE04B' : '#b58df1',
        opacity:globalOpacity.value
    }));

    // PATH
    const AnimatedPath = Animated.createAnimatedComponent(Path);

    const animatedProps = useAnimatedProps(() => ({
        d: `M${pathXOffset.value} ${pathYOffset.value + height / 2} C30, ${pathYOffset.value + height / 2}, ${pathXOffset.value}, ${Yoffset.value + height / 2}, ${(xOffset.value + width / 2) - 25}, ${Yoffset.value + height / 2}`,
        opacity:globalOpacity.value
    }));


    return (<>
        <Svg style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, height: height, width: width }}>
            <AnimatedPath animatedProps={animatedProps} stroke="grey" strokeWidth={6} fill={"transparent"} />
        </Svg>
            <div
            style={{
                position:'absolute',
                top:'20%'
            }}><Text>How you you feel right now?</Text></div>
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.container}>
                <GestureDetector gesture={pan}>
                    <Animated.View style={[styles.circle, animatedCircleStyles]} />
                </GestureDetector>
                <GestureDetector gesture={boxDrag}>
                        <Animated.View style={[styles.textContainer, animatedBoxStyles]}>
                            <LogBox params={{ x: xOffset, y: Yoffset, pressed: pressed }} />
                        </Animated.View>
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
    textContainer: {
        position: 'absolute',
        marginLeft: 0,
        height: 200,
        backgroundColor: 'violet',
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },
});