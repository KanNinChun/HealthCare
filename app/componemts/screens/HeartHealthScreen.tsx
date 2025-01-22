import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { useNavigation } from '@react-navigation/native';

const HeartHealthScreen = () => {
    const navigation = useNavigation();
    return (
        <ThemedView style={styles.container}>
            <TouchableOpacity style={styles.exitButton} onPress={() => {
                navigation.goBack();
            }}>
                <ThemedText style={styles.exitButtonText}>X</ThemedText>
            </TouchableOpacity>

            <ScrollView>
                <ThemedText style={styles.header}>心臟健康概述</ThemedText>

                <ThemedText style={styles.sectionHeader}>1. 什麼是心臟健康？</ThemedText>
                <ThemedText style={styles.content}>
                    心臟健康是指心臟的整體狀況和功能。保持良好的心臟健康對於預防心血管疾病和確保全身血液循環至關重要。
                </ThemedText>

                <ThemedText style={styles.sectionHeader}>2. 心臟健康的關鍵因素</ThemedText>
                <ThemedText style={styles.content}>
                    重要因素包括定期運動、均衡飲食、壓力管理和避免吸煙。監測血壓和膽固醇水平對於維持心臟健康也至關重要。
                </ThemedText>

                <ThemedText style={styles.sectionHeader}>3. 常見的心臟疾病</ThemedText>
                <ThemedText style={styles.content}>
                    常見疾病包括冠狀動脈疾病、心臟衰竭和心律失常。這些疾病通常可以通過改變生活方式和適當的醫療護理來預防或控制。
                </ThemedText>

                <ThemedText style={styles.sectionHeader}>4. 如何維持心臟健康</ThemedText>
                <ThemedText style={styles.content}>
                    定期檢查、心臟健康飲食和持續的體育活動是維持心臟健康的關鍵。管理壓力和獲得充足的睡眠也對心臟健康有顯著貢獻。
                </ThemedText>
            </ScrollView>
        </ThemedView>
    );
}

export default HeartHealthScreen;

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