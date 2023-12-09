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
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([
      null,
      {
        dx: pan.x, // x,y are Animated.Value
        dy: pan.y,
      },
    ]),
     onPanResponderRelease: () => {
        pan.setOffset({ x: dx, y: dy});
    //     Animated.spring(
    //       pan, // Auto-multiplexed
    //       {toValue: {x: 0, y: 0}, useNativeDriver: true}, // Back to zero
    //     ).start();
       },
  });

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
