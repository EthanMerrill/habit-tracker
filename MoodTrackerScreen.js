import React, { useState } from 'react';
import { StyleSheet, View, Text, PanResponder, Animated } from 'react-native';

const MoodTrackerScreen = () => {
  const [dragPosition] = useState(new Animated.ValueXY({ x: 0, y: 0 }));

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {
      // Limit dragging to vertical movement
      Animated.event([null, { dy: dragPosition.y }], {useNativeDriver:false})(event, gesture);
      console.log('dragPosition.y', dragPosition.y)
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>How Are You Doing?</Text>
      <View style={styles.lineContainer}>
        <View style={styles.line} />
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.circle,
            { transform: [{ translateY: dragPosition.y }] },
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
    marginLeft: -25,
  },
});

export default MoodTrackerScreen;
