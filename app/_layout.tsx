
import React from 'react'
import { SQLiteDatabase, SQLiteProvider } from 'expo-sqlite'
import { Stack} from 'expo-router'

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
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/register" options={{ headerShown: false }}/>
        </Stack>
    </SQLiteProvider>
  )
}