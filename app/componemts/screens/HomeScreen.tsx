import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Alert, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '../../hooks/useColorScheme';
import ThemedText from '../../componemts/ThemedText';
import { ThemedView } from '../../componemts/ThemedView';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { NewsDataType } from '../../constants/news'
import NewsScreen from './NewsScreen';

interface User {
  id: number;
  username: string;
  passwordHash: string;
}

let db: SQLite.SQLiteDatabase | null = null;
const openDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync('healthcare.db');
    return db;
  } catch (error) {
    console.error("Error while opening the database in HomeScreen page", error);
    Alert.alert('Error', 'Failed to open database');
    return null;
  }
}
export default function HomeScreen() {
  const { top: safeTop } = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const themeContainerStyle = colorScheme === 'light' ? styles.lightContainer : styles.darkContainer; //獲取當前主題顏色
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [News, setNews] = useState<NewsDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsername = async () => {
      const database = await openDatabase();
      if (!database) {
        return;
      }
      try {
        const userId = await AsyncStorage.getItem('userToken');
        if (userId) {
          const result = await database.getFirstAsync<User>(
            'SELECT username FROM users WHERE id = ?',
            [userId]
          );
          if (result) {
            setUsername(result.username);
          }
        }
      } catch (error) {
        console.error('Error fetching username:', error);
        Alert.alert('Error', 'Failed to fetch username');
      } finally {
        setLoading(false);
      }
    };
    fetchUsername();
  }, []);


  useEffect(() => {
    getNews();
  }, []);

  const getNews = async () => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      if (!apiUrl) {
        console.error('News API URL is not defined');
        return;
      }
      const respond = await axios.get(apiUrl);
      if (respond && respond.data) {

        setNews(respond.data.results);
        setIsLoading(false);
      }
    }
    catch (error: any) {
      console.error('Error fetching news:', error.message);
    }
  }
  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </ThemedView>
    );
  }
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={{ paddingTop: safeTop, paddingLeft: 4 }}>
        <ThemedText type='subtitle'>歡迎回來,</ThemedText>
        <ThemedText type='username'>{username}</ThemedText>
        {isLoading ? (
          <ActivityIndicator size={'large'} />) : (
          <NewsScreen newsList={News} />
        )}

        <TouchableOpacity style={styles.button} onPress={() => router.push('/componemts/screens/StepTrackerScreen')}>
          <ThemedText style={styles.buttonText}>步數追蹤</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/componemts/screens/BloodSugarRecord')}>
          <ThemedText style={styles.buttonText}>血糖記錄</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightContainer: {
    color: '#191919',
    backgroundColor: '#FFFFFF',
  },
  darkContainer: {
    color: '#d1d1d1',
    backgroundColor: '#000105',
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