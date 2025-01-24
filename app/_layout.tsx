import React from 'react'
import { SQLiteDatabase, SQLiteProvider } from 'expo-sqlite'
import { Stack} from 'expo-router'
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from './hooks/useColorScheme'; 
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

export default function _layout() {
  const colorScheme = useColorScheme();
    const createDbIfNeeded = async (db: SQLiteDatabase) => {
        console.log("Creating database if needed");
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            passwordHash TEXT NOT NULL
          );
        `);
      }

  return (
    <SQLiteProvider databaseName="healthcare.db" onInit={createDbIfNeeded}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style="auto" />
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/register" options={{ headerShown: false }}/>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
            <Stack.Screen name="componemts/screens/NewsScreen" options={{ headerShown: false }}/>
            <Stack.Screen name="componemts/screens/HomeScreen" options={{ headerShown: false }}/>
            <Stack.Screen name="componemts/screens/ChatRoomScreen" options={{ headerShown: false }}/>
            <Stack.Screen name="componemts/screens/HealthInfoScreen" options={{ headerShown: false }}/>
            <Stack.Screen name="componemts/screens/SettingScreen" options={{ headerShown: false }}/>
            <Stack.Screen name="componemts/screens/BloodPressureScreen" options={{ headerShown: false }}/>
            <Stack.Screen name="componemts/screens/BloodSugarScreen" options={{ headerShown: false }}/>
            <Stack.Screen name="componemts/screens/WeightManagementScreen" options={{ headerShown: false }}/>
            <Stack.Screen name="componemts/screens/HeartHealthScreen" options={{ headerShown: false }}/>
            <Stack.Screen name="componemts/screens/HealthyEatingScreen" options={{ headerShown: false }}/>
            <Stack.Screen name="componemts/screens/StressReductionScreen" options={{ headerShown: false }}/>
            <Stack.Screen name="componemts/screens/StepTrackerScreen" options={{ headerShown: false }}/>
            <Stack.Screen name="componemts/screens/BloodSugarRecord" options={{ headerShown: false }}/>
            <Stack.Screen name="componemts/screens/AddRecord" options={{ headerShown: false }}/>
            <Stack.Screen name="componemts/screens/Map" options={{ headerShown: false }}/>
            <Stack.Screen name="componemts/screens/EditRecord" options={{ headerShown: false }}/>
        </Stack>
        </ThemeProvider>
    </SQLiteProvider>
  )
}