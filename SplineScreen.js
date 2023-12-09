import React, { useState } from 'react';
import { StyleSheet, View, PanResponder, Animated } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

const SplineScreen = () => {
  const [pointValues] = useState(
    Array.from({ length: 3 }, () => new Animated.ValueXY({ x: 0, y: 0 }))
  );

  const panResponderArray = pointValues.map((pointValue, index) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [
          null,
          {
            dx: pointValue.x,
            dy: pointValue.y,
          },
        ],
        { useNativeDriver: false }
      ),
    })
  );

  const renderPoints = () => {
    return pointValues.map((pointValue, index) => (
      <Animated.View
        key={index}
        {...panResponderArray[index].panHandlers}
        style={[
          styles.point,
          {
            transform: [
              { translateX: pointValue.x },
              { translateY: pointValue.y },
            ],
          },
        ]}
      />
    ));
  };

  const interpolateSpline = (t) => {
    // Simple linear interpolation for demonstration
    const x =
      (1 - t) ** 2 * pointValues[0].x._value +
      2 * (1 - t) * t * pointValues[1].x._value +
      t ** 2 * pointValues[2].x._value;
    const y =
      (1 - t) ** 2 * pointValues[0].y._value +
      2 * (1 - t) * t * pointValues[1].y._value +
      t ** 2 * pointValues[2].y._value;
    return { x, y };
  };

  const renderSpline = () => {
    const pathData = `M${points[0].x},${points[0].y} Q${points[1].x},${points[1].y} ${points[2].x},${points[2].y}`;
    return <Path d={pathData} fill="transparent" stroke="red" strokeWidth={2} />;
  };

  return (
    <View style={styles.container}>
      {renderSpline()}
      {renderPoints()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eaeaea',
  },
  point: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'blue',
  },
  spline: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: 'red',
  },
});

export default SplineScreen;
