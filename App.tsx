import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ImageProvider} from './src/utils/ImageStore';
import AppNavigator from './src/components/AppNavigator';

createNativeStackNavigator();
export default function App() {
  return (
    <ImageProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </ImageProvider>
  );
}
