import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { useNavigation } from '@react-navigation/native';

const StressReductionScreen = () => {
    const navigation = useNavigation();
    return (
        <ThemedView style={styles.container}>
            <TouchableOpacity style={styles.exitButton} onPress={() => {
                navigation.goBack();
            }}>
                <ThemedText style={styles.exitButtonText}>X</ThemedText>
            </TouchableOpacity>

            <ScrollView>
                <ThemedText style={styles.header}>壓力管理技巧</ThemedText>

                <ThemedText style={styles.sectionHeader}>1. 了解壓力</ThemedText>
                <ThemedText style={styles.content}>
                    壓力是身體對挑戰或需求的自然反應。雖然有些壓力可能是有益的，但長期壓力會對身心健康產生負面影響。
                </ThemedText>

                <ThemedText style={styles.sectionHeader}>2. 身體減壓方法</ThemedText>
                <ThemedText style={styles.content}>
                    定期運動、深呼吸練習和漸進式肌肉放鬆是有效的身體減壓方法。瑜伽和太極結合了身體運動和正念，具有額外的好處。
                </ThemedText>

                <ThemedText style={styles.sectionHeader}>3. 心理壓力管理</ThemedText>
                <ThemedText style={styles.content}>
                    冥想、正念和認知行為療法等方法可以幫助管理壓力。寫日記和時間管理策略也有助於減輕心理壓力。
                </ThemedText>

                <ThemedText style={styles.sectionHeader}>4. 生活方式的改變</ThemedText>
                <ThemedText style={styles.content}>
                    保持均衡飲食、獲得充足睡眠和建立健康的界限可以顯著降低壓力水平。社交聯繫和愛好也在壓力管理中發揮重要作用。
                </ThemedText>
            </ScrollView>
        </ThemedView>
    );
}

export default StressReductionScreen;

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