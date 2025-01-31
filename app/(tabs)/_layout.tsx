import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import { Stack } from "expo-router";
import TabsLayOut from '../naviagtions/BottomTabBar';
import  TabBar  from '../naviagtions/BottomTabBar';
import TopTabBar from '../naviagtions/TopTabBar';

// Database Initialization
let db: SQLite.SQLiteDatabase | null = null;

export default function _layout() {
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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  if (!isLoggedIn) {
   router.replace('../login');
    return null;
  }

  return (
    <TopTabBar/>
  )
}