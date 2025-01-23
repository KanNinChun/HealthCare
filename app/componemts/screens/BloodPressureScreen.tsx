import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedView } from '../ThemedView';
import ThemedText from '../ThemedText';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BloodPressureScreen = () => {
    const navigation = useNavigation(); // Initialize navigation
    return (
        <SafeAreaView style={styles.container}>
            <ThemedView style={styles.container2}>
                <TouchableOpacity style={styles.exitButton} onPress={() => {
                    navigation.goBack(); // Use navigation to go back
                }}>
                    <ThemedText style={styles.exitButtonText}>X</ThemedText>
                </TouchableOpacity>

                <ScrollView>
                    <ThemedText style={styles.header}>血壓概述</ThemedText>

                    <ThemedText style={styles.sectionHeader}>1. 什麼是血壓？</ThemedText>
                    <ThemedText style={styles.content}>
                        血壓是指血液在血管內流動時對血管壁施加的力量。它通常以毫米汞柱（mmHg）為單位來測量，並由兩個數值組成：收縮壓（心臟收縮時的壓力）和舒張壓（心臟放鬆時的壓力）。血壓的測量對於評估心血管健康至關重要。
                    </ThemedText>

                    <ThemedText style={styles.sectionHeader}>2. 正常血壓是多少？</ThemedText>
                    <ThemedText style={styles.content}>
                        正常的血壓範圍通常被認為是收縮壓低於120 mmHg和舒張壓低於80 mmHg（即120/80 mmHg）。多種因素，如年齡、體重、運動和飲食，都可能影響血壓讀數。
                    </ThemedText>

                    <ThemedText style={styles.sectionHeader}>3. 什麼是高血壓？</ThemedText>
                    <ThemedText style={styles.content}>
                        高血壓是指血壓持續高於正常範圍，通常定義為收縮壓高於130 mmHg或舒張壓高於80 mmHg。高血壓的潛在原因包括遺傳、飲食不當、缺乏運動和壓力。持續的高血壓可能導致心臟病、中風和其他健康問題，因此監測和管理血壓至關重要。
                    </ThemedText>

                    <ThemedText style={styles.sectionHeader}>4. 血壓管理不當的缺點</ThemedText>
                    <ThemedText style={styles.content}>
                        血壓管理不當可能導致多種健康問題，包括心臟病、中風和腎臟疾病。這些問題不僅影響身體健康，還可能對心理健康造成負面影響，導致焦慮和抑鬱等情緒問題。
                    </ThemedText>
                </ScrollView>
            </ThemedView>
        </SafeAreaView>
    );
}

export default BloodPressureScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    container2: {
        flex: 1,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        paddingTop: 15,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    content: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 15,
    },
    exitButton: {
        alignItems: 'flex-end',
        position: 'relative',
        top: 15,
        right: 0, 
        backgroundColor: 'transparent', 
        paddingTop: 15,
    },
    exitButtonText: {
        fontSize: 24,
        color: 'red', 
    },
});