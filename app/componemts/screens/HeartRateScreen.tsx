import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { FlashMode, CameraView, CameraType, useCameraPermissions } from 'expo-camera';

// https://docs.expo.dev/versions/latest/sdk/camera/#enabletorch

const HeartRateMonitor = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {

    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} enableTorch={true}>

      </CameraView>
    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  camera: {
    flex: 1,
    width: '100%',
   
  },
  text: {
    margin: 10,
    fontSize: 18,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    margin: 0,
  },
});

export default HeartRateMonitor;