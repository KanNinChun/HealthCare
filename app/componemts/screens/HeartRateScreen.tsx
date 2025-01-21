import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet,TouchableOpacity } from 'react-native';
import {FlashMode, CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';

const HeartRateMonitor = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const isFocused = 'on'
  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
    
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} enableTorch={true}> {/* enableTorch == flashing light on all the time*/}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity> 
        </View>
      </CameraView>
    </View>
  );
};
 

//   const processPPGSignal = (frames: any[]) => {
//     const peaks = detectPeaks(frames);
//     const heartRateValue = (peaks / 15) * 60; // Calculate per minute heart rate
//     setHeartRate(heartRateValue);
//   };

//   const detectPeaks = (frames: any[]): number => {
//     // Implement peak detection logic
//     return frames.length / 2; // Dummy implementation
//   };

//   const startHeartRateMeasurement = async () => {
//     if (cameraRef.current) {
//       const frames: any[] = [];
//       const startTime = Date.now();

//       const captureFrames = async () => {
//         if (Date.now() - startTime < 15000) {
//           const frame = await cameraRef.current.takePictureAsync(); // Use takePictureAsync
//           frames.push(frame);
//           requestAnimationFrame(captureFrames);
//         } else {
//           processPPGSignal(frames);
//         }
//       };

//       captureFrames();
//     }
//   };



//   return (
//     <View style={styles.container}>
//       {isFocused && (
//         <Camera ref={cameraRef} style={styles.camera} type={CameraType.back} />
//       )}
//       <Button title="Start Measurement" onPress={startHeartRateMeasurement} />
//       {heartRate && <Text style={styles.text}>Estimated Heart Rate: {heartRate.toFixed(0)} BPM</Text>}
//     </View>
//   );


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
  title: {
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  linkText: {
    marginTop: 15,
    textAlign: 'center',
  },
  iconButton: {
    padding: 10,
    position: 'absolute',
    right: 0,
    marginVertical: 10,
  },
  lightContainer: {
    color: '#191919',
    backgroundColor: '#FFFFFF',
  },
  darkContainer: {
    color: '#d1d1d1',
    backgroundColor: '#000105',
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

// Exporting the component
export default HeartRateMonitor;
