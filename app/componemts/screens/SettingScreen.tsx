import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useColorScheme } from '../../hooks/useColorScheme';
import { ThemedText } from '../../componemts/ThemedText';
import { ThemedView } from '../../componemts/ThemedView';


export default function SettingScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeContainerStyle = colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;


  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      console.log('User logged out');
      router.replace('../(auth)/login');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out');
    }
  };
  return (
    <ScrollView style={{ backgroundColor: themeContainerStyle.backgroundColor }}>
      <ThemedView style={styles.container}>
        <ThemedText type='subtitle'>Settings</ThemedText>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/componemts/screens/ChatRoomScreen')}>
          <ThemedText style={styles.buttonText}>Go to Chat Room</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <ThemedText style={styles.buttonText}>Logout</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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