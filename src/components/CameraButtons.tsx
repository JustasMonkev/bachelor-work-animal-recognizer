import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {colors} from '../utils/theme';

interface CameraButtonsProps {
  setShowCamera: (showCamera: boolean) => void;
  saveImage: () => Promise<void> | void;
  disableButton: boolean;
}

export default function CameraButtons({
  setShowCamera,
  saveImage,
  disableButton,
}: CameraButtonsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setShowCamera(true)}
        accessibilityLabel="Retake Photo">
        <Icon name="close" size={32} color={colors.surface} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={saveImage}
        disabled={disableButton}
        accessibilityLabel="Save Photo">
        <Icon name="check" size={32} color={colors.surface} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  closeButton: {
    backgroundColor: colors.error,
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: colors.secondary,
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
