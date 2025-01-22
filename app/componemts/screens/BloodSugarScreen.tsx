import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedView } from '../ThemedView';
import ThemedText  from '../ThemedText';
import { useNavigation } from '@react-navigation/native';

const BloodSugarScreen = () => {
    const navigation = useNavigation(); // Initialize navigation
    return (
        <ThemedView style={styles.container}>
            <TouchableOpacity style={styles.exitButton} onPress={() => {
                navigation.goBack(); // Use navigation to go back
            }}>
                <ThemedText style={styles.exitButtonText}>X</ThemedText>
            </TouchableOpacity>
            <ScrollView>
                <ThemedText style={styles.header}>血糖概述</ThemedText>

                <ThemedText style={styles.sectionHeader}>1. 什麼是血糖？</ThemedText>
                <ThemedText style={styles.content}>
                    血糖是指血液中的葡萄糖濃度，對於身體的能量供應至關重要。正常的血糖水平有助於維持身體的健康和功能。
                </ThemedText>

                <ThemedText style={styles.sectionHeader}>2. 正常血糖範圍是多少？</ThemedText>
                <ThemedText style={styles.content}>
                    正常的空腹血糖範圍通常在70到100 mg/dL之間。餐後血糖水平應低於140 mg/dL。多種因素，如飲食、運動和壓力，都可能影響血糖讀數。
                </ThemedText>

                <ThemedText style={styles.sectionHeader}>3. 什麼是高血糖？</ThemedText>
                <ThemedText style={styles.content}>
                    高血糖是指血糖水平持續高於正常範圍，通常定義為空腹血糖高於126 mg/dL。高血糖可能導致糖尿病及其併發症，因此監測和管理血糖至關重要。
                </ThemedText>

                <ThemedText style={styles.sectionHeader}>4. 血糖管理不當的缺點</ThemedText>
                <ThemedText style={styles.content}>
                    血糖管理不當可能導致多種健康問題，包括糖尿病、心臟病和腎臟疾病。這些問題不僅影響身體健康，還可能對心理健康造成負面影響，導致焦慮和抑鬱等情緒問題。
                </ThemedText>
            </ScrollView>
        </ThemedView>
    );
}

export default BloodSugarScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
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
        position: 'relative', // Changed from absolute to relative
        top: 15, // Move to the top
        right: 0, // Move to the right
        backgroundColor: 'transparent', // Make it transparent to see the image
        paddingTop: 15,
    },
    exitButtonText: {
        fontSize: 24,
        color: 'red', // Change color as needed
    },
});