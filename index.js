/**
 * @format
 */

import 'react-native-gesture-handler';
import 'react-native-screens';
import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

// Ignore log notification by message:
LogBox.ignoreLogs(['Warning: ...']);

