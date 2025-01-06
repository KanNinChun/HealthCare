import { Text, StyleSheet, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useColorScheme } from './hooks/useColorScheme';
import { ThemedText } from './componemts/ThemedText';
import { ThemedView } from './componemts/ThemedView';
import { useRouter, Link, Redirect, Stack } from 'expo-router';
import "../global.css"
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from 'react'
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Database Initialization
let db: SQLite.SQLiteDatabase | null = null;

export default function LandingPage() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const setup = async () => {
      const checkLoginStatus = async () => {
        try {
          const token = await AsyncStorage.getItem('userToken');
          setIsLoggedIn(!!token);
        } catch (error) {
          console.error("Error while checking login status", error)
          setIsLoggedIn(false);
        } finally {
          setLoading(false)
        }
      }
      await checkLoginStatus()

    }
    setup()
  }, []);


    if (!isLoggedIn) {
    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar style="auto" />
        <ThemedView className="flex-1 justify-center items-center">
          <ThemedText>Welcome To Health Care</ThemedText>
          <ThemedText>Make your life better</ThemedText>
          <Link className="text-xl font-bold text-red-600" href="../(tabs)">Go To Home Page!</Link>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/login')}
          >
            <ThemedText style={styles.buttonText}>Login</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/register')}
          >
            <ThemedText style={styles.buttonText}>Register</ThemedText>
          </TouchableOpacity>

        </ThemedView>
      </ThemeProvider>
    );
  }

  if (isLoggedIn) {
    // Navigate to the home page if the user is logged in
    return <Redirect href="../(tabs)" />;
  }
    
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});