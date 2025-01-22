import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedView } from '../ThemedView';
import ThemedText from '../ThemedText';
import { useNavigation } from '@react-navigation/native';

const WeightManagementScreen = () => {
    const navigation = useNavigation(); // Initialize navigation

    return (
        <ThemedView style={styles.container}>
            <TouchableOpacity style={styles.exitButton} onPress={() => {
                navigation.goBack(); // Use navigation to go back
            }}>
                <ThemedText style={styles.exitButtonText}>X</ThemedText>
            </TouchableOpacity>
            <ScrollView>
                <ThemedText style={styles.header}>體重管理概述</ThemedText>

                <ThemedText style={styles.sectionHeader}>1. 什麼是體重管理？</ThemedText>
                <ThemedText style={styles.content}>
                    體重管理是指通過飲食、運動和生活方式的改變來維持健康的體重。這對於預防肥胖和相關健康問題至關重要。
                </ThemedText>

                <ThemedText style={styles.sectionHeader}>2. 如何有效管理體重？</ThemedText>
                <ThemedText style={styles.content}>
                    有效的體重管理包括均衡飲食、定期運動和保持健康的生活方式。設置可實現的目標並持之以恆是成功的關鍵。
                </ThemedText>

                <ThemedText style={styles.sectionHeader}>3. 體重管理的好處</ThemedText>
                <ThemedText style={styles.content}>
                    維持健康的體重可以降低患心臟病、糖尿病和其他健康問題的風險。它還有助於提高生活質量和整體健康。
                </ThemedText>

                <ThemedText style={styles.sectionHeader}>4. 體重管理不當的缺點</ThemedText>
                <ThemedText style={styles.content}>
                    體重管理不當可能導致多種健康問題，包括肥胖、心臟病、糖尿病和高血壓。這些問題不僅影響身體健康，還可能對心理健康造成負面影響，導致焦慮和抑鬱等情緒問題。
                </ThemedText>
            </ScrollView>
        </ThemedView>
    );
}

export default WeightManagementScreen;

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