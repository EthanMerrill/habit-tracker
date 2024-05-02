import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions, Text, PixelRatio } from 'react-native';
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
const boxHeight = 200;

export default function ReanimatedDemo() {
     // Dimension VARS
    // Window Dimensions Hook
    const { width, height } = useWindowDimensions();
    // get dimensions in pixels
    const widthPx = PixelRatio.getPixelSizeForLayoutSize(width);
    const heightPx = PixelRatio.getPixelSizeForLayoutSize(height);

    const boxWidth = widthPx*0.25;

    // set default positions:
    // box starts off screen
    const boxOffsetStartXPos = widthPx/2


    const pressed = useSharedValue(false);
    const Yposition = useSharedValue(0);
    const xPosition = useSharedValue(0);
    const boxXOffset = useSharedValue(boxOffsetStartXPos);
    const boxYOffset = useSharedValue(0); // This is used for when the keyboard is open Considered using keyboardAvoidingView but it was hard to isolate to one component.
    const pathXPosition = useSharedValue(0);
    const pathYOffset = useSharedValue(0)
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

    // CIRCLE
    const pan = Gesture.Pan()
        .onBegin((_, ctx) => {
            pressed.value = true;
            triggerHapticHeavy && runOnJS(triggerHapticHeavy)()
        })
        .onChange((event) => {
            // only move if the circle stays on the screen or roughly in the area where the user can drag it. 
            if (Math.abs(Yposition.value + event.changeY) < (height / 2) - boxHeight/2) {
                Yposition.value += event.changeY;
            }
            if (Math.round(Yposition.value) % 15 == 0) {
                triggerHaptic && runOnJS(triggerHaptic)()
            }
        })
        .onFinalize(() => {
            Yposition.value = withDecay({
                velocity: 1,
                rubberBandEffect: true,
                clamp: [0, Yposition.value],
            });
            xPosition.value = withTiming(-width/2+circleRadius+30, { duration: 800 });
            boxXOffset.value = withTiming(boxWidth/2+circleRadius+30, { duration: 800 });
            pressed.value = false;
            triggerHaptic && runOnJS(triggerHaptic)()
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
        })
        .onChange((event) => {
            if (event.translationX < 0) {
                xPosition.value += event.changeX;
                pathXPosition.value += event.changeX;
                if (xPosition.value < -240 && xPosition.value > -250) {
                    console.log('swipe left');
                    pressed.value = false;
                    triggerHapticHeavy && runOnJS(triggerHapticHeavy)()
                }
            }
        })
        .onFinalize((e) => {
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
                // pathYOffset.value = Yposition.value// Placeholder to accomplish the same thing
                runOnJS(resetPositions)()
            } else {
                // xPosition.value = withTiming(-120, { duration: 800 });
                //boxXOffset.value = withTiming(-width / 2 + 15, { duration: 300 });
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
        // opacity:globalOpacity.value
        // visible: globalVisible.value
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
                position:'absolute',
                top:'20%'
            }}><Text>How do you feel right now?</Text></View>
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.container}>
                <GestureDetector gesture={pan}>
                    <Animated.View style={[styles.circle, animatedCircleStyles]} />
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
        height: circleRadius*2,
        width: circleRadius*2,
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