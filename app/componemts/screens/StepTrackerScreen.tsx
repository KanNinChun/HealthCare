import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedView } from '../ThemedView';
import ThemedText from '../ThemedText';
import { DeviceMotion } from 'expo-sensors';
import * as Location from 'expo-location';
import type { Subscription } from 'expo-sensors/build/DeviceSensor';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Acceleration {
    x: number;
    y: number;
    z: number;
    timestamp: number;
}

const StepTrackerScreen = () => {
    const [isTracking, setIsTracking] = useState(false);
    const [stepCount, setStepCount] = useState(0);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null);
    const [lastAcceleration, setLastAcceleration] = useState<Acceleration | null>(null);
    const [lastLocation, setLastLocation] = useState<Location.LocationObject | null>(null);
    const STEP_THRESHOLD = 0.8; // Lower threshold for better sensitivity
    const MIN_STEP_INTERVAL = 200; // Shorter interval for faster walking
    const STEP_DISTANCE = 0.5; // Reduced distance requirement
    const [lastStepTime, setLastStepTime] = useState<number>(0);
    const [stepHistory, setStepHistory] = useState<Record<string, number>>({});
    const [isLocationEnabled, setIsLocationEnabled] = useState(false);

    // Get current date in YYYY-MM-DD format
    const getCurrentDate = () => {
        const now = new Date();
        return now.toISOString().split('T')[0];
    };

    // Save step count to AsyncStorage
    const saveStepData = async (date: string, steps: number) => {
        try {
            const newHistory = { ...stepHistory, [date]: steps };
            await AsyncStorage.setItem('stepHistory', JSON.stringify(newHistory));
            setStepHistory(newHistory);
        } catch (error) {
            console.error('Failed to save step data:', error);
        }
    };

    // Load step history from AsyncStorage
    const loadStepHistory = async () => {
        try {
            const storedData = await AsyncStorage.getItem('stepHistory');
            if (storedData) {
                const history = JSON.parse(storedData);
                setStepHistory(history);
                
                // Initialize step count with today's steps if available
                const today = getCurrentDate();
                if (history[today]) {
                    setStepCount(history[today]);
                }
            }
        } catch (error) {
            console.error('Failed to load step history:', error);
        }
    };

    // Smooth acceleration data using moving average
    const smoothAcceleration = (current: Acceleration, previous: Acceleration | null): Acceleration => {
        const smoothingFactor = 0.8;
        if (!previous) return current;
        
        return {
            x: previous.x * smoothingFactor + current.x * (1 - smoothingFactor),
            y: previous.y * smoothingFactor + current.y * (1 - smoothingFactor),
            z: previous.z * smoothingFactor + current.z * (1 - smoothingFactor),
            timestamp: current.timestamp
        };
    };

    const startTracking = async () => {
        try {
            // Request motion permissions
            const [motionStatus, locationStatus] = await Promise.all([
                DeviceMotion.requestPermissionsAsync(),
                Location.requestForegroundPermissionsAsync()
            ]);

            if (motionStatus.status !== 'granted') {
                alert('Please enable motion tracking permissions in settings to use this feature');
                return;
            }

            if (locationStatus.status !== 'granted') {
                alert('Location permissions are required for accurate step tracking');
                setIsLocationEnabled(false);
            } else {
                setIsLocationEnabled(true);
                // Start location tracking
                const locSub = await Location.watchPositionAsync({
                    accuracy: Location.Accuracy.BestForNavigation,
                    timeInterval: 1000,
                    distanceInterval: 1
                }, (location) => {
                    setLastLocation(location);
                });
                setLocationSubscription(locSub);
            }

            const isAvailable = await DeviceMotion.isAvailableAsync();
            if (!isAvailable) {
                alert('Motion tracking is not available on this device');
                return;
            }

            setIsTracking(true);
            DeviceMotion.setUpdateInterval(100);
            
            const sub = DeviceMotion.addListener(({ acceleration }) => {
                if (acceleration) {
                    detectStep(acceleration);
                }
            });
            setSubscription(sub);
        
        } catch (error) {
            console.error('Failed to start tracking:', error);
            alert('Failed to start step tracking. Please try again.');
        }
    };

    // Load step history when component mounts
    useEffect(() => {
        loadStepHistory();
    }, []);

    // Save step count when it changes
    useEffect(() => {
        const today = getCurrentDate();
        saveStepData(today, stepCount);
    }, [stepCount]);

    const detectStep = (acceleration: Acceleration) => {
        const now = Date.now();
        const smoothedAccel = smoothAcceleration(acceleration, lastAcceleration);
        
        if (!lastAcceleration) {
            setLastAcceleration(smoothedAccel);
            return;
        }

        // Calculate acceleration magnitude
        const currentMagnitude = Math.sqrt(
            Math.pow(smoothedAccel.x, 2) +
            Math.pow(smoothedAccel.y, 2) +
            Math.pow(smoothedAccel.z, 2)
        );

        const lastMagnitude = Math.sqrt(
            Math.pow(lastAcceleration.x, 2) +
            Math.pow(lastAcceleration.y, 2) +
            Math.pow(lastAcceleration.z, 2)
        );

        const delta = Math.abs(currentMagnitude - lastMagnitude);

        // Step detection conditions
        const isStep = (
            delta > STEP_THRESHOLD && // Minimum acceleration change
            (now - lastStepTime) > MIN_STEP_INTERVAL && // Minimum time between steps
            smoothedAccel.z > 0.5 && // Minimum vertical movement
            Math.abs(smoothedAccel.x) < 1.5 && // Limit horizontal movement
            Math.abs(smoothedAccel.y) < 1.5 // Limit sideways movement
        );

        const gpsValid = validateStepWithGPS();
        if (isStep) {
            if (!gpsValid) {
                console.log('檢測到步伐但GPS驗證失敗');
            } else {
                console.log('檢測到有效步伐');
                setStepCount(prev => prev + 1);
                setLastStepTime(now);
            }
        } else {
            console.log('未檢測到步伐 - 條件:', {
                delta,
                timeSinceLast: now - lastStepTime,
                z: smoothedAccel.z,
                x: smoothedAccel.x,
                y: smoothedAccel.y
            });
        }
        setLastAcceleration(smoothedAccel);
    };

    const stopTracking = () => {
        if (subscription) {
            subscription.remove();
            setSubscription(null);
        }
        if (locationSubscription) {
            locationSubscription.remove();
            setLocationSubscription(null);
        }
        setIsTracking(false);
        setLastLocation(null);
    };

    const validateStepWithGPS = (): boolean => {
        if (!isLocationEnabled || !lastLocation) {
            console.log('GPS驗證跳過 - 位置服務未啟用或不可用');
            return true;
        }
        
        // Calculate distance since last step
        const currentLocation = lastLocation.coords;
        if (!currentLocation || !currentLocation.latitude || !currentLocation.longitude) {
            console.log('GPS驗證跳過 - 無效的位置數據');
            return true;
        }
        
        // If we don't have previous location, assume step is valid
        if (!lastLocation) {
            console.log('GPS驗證跳過 - 無先前位置數據');
            return true;
        }
        
        // Haversine formula implementation
        const toRad = (x: number) => x * Math.PI / 180;
        const R = 6371000; // Earth radius in meters
        const dLat = toRad(currentLocation.latitude - lastLocation.coords.latitude);
        const dLon = toRad(currentLocation.longitude - lastLocation.coords.longitude);
        const a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lastLocation.coords.latitude)) *
            Math.cos(toRad(currentLocation.latitude)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        // Validate step based on distance
        const isValid = distance >= STEP_DISTANCE * 0.3; // More lenient margin for error
        console.log('GPS validation result:', {
            distance,
            required: STEP_DISTANCE * 0.3,
            isValid
        });
        return isValid;
    };

    useEffect(() => {
        return () => {
            if (subscription) {
                subscription.remove();
            }
            if (locationSubscription) {
                locationSubscription.remove();
            }
        };
    }, [subscription, locationSubscription]);

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.content}>
                <ThemedText style={styles.stepCount}>{stepCount}</ThemedText>
                <ThemedText style={styles.stepLabel}>Steps</ThemedText>
                
                <TouchableOpacity 
                    style={[styles.button, isTracking ? styles.stopButton : styles.startButton]}
                    onPress={isTracking ? stopTracking : startTracking}
                >
                    <ThemedText style={styles.buttonText}>
                        {isTracking ? 'Stop Tracking' : 'Start Tracking'}
                    </ThemedText>
                </TouchableOpacity>
            </ThemedView>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepCount: {
        paddingVertical: 30,
        fontSize: 50,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    stepLabel: {
        fontSize: 24,
        marginBottom: 40,
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
    },
    startButton: {
        backgroundColor: '#4CAF50',
    },
    stopButton: {
        backgroundColor: '#F44336',
    },
    buttonText: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default StepTrackerScreen;