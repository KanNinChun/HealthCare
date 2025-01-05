import React from 'react'
import { SQLiteDatabase, SQLiteProvider } from 'expo-sqlite'
import { Stack} from 'expo-router'
import { StatusBar } from 'expo-status-bar';

export default function _layout() {

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
      <StatusBar style="auto" />
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/register" options={{ headerShown: false }}/>
        </Stack>
    </SQLiteProvider>
  )
}