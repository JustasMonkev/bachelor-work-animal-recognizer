import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ImageProvider} from './src/utils/ImageStore';
import AppNavigator from './src/components/AppNavigator';
import {colors} from './src/theme/colors';

createNativeStackNavigator();

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    primary: colors.primary,
    card: colors.surface,
    text: colors.text,
    border: colors.muted,
  },
};

export default function App() {
  return (
    <ImageProvider>
      <NavigationContainer theme={AppTheme}>
        <AppNavigator />
      </NavigationContainer>
    </ImageProvider>
  );
}
