// import React, { useRef, useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { SprenView as OriginalSprenView } from '@spren/react-native';

// interface IStateChange {
//     state: string;
// }

// interface IProgressChange {
//     progress: number;
// }

// interface IReadingDataReady {
//     data: { BPM: number };
// }

// interface SprenViewProps {
//     onStateChange: (event: IStateChange) => void;
//     onProgressUpdate: (event: IProgressChange) => void;
//     onReadingDataReady: (event: IReadingDataReady) => void;
//     style?: any;
//     children?: React.ReactNode;
// }

// // Extend the original SprenView to add types for methods
// class SprenView extends OriginalSprenView {
//     getReadingData: () => Promise<any>;
//     cancelReading: () => void;
//     captureStart: () => void;
//     captureStop: () => void;
// }

// const HeartRateMonitor: React.FC = () => {
//   const sprenRef = useRef<SprenView>(null);
//   const [heartRate, setHeartRate] = useState<number | null>(null);
//   const [readingState, setReadingState] = useState<string>('Not Started');

//   const handleStateChange = (event: IStateChange) => {
//     setReadingState(event.state);
//   };

//   const handleProgressUpdate = (event: IProgressChange) => {
//     console.log(`Progress: ${event.progress}%`);
//   };

//   const handleReadingDataReady = async (event: IReadingDataReady) => {
//     const data = await sprenRef.current?.getReadingData();
//     setHeartRate(data?.BPM ?? null);
//   };

//   const startCapture = () => {
//     sprenRef.current?.captureStart();
//   };

//   const stopCapture = () => {
//     sprenRef.current?.captureStop();
//   };

//   return (
//     <View style={styles.container}>
//       <SprenView
//         ref={sprenRef}
//         onStateChange={handleStateChange}
//         onProgressUpdate={handleProgressUpdate}
//         onReadingDataReady={handleReadingDataReady}
//         style={styles.camera}
//       >
//         <Text style={styles.overlayText}>{readingState}</Text>
//         {heartRate && <Text style={styles.heartRateText}>{heartRate} BPM</Text>}
//         <TouchableOpacity onPress={startCapture} style={styles.button}>
//           <Text style={styles.buttonText}>Start Measurement</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={stopCapture} style={styles.button}>
//           <Text style={styles.buttonText}>Stop Measurement</Text>
//         </TouchableOpacity>
//       </SprenView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#000',
//   },
//   camera: {
//     width: '100%',
//     height: '100%',
//   },
//   overlayText: {
//     position: 'absolute',
//     top: 50,
//     color: '#fff',
//     fontSize: 24,
//   },
//   heartRateText: {
//     position: 'absolute',
//     top: 100,
//     color: '#fff',
//     fontSize: 32,
//   },
//   button: {
//     position: 'absolute',
//     bottom: 50,
//     backgroundColor: '#ff6347',
//     padding: 10,
//     borderRadius: 5,
//     margin: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//   },
// });

// export default HeartRateMonitor;
