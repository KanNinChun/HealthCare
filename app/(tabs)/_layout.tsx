// app/(tabs)/_layout.tsx
import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import TopTabBar from '../naviagtions/TopTabBar'
import useBackHandler from '../componemts/useBackHandle'
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

// Database Initialization
let db: SQLite.SQLiteDatabase | null = null;

export default function _layout() {
  //useBackHandler();
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
    },[]);


    if(loading){
        return(
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                  <ActivityIndicator size="large" color="#0000ff"/>
            </View>
        )
    }

     if (!isLoggedIn) {
         return router.replace('../login');
    }
    return (
         <TopTabBar/>
    )
}