import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import AnimalInfoScreen from '../screens/AnimalInfoScreen';
import CameraScreen from '../screens/CameraScreen.tsx';
import HistoryScreen from '../screens/HistoryScreen'; // Adjust the path as necessary

type RootStackParamList = {
  Camera: undefined;
  History: undefined;
  GalleryScreen: undefined; // Update the route name here
  AnimalInfoScreen: {
    imagePath: string;
    animalInfo: {
      imagePath: string;
      commonName: string;
      scientificName: string;
      classification: Record<string, string>;
      characteristics: {
        habitat: string;
        diet: string;
        lifespan: string;
        size: {
          length: string;
          height: string;
          weight: string;
        };
        color: string;
        distinctiveFeatures: string;
      };
      behaviors: Record<string, string>;
      conservationStatus: string;
      geographicalDistribution: Record<string, string | string[]>;
      observations: Record<string, string>;
    };
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{title: 'Kamera'}}
      />
      <Stack.Screen
        name="AnimalInfoScreen"
        component={AnimalInfoScreen}
        options={{
          title: 'Informacija apie Gyvūna',
          headerBackTitleVisible: true,
          headerBackTitle: 'Camera',
        }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{title: 'Istorija'}}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;

export type AnimalInfoScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AnimalInfoScreen'
>;
