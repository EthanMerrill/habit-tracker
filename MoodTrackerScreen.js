import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, PanResponder, Animated } from 'react-native';

const MoodTrackerScreen = () => {
  const [dragPosition, setDragPosition] = useState(new Animated.ValueXY());
  const pan = useRef(new Animated.ValueXY()).current;

//   onPanResponderMove: (e, gestureState) => {
//     setPosition({
//       x: initialPosition.x + gestureState.dx,
//       y: initialPosition.y + gestureState.dy,
//     });
//   },


  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      pan.setOffset({
        y: pan.y._value,
        x: 0,
      });
    },
    // fires as much as possible while being dragged
    onPanResponderMove: Animated.event(
      [
        null,
        { dy: pan.y }
      ],
      { useNativeDriver: false }
    ),
     onPanResponderRelease: (...args) => {
       pan.flattenOffset();
       console.log('onPanResponderRelease', {...args[1]});
        Animated.spring(pan, {
          toValue: { x: -120, y: pan.y._value },
          duration: 1800,
          useNativeDriver: false
        }).start();
  }});

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>How Are You Doing?</Text>
      <View style={styles.lineContainer}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.circle,
            pan.getLayout()
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  headerText: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    height: 2,
    width: 50, // Adjust the length of the line as needed
    backgroundColor: 'black',
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'blue',
  },
});

export default MoodTrackerScreen;
