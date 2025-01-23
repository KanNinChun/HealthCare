import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ImageBackground } from 'react-native';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemedView } from '../ThemedView';
import ThemedText from '../ThemedText';
import { router } from 'expo-router';
import { useColorScheme } from '@/app/hooks/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';

const HealthInfoScreen = () => {
    const colorScheme = useColorScheme(); // Get the current color scheme
    const articleButtonthemeContainerStyle = colorScheme === 'light' ? styles.articleButtonlight : styles.articleButtondark; // Get current theme color
    const TipsButtonthemeContainerStyle = colorScheme === 'light' ? styles.TipsButtonlight : styles.TipsButtondark; // Get current theme color
    return (
        <SafeAreaView style={styles.container}>
            <ThemedView style={styles.container2}>
                <StatusBar style="auto" />
                <ThemedView style={styles.containerpadding}>
                    {/* 文章 Section */}
                    <View style={styles.articlesContainer}>
                        <ThemedText style={styles.sectionHeader}>文章</ThemedText>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <TouchableOpacity style={articleButtonthemeContainerStyle} onPress={() => router.push('/componemts/screens/BloodPressureScreen')}>
                                <ThemedText>血壓</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity style={articleButtonthemeContainerStyle} onPress={() => router.push('/componemts/screens/BloodSugarScreen')}>
                                <ThemedText>血糖</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity style={articleButtonthemeContainerStyle} onPress={() => router.push('/componemts/screens/WeightManagementScreen')}>
                                <ThemedText>體重管理</ThemedText>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>

                    {/* 健康貼士 Section */}
                    <View style={styles.tipsContainer}>
                        <ThemedText style={styles.sectionHeader}>健康貼士</ThemedText>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <TouchableOpacity style={TipsButtonthemeContainerStyle} onPress={() => router.push('/componemts/screens/HeartHealthScreen')}>
                                <ThemedText>心臟健康</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity style={TipsButtonthemeContainerStyle} onPress={() => router.push('/componemts/screens/StressReductionScreen')}>
                                <ThemedText>減輕壓力</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity style={TipsButtonthemeContainerStyle} onPress={() => router.push('/componemts/screens/HealthyEatingScreen')}>
                                <ThemedText>健康飲食</ThemedText>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                    {/* AI問題解答 */}
                    <ThemedText style={styles.Text}>有其他問題搵唔到答案?即刻試下用AI黎幫你解答!</ThemedText>
                    <TouchableOpacity style={styles.button} onPress={() => router.push('/componemts/screens/ChatRoomScreen')}>
                        <ThemedText style={styles.buttonText}>AI醫生</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </ThemedView>
        </SafeAreaView>
    );
}

export default HealthInfoScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    container2: {
        flex: 1,
    },
    containerpadding: {
        paddingLeft: 5,
        paddingRight: 5,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignSelf: 'center',
        width: '98%',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },
    Text: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    articlesContainer: {
        marginVertical: 20,
    },
    tipsContainer: {
        marginVertical: 20,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    articleButtonlight: {
        padding: 25,
        marginRight: 10,
        backgroundColor: '#ddb3ff', // Light green for light mode
        borderRadius: 5,
    },
    articleButtondark: {
        padding: 35,
        marginRight: 10,
        backgroundColor: '#3a3a3a', // Dark color for dark mode
        borderRadius: 5,
    },
    TipsButtonlight: {
        padding: 25,
        marginRight: 10,
        backgroundColor: '#abffd9', // Light green for light mode
        borderRadius: 5,
    },
    TipsButtondark: {
        padding: 25,
        marginRight: 10,
        backgroundColor: '#484394', // Dark color for dark mode
        borderRadius: 5,
    },
    buttonBackground: {
        justifyContent: 'center',
        borderRadius: 5,

    },
});
