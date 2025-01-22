import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedView } from '../ThemedView';
import ThemedText from '../ThemedText';
import { useNavigation } from '@react-navigation/native';

const HealthyEatingScreen = () => {
    const navigation = useNavigation();
    return (
        <ThemedView style={styles.container}>
            <TouchableOpacity style={styles.exitButton} onPress={() => {
                navigation.goBack();
            }}>
                <ThemedText style={styles.exitButtonText}>X</ThemedText>
            </TouchableOpacity>

            <ScrollView>
                <ThemedText style={styles.header}>健康飲食指南</ThemedText>

                <ThemedText style={styles.sectionHeader}>1. 什麼是健康飲食？</ThemedText>
                <ThemedText style={styles.content}>
                    健康飲食是指選擇營養均衡的食物，提供身體所需的各種營養素，同時限制不健康成分的攝入，如過多的糖、鹽和飽和脂肪。
                </ThemedText>

                <ThemedText style={styles.sectionHeader}>2. 健康飲食的原則</ThemedText>
                <ThemedText style={styles.content}>
                    包括多吃蔬菜水果、選擇全穀類、適量攝取蛋白質、選擇健康脂肪來源，以及限制加工食品和含糖飲料的攝入。
                </ThemedText>

                <ThemedText style={styles.sectionHeader}>3. 健康飲食的好處</ThemedText>
                <ThemedText style={styles.content}>
                    健康飲食可以幫助維持健康體重，降低慢性疾病風險，改善消化系統健康，並提升整體能量水平和心理健康。
                </ThemedText>

                <ThemedText style={styles.sectionHeader}>4. 實踐健康飲食</ThemedText>
                <ThemedText style={styles.content}>
                    可以從簡單的改變開始，如增加蔬菜攝入量、選擇全穀類代替精製穀物、減少外食次數，以及學習閱讀食品標籤來做出更健康的選擇。
                </ThemedText>
            </ScrollView>
        </ThemedView>
    );
}

export default HealthyEatingScreen;

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