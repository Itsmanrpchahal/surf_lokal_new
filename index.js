/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';

// Rest of your code...

Animatable.initializeRegistryWithDefinitions({
  flipInY: {
    from: {
      rotateY: '270deg',
    },
    to: {
      rotateY: '0deg',
    },
  },
});

AppRegistry.registerComponent(appName, () => App);
