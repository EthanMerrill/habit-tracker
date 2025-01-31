import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, PanResponder, Animated, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const MoodTrackerScreen = () => {
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const pan = useRef(new Animated.ValueXY()).current;
  const { height, width } = useWindowDimensions();

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
      {
        //listener: (event, gestureState) => setDragPosition({ x: 0, y: gestureState.dy }),
        useNativeDriver: false
      }
    ),
    onPanResponderRelease: (...args) => {
      pan.flattenOffset();
      console.log('onPanResponderRelease', { ...args[1] });
      Animated.spring(pan, {
        toValue: { x: -120, y: pan.y._value },
        duration: 2200,
        useNativeDriver: false
      }).start();

    }
  });

  useEffect(() => {
    console.log('dragPosition', pan.getLayout());
  }
    , [pan.getLayout()]);

  return (
    <View style={styles.container}>
      <Svg style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, height: height, width: width }}>
        <Path d={`M0 ${height / 2} L50 ${pan.y._value}`} stroke="black" strokeWidth={8} />
      </Svg>
      <Text style={styles.headerText}>How Are You Doing?</Text>
      <Animated.View 
        {...panResponder.panHandlers}

      />
      <View style={styles.lineContainer}>

        <Animated.View
          {...panResponder.panHandlers}
          {...console.log('pan', pan.getLayout())}
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
    width: '100%',
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



