import { View, StyleSheet, TouchableOpacity, ActivityIndicator, ImageBackground } from "react-native";
import { useColorScheme } from './hooks/useColorScheme';
import ThemedText from './componemts/ThemedText';
import { ThemedView } from './componemts/ThemedView';
import { useRouter, Link, Redirect, Stack } from 'expo-router';
import "../global.css"
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from 'react'
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

// 初次化資料庫
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

  // 登入後導向首頁
  useEffect(() => {
    if (isLoggedIn) {
      router.replace('./(tabs)');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return (
        <SafeAreaView style={styles.container}>
          <ImageBackground
            source={require('../assets/images/bg2.png')}
            style={{ flex: 1 }}
            resizeMode="cover">

            <View style={styles.container2}>
              <ThemedText lightColor="#FFFFFF" type="title">Welcome To Health Care</ThemedText>
              <ThemedText lightColor="#FFFFFF" type="description">Make your life better</ThemedText>

              <View style={styles.buttoncontainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => router.push('/login')}
                >
                  <ThemedText style={styles.buttonText}>登入</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button2}
                  onPress={() => router.push('/register')}
                >
                  <ThemedText style={styles.buttonText}>註冊</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: '600',
    letterSpacing: 1.5,
    lineHeight: 36,
  },
  buttoncontainer: {
    flexDirection: 'column',
    top: -190,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 130,
    borderRadius: 5,
    marginBottom: 20,
  },
  button2: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,

  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});