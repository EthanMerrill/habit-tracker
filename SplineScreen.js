import React, { useState } from 'react';
import { StyleSheet, View, PanResponder, Animated } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

const SplineScreen = () => {
  const [points, setPoints] = useState([
    { x: 20, y: 150 },
    { x: 200, y: 50 },
    { x: 350, y: 150 },
  ]);

  const panResponderArray = points.map((_, index) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [
          null,
          {
            moveX: (gesture) => {
              // Update the position of the dragged point
              const updatedPoints = [...points];
              updatedPoints[index] = {
                x: gesture,
                y: points[index].y,
              };
              setPoints(updatedPoints);
            },
            moveY: (gesture) => {
              // Update the position of the dragged point
              const updatedPoints = [...points];
              updatedPoints[index] = {
                x: points[index].x,
                y: gesture,
              };
              setPoints(updatedPoints);
            },
          },
        ],
        { useNativeDriver: false }
      ),
    })
  );

  const renderPoints = () => {
    return points.map((point, index) => (
      <Animated.View
        key={index}
        {...panResponderArray[index].panHandlers}
        style={[
          styles.point,
          {
            transform: [
              { translateX: point.x - 10 },
              { translateY: point.y - 10 },
            ],
          },
        ]}
      >
        <Circle cx={10} cy={10} r={10} fill="blue" />
      </Animated.View>
    ));
  };

  const interpolateSpline = (t) => {
    // Simple linear interpolation for demonstration
    const x = (1 - t) ** 2 * points[0].x + 2 * (1 - t) * t * points[1].x + t ** 2 * points[2].x;
    const y = (1 - t) ** 2 * points[0].y + 2 * (1 - t) * t * points[1].y + t ** 2 * points[2].y;
    return { x, y };
  };

  const renderSpline = () => {
    const pathData = `M${points[0].x},${points[0].y} Q${points[1].x},${points[1].y} ${points[2].x},${points[2].y}`;
    return <Path d={pathData} fill="transparent" stroke="red" strokeWidth={2} />;
  };

  return (
    <View style={styles.container}>
      <Svg style={{ flex: 1 }}>
        {renderSpline()}
        {renderPoints()}
      </Svg>
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
  },
});

export default SplineScreen;
