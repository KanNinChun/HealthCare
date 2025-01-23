import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ThemedView } from '../ThemedView';
import ThemedText from '../ThemedText';
import { Accelerometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { SafeAreaView } from 'react-native-safe-area-context';

// Helper to get today's date key
const getTodayKey = () => format(new Date(), 'yyyy-MM-dd');

const test = () => {
    const [stepCount, setStepCount] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [lastSavedDate, setLastSavedDate] = useState<string | null>(null);
    const [isCounting, setIsCounting] = useState(false);
    const [lastY, setLastY] = useState(0);
    const [lastTimeStamp, setLastTimeStamp] = useState(0);
    const [showTotalSteps, setShowTotalSteps] = useState(false);
    const [stepHistory, setStepHistory] = useState<Record<string, number>>({});
    const [todayKey, setTodayKey] = useState(getTodayKey());

    const Calories_Per_Step = 0.5;
    const EstimatedCaloriesBurned = stepCount * Calories_Per_Step;

    const startTracking = useCallback(() => {
        setIsCounting(true);

    }, []);

    const stopTracking = useCallback(async () => {
        setIsCounting(false);
        setShowTotalSteps(true);
        try {
            const todayKey = getTodayKey();
            const userId = await AsyncStorage.getItem('userToken');
            if (!userId) return;

            const existingData = await AsyncStorage.getItem(`stepHistory_${userId}`);
            const updatedHistory = existingData ? JSON.parse(existingData) : {};

            // Get current steps for today
            const currentSteps = updatedHistory[todayKey] || 0;

            // Add new steps to existing steps for today
            updatedHistory[todayKey] = currentSteps + stepCount;

            // Save updated history with user-scoped key
            await AsyncStorage.setItem(`stepHistory_${userId}`, JSON.stringify(updatedHistory));

            // Update state with new history
            setStepHistory(updatedHistory);

            // Reset step counter for next session
            setStepCount(0);

            //Debug use
            // Alert.alert(
            //     'Steps Saved',
            //     `Added ${stepCount} steps to ${todayKey}\nTotal steps today: ${stepHistory[todayKey]}\n\nFull History:\n${JSON.stringify(stepHistory, null, 2)}`,
            //     [{ text: 'OK' }]
            // );

        } catch (error) {
            console.error('Failed to save step data:', error);
            Alert.alert('Error', 'Failed to save step data');
        }
    }, [stepCount]);

    // Load existing step history on mount
    useEffect(() => {
        const loadStepHistory = async () => {
            try {
                const history = await AsyncStorage.getItem('stepHistory');
                if (history) {
                    const parsedHistory = JSON.parse(history);
                    const todayKey = getTodayKey();
                    if (parsedHistory[todayKey]) {
                        setStepCount(parsedHistory[todayKey]);
                    }
                }
            } catch (error) {
                console.error('Failed to load step history:', error);
            }
        };

        loadStepHistory();
    }, []);

    // Load saved steps for today
    useEffect(() => {
        let subscription: { remove: () => void } | undefined;
        Accelerometer.isAvailableAsync().then((result) => {
            if (result) {
                subscription = Accelerometer.addListener((accelerationData) => {
                    const { y } = accelerationData;
                    const threshold = 0.2;
                    const timeStamp = new Date().getTime();

                    if (isCounting &&
                        Math.abs(y - lastY) > threshold &&
                        (timeStamp - lastTimeStamp > 500)
                    ) {
                        setLastY(y);
                        setLastTimeStamp(timeStamp);
                        setStepCount((prevSteps) => prevSteps + 1);
                    }
                });
            } else {
                console.log('Accelerometer not available');
            }
        });
        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, [isCounting, lastY, lastTimeStamp]);

    return (
        <SafeAreaView style={styles.container}>
            <ThemedView style={styles.container2}>
                <ThemedView style={styles.content}>
                    <ThemedText style={styles.stepLabel}>Steps</ThemedText>
                    <ThemedText style={styles.stepCount}>{stepCount}</ThemedText>

                    <ThemedView style={styles.Caloriescontainer}>
                        <ThemedText>Estimate Calories Burned: </ThemedText>
                        <ThemedText style={styles.caloriesText}>{EstimatedCaloriesBurned.toFixed(2)} kcal</ThemedText>
                    </ThemedView>
                </ThemedView>
                <ThemedView style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, isCounting ? styles.stopButton : styles.startButton]}
                        onPress={isCounting ? stopTracking : startTracking}
                    >
                        <ThemedText style={styles.buttonText}>
                            {isCounting ? 'Stop Tracking' : 'Start Tracking'}
                        </ThemedText>
                    </TouchableOpacity>
                </ThemedView>


                {showTotalSteps && (
                    <ThemedView style={styles.totalStepsContainer}>
                        <ThemedText style={styles.totalStepsLabel}>Today's Total Steps</ThemedText>
                        <ThemedText style={styles.totalStepsCount}>
                            {stepHistory[todayKey] || 0}
                        </ThemedText>
                    </ThemedView>
                )}

            </ThemedView>
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    Caloriescontainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
    },
    container2: {
        flex: 1,
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
    buttonContainer: {
        flex: 1,
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
        textAlign: 'center',
    },
    errorText: {
        color: '#FF4444',
        fontSize: 16,
        textAlign: 'center',
        margin: 20,
    },
    resetButton: {
        backgroundColor: '#FF4444',
        marginTop: 20,
    },
    savedInfo: {
        marginTop: 20,
        fontSize: 14,
        color: '#666',
    },
    caloriesText: {
        marginLeft: 8,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    totalStepsContainer: {
        marginTop: 20,
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
    },
    totalStepsLabel: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    totalStepsCount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
});

export default test;