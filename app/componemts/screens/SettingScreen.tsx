import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useColorScheme } from '../../hooks/useColorScheme';
import ThemedText from '../../componemts/ThemedText';
import { ThemedView } from '../../componemts/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeContainerStyle = colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;


  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken'); // 移除憑證
      console.log('User logged out');
      router.replace('../(auth)/login');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out');
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.container2}>
        <ThemedText type='subtitle'>設定</ThemedText>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <ThemedText style={styles.buttonText}>登出</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container2: {
    flex: 1,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'center'
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  lightContainer: {
    color: '#191919',
    backgroundColor: '#FFFFFF',
  },
  darkContainer: {
    color: '#d1d1d1',
    backgroundColor: '#000105',
  },
});