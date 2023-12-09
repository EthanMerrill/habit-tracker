// App.js

import React from 'react';
import { StyleSheet, View } from 'react-native';
import MoodTrackerScreen from './MoodTrackerScreen'; // Assuming the component file is in the same directory
import SplineScreen from './SplineScreen';
import PanHandlerExample from './PanHandlerExample';

export default function App() {
  return (
    <View style={styles.container}>
      <MoodTrackerScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
