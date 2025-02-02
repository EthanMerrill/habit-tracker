// filepath: /Users/ethanmerrill/Documents/Code/HabitTracker/habit-tracker/src/app/index.js
import { registerRootComponent } from 'expo';
import RootNavigator from '../navigation/RootNavigator'; // Adjust the import path as needed

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(RootNavigator);

