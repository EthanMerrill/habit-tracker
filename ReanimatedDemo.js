import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions, Text, PixelRatio, Platform } from 'react-native';
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

// GLOBAL DIMENSIONS
// circle radius: 
const circleRadius = 30;
const boxHeight = 100;

export default function ReanimatedDemo() {
    // Dimension VARS
    // Window Dimensions Hook
    const { width, height, scale } = useWindowDimensions();
    // Note on scale: 
    // The pixel ratio of the device your app is running on. The values can be:
    // 1 which indicates that one point equals one pixel (usually PPI/DPI of 96, 76 on some platforms).
    // 2 or 3 which indicates a Retina or high DPI display.

    // get dimensions in pixels
    const widthPx = PixelRatio.getPixelSizeForLayoutSize(width);
    const heightPx = PixelRatio.getPixelSizeForLayoutSize(height);
    
    const boxWidth = widthPx * 0.25;

    // set default positions:
    // box starts off screen
    const boxOffsetStartXPos = widthPx / 2


    const pressed = useSharedValue(false);
    const willSave = useSharedValue(false);
    const Yposition = useSharedValue(0);
    const xPosition = useSharedValue(0);
    const boxXOffset = useSharedValue(boxOffsetStartXPos);
    const boxYOffset = useSharedValue(0); // This is used for when the keyboard is open Considered using keyboardAvoidingView but it was hard to isolate to one component.
    const pathXPosition = useSharedValue(0);
    const pathYOffset = useSharedValue(0);
    const [moodValue, setMoodValue] = useState(50);
    // const globalOpacity = useSharedValue(1);
    // const globalVisible = useSharedValue(true);
    //const width = useSharedValue(0);


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
        console.log("resetting positions")
        xPosition.value = 0
        Yposition.value = 0
        boxXOffset.value = boxOffsetStartXPos
        boxYOffset.value = 0
        pathXPosition.value = 0
        // globalOpacity.value = withTiming(1, {duration: 2000})
        // globalOpacity.value = 1
        // globalVisible.value = true
    }

    // mood value Setter
    const updateMoodValue = (value) => {
        setMoodValue(value);
    };

    // CIRCLE
    const pan = Gesture.Pan()
        .onBegin((_, ctx) => {
            pressed.value = true;
            Platform.OS !== 'web' && triggerHapticHeavy && runOnJS(triggerHapticHeavy)()
        })
        .onChange((event) => {
            // only move if the circle stays on the screen or roughly in the area where the user can drag it. 
            if (Math.abs(Yposition.value + event.changeY) < (height / 2) - boxHeight / 2) {
                Yposition.value += event.changeY;
                // update the mood value
                //runOnJS(updateMoodValue)(3);
            }
            if (Math.round(Yposition.value) % 15 == 0) {
                Platform.OS !== 'web' && runOnJS(triggerHaptic)()
            }
        })
        .onFinalize((event) => {
            Yposition.value = withDecay({
                velocity: 1,
                rubberBandEffect: true,
                clamp: [0, Yposition.value],
            });
            xPosition.value = withTiming(-width / 2 + circleRadius + 30, { duration: 800 });
            boxXOffset.value = withTiming(boxWidth / 2 + circleRadius + 30, { duration: 800 });
            pressed.value = false;


            console.log("Yposition: ", Yposition.value,"\ncalculated Max:",height-boxHeight, "\ncalculated min", -(height-boxHeight)/2, "\nCalculation: ", -1*(Yposition.value < 0 ? (Yposition.value) * 2 : Yposition.value))
            // convert the Y position to a percentage of the range of movement it has availble, while accounting for box height
            runOnJS(updateMoodValue)(interpolate(-1*(Yposition.value < 0 ? (Yposition.value) * 2 : Yposition.value), [-(height-boxHeight)/2, height-boxHeight], [0, 100]));
            Platform.OS !== 'web' && triggerHaptic && runOnJS(triggerHaptic)()
        });


    const animatedCircleStyles = useAnimatedStyle(() => ({
        transform: [
            { translateY: Yposition.value },
            { translateX: xPosition.value },
            { scale: withTiming(pressed.value ? 1.2 : 1) },
        ],
        backgroundColor: pressed.value ? '#FFE04B' : '#b58df1',
        // opacity:globalOpacity.value
    }));

    // BOX
    const boxDrag = Gesture.Pan()
        .onBegin(() => {
            pressed.value = true;
            //triggerHaptic();
            console.log(xPosition.value)
        })
        .onChange((event) => {
            if (event.translationX < 0) {
                xPosition.value += event.changeX;
                pathXPosition.value += event.changeX;
                if (xPosition.value < -240) {
                    console.log('swipe left');
                    willSave.value = true;
                    pressed.value = false;
                    Platform.OS !== 'web' && triggerHapticHeavy && runOnJS(triggerHapticHeavy)()
                }
            }
        })
        .onFinalize((e) => {
            willSave.value = false;
            // if the user swipes left and the box is far enough to the left, then save the point to the database
            if (e.translationX < -90) {
                boxXOffset.value = withDecay({
                    velocity: 1,
                    rubberBandEffect: true,
                    clamp: [0, -500],
                });
                triggerHaptic && runOnJS(triggerHaptic)()
                console.log('swipe left. Hide Objects, Reset Positions, Then fade in. ');
                // globalOpacity.value = 0
                // SAVE POINT TO DATABASE HERE 
                pathYOffset.value = Yposition.value// Placeholder so set the height of the base of the line on the left to the value of the previous saved item.
                runOnJS(resetPositions)()
            } else {
                xPosition.value = withTiming(-width / 2 + circleRadius + 30, { duration: 800 });
                boxXOffset.value = withTiming(boxWidth / 2 + circleRadius + 30, { duration: 300 });
                console.log('swipe not enough', height, Yposition.value)
            }
            pressed.value = false;
        });

    // the BOX styles
    const animatedBoxStyles = useAnimatedStyle(() => ({
        transform: [
            { translateY: Yposition.value + boxYOffset.value },
            { translateX: xPosition.value + boxXOffset.value },
            //{ scale: withTiming(pressed.value ? 1.2 : 1) },
        ],
        width: boxWidth,
        //backgroundColor: pressed.value ? '#FFE04B' : '#b58df1',
        border: willSave ? '1px solid black' : 'none',
    }));

    // PATH
    const AnimatedPath = Animated.createAnimatedComponent(Path);

    const animatedProps = useAnimatedProps(() => ({
        d: `M${pathXPosition.value} ${pathYOffset.value + height / 2} C${30}, ${pathYOffset.value + height / 2}, ${pathXPosition.value}, ${Yposition.value + height / 2}, ${(xPosition.value + width / 2) - 15}, ${Yposition.value + height / 2}`,
    }));


    return (<>
        <Svg style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, height: height, width: width }}>
            <AnimatedPath animatedProps={animatedProps} stroke="grey" strokeWidth={6} fill={"transparent"} />
        </Svg>
        <View
            style={{
                position: 'absolute',
                top: '20%'
            }}><Text>How do you feel right now?</Text></View>
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.container}>
                <GestureDetector gesture={pan}>
                    <Animated.View style={[styles.circle, animatedCircleStyles]}>
                        <Text>
                            {moodValue.toFixed(0)}
                        </Text>
                    </Animated.View>
                </GestureDetector>
                <GestureDetector gesture={boxDrag}>
                    <Animated.View style={[styles.box, animatedBoxStyles]}>
                        <LogBox params={{ x: xPosition, y: Yposition, pressed: pressed }} />
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
        flexDirection: 'row',
    },
    circle: {
        height: circleRadius * 2,
        width: circleRadius * 2,
        backgroundColor: '#b58df1',
        borderRadius: 200,
        cursor: 'grab',
    },
    box: {
        position: 'absolute',
        // marginLeft: 10,
        height: boxHeight,
        backgroundColor: 'violet',
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        // width: '60%',
    },
});