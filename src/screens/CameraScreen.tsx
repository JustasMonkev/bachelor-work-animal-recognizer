import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {useImages} from '../utils/ImageStore';
import CameraButtons from '../components/CameraButtons';
import {PERMISSIONS, request} from 'react-native-permissions';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProp} from '../components/AppNavigator.tsx';
import {getImageForApi} from '../utils/utils.ts';
import {launchImageLibrary} from 'react-native-image-picker';
import {useFocusEffect} from '@react-navigation/native';

export default function CameraScreen() {
  const {addImage} = useImages();
  const navigation = useNavigation<RootNavigationProp>();

  const camera = useRef(null);
  const device = useCameraDevice('back', {
    physicalDevices: ['wide-angle-camera'],
  });
  const [cameraPermission, setCameraPermission] = useState(false);
  const [storagePermission, setStorageStatus] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [imageSource, setImageSource] = useState('');
  const [capturedPhoto, setCapturedPhoto] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastCapturedImage, setLastCapturedImage] = useState('');

  // useFocusEffect(
  //   React.useCallback(() => {
  //     // Reset the necessary state variables when the screen comes into focus
  //     setShowCamera(true);
  //     setIsButtonDisabled(false);
  //     setIsLoading(false);
  //
  //     return () => {};
  //   }, []),
  // );

  useEffect(() => {
    async function getPermissions() {
      const newCameraPermission = await request(PERMISSIONS.ANDROID.CAMERA);
      const storageStatus = await request(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      );

      console.log(newCameraPermission);
      setCameraPermission(newCameraPermission === 'granted');
      setStorageStatus(storageStatus === 'granted');
    }
    getPermissions();
    setShowCamera(true);
  }, []);

  useEffect(() => {
    if (cameraPermission) {
      setShowCamera(true);
    }
  }, [cameraPermission, storagePermission]);

  const handleNavigateToHistory = () => {
    navigation.navigate('History'); // Make sure the screen name matches your configuration
  };

  const capturePhoto = async () => {
    if (isButtonDisabled) {
      // If there's already a pending photo capture request, return early
      return;
    }

    setIsButtonDisabled(true); // Set the flag to true to indicate a photo capture is in progress

    if (camera.current !== null) {
      try {
        const photo = await (camera.current as any).takePhoto({
          qualityPrioritization: 'speed',
          enableShutterSound: false,
        });
        setImageSource(photo.path);
        setCapturedPhoto(photo.path);
        setShowCamera(false);
        console.log(photo.path);
      } catch (error) {
        console.error('Error capturing photo:', error);
        Alert.alert('Error', 'Failed to capture photo');
      } finally {
        setIsButtonDisabled(false); // Reset the flag after the photo capture is completed
      }
    }
  };

  const saveImage = async () => {
    if (!showCamera) {
      try {
        const result = await CameraRoll.saveAsset(capturedPhoto, {
          type: 'photo',
        });

        if (!result) {
          Alert.alert('Error', 'Failed to capture photo');
          return;
        }

        // Show the loader
        setIsLoading(true);

        // Get the animal info from the API
        const animalInfo = await getImageForApi(capturedPhoto);

        if (!animalInfo) {
          Alert.alert('Error', 'Failed to retrieve animal info', [
            {
              text: 'OK',
              onPress: () => {
                // Hide the loader when the user dismisses the error alert\
                setIsLoading(false);
                setShowCamera(true);
              },
            },
          ]);
          return;
        }

        // Hide the loader
        setIsLoading(false);

        // Navigate to the AnimalInfoScreen with the image path and animal info
        navigation.navigate('AnimalInfoScreen', {
          imagePath: capturedPhoto,
          animalInfo: animalInfo,
        });

        // Add the image to the gallery or perform any other necessary actions
        addImage(capturedPhoto);
        setLastCapturedImage(capturedPhoto);
        animalInfo.imagePath = `file://${imageSource}`;
      } catch (error) {
        console.error('Error saving photo:', error);
        Alert.alert('Error', 'Failed to save photo', [
          {
            text: 'OK',
            onPress: () => {
              // Hide the loader when the user dismisses the error alert
              setIsLoading(false);
            },
          },
        ]);
      }
    }
  };

  async function requestStoragePermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        {
          title: 'Storage Permission Required',
          message:
            'App needs access to your storage to pick images from the gallery.',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage permission granted');
        return true;
      } else {
        console.log('Storage permission denied');
        return false;
      }
    } catch (error) {
      console.error('Error requesting storage permission:', error);
      return false;
    }
  }

  const handleImagePicker = async () => {
    try {
      const hasPermission = await requestStoragePermission();
      console.log('Storage permission granted:', hasPermission);
      if (!hasPermission) {
        Alert.alert(
          'Permission Denied',
          'Storage permission is required to access the gallery.',
        );
        return;
      }

      const result = await launchImageLibrary(
        {
          mediaType: 'photo',
          includeBase64: false,
          quality: 1,
        },
        response => {
          console.log('Image picker response:', response);
        },
      );

      if (result.didCancel) {
        console.log('User cancelled image picker');
      } else if (result.errorCode) {
        console.log('ImagePicker Error: ', result.errorMessage);
      } else if (result.assets) {
        console.log(result.assets[0].uri + ' is already');
      } else {
        console.log('Unexpected result structure:', result);
      }

      if (
        !result.didCancel &&
        !result.errorCode &&
        result.assets &&
        result.assets.length > 0
      ) {
        const selectedImage = result.assets[0].uri;
        console.log('Selected image URI:', selectedImage);
        setImageSource(selectedImage!);
        setCapturedPhoto(selectedImage!);
        setShowCamera(false);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };

  if (!cameraPermission) {
    return (
      <View style={styles.container}>
        <Text>Please grant camera permission to use the camera</Text>
      </View>
    );
  }

  if (device == null) {
    return <Text>Camera not available</Text>;
  }

  return (
    <View style={styles.container}>
      {showCamera ? (
        <>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={showCamera}
            photo={true}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => capturePhoto()}>
              <Image
                source={require('./search-icon.png')}
                style={styles.searchIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.galleryButton}
              onPress={handleImagePicker}>
              {lastCapturedImage ? (
                <Image
                  source={{
                    uri: `file://${lastCapturedImage}`,
                  }}
                  style={styles.galleryImage}
                />
              ) : (
                <Text style={styles.galleryButtonText}>Galerija</Text>
              )}
            </TouchableOpacity>
            {lastCapturedImage ? (
              <TouchableOpacity
                style={styles.historyButton}
                onPress={handleNavigateToHistory}>
                <Text style={styles.historyButtonText}>Istorija</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </>
      ) : (
        <>
          {imageSource !== '' ? (
            <Image
              style={styles.image}
              source={{
                uri: `file://${imageSource}`,
              }}
            />
          ) : null}
          <View style={styles.buttonContainer}>
            <CameraButtons
              setShowCamera={setShowCamera}
              saveImage={saveImage}
              disableButton={isButtonDisabled}
            />
          </View>
        </>
      )}
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'gray',
  },
  buttonContainer: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    bottom: 0,
    padding: 20,
  },
  camButton: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: '#B2BEB5',
    alignSelf: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  image: {
    width: '100%',
    height: '100%',
    aspectRatio: 9 / 16,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  navigationButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  navigationButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    width: 24,
    height: 24,
  },
  galleryButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  galleryButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  historyButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
