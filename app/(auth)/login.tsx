// app/(auth)/login.tsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { compare, hash } from 'bcrypt-ts';
import { Ionicons } from '@expo/vector-icons'; // Import icon library
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { ThemedText } from '../componemts/ThemedText';
import { ThemedView } from '../componemts/ThemedView';
import { useColorScheme } from '../hooks/useColorScheme';

// Define a type for the user object returned from the database
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
    console.error("Error while opening the database in login page", error);
    return null;
  }
}

const LoginScreen = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const themeContainerStyle = colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    const database = await openDatabase();
    if (!database) {
      Alert.alert('Error', 'Failed to open database');
      return;
    }
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await database.getFirstAsync<User>(
        'SELECT * FROM users WHERE username = ?',
        [username],
      );
      if (!result) {
        Alert.alert('Login Failed', 'User not found.');
        setLoading(false)
        return;
      }

      const passwordMatch = await compare(password, result.passwordHash);

      if (passwordMatch) {
        await AsyncStorage.setItem('userToken', result.id.toString());
        console.log("Login Success", result.id.toString())
        router.replace('../(tabs)'); // Redirect to the main layout
      } else {
        Alert.alert('Login Failed', 'Incorrect password.');
      }
      setLoading(false);

    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Login failed.');
      setLoading(false);
    }
  };
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ThemedView style={styles.container}>
        <ThemedText type='title' style={{ textAlign: 'center' }}>Login</ThemedText>
        <View style={{ flexDirection: "row", alignItems: 'center', }}>
          <TextInput
            style={[styles.input, { color: themeContainerStyle.color, }]}
            placeholder="Username"
            placeholderTextColor={themeContainerStyle.color}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <View style={{ flexDirection: "row", alignItems: 'center'}}>
          <TextInput
            style={[styles.input, { color: themeContainerStyle.color }]}
            placeholder="Password"
            placeholderTextColor={themeContainerStyle.color}
            value={password}
            onChangeText={(text) => {
              setPassword(text)
            }}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color={themeContainerStyle.color}
            />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <TouchableOpacity style={[styles.button, { width: '60%', alignSelf: 'center' }]} onPress={handleLogin}>
            <ThemedText style={styles.buttonText}>Login</ThemedText>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => router.push('/register')}
          style={{ alignSelf: 'center', marginTop: 15 }}
        >
          <ThemedText type="link" style={{ textAlign: 'center' }}>Don't have an account? Register</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemeProvider>
  );
};

LoginScreen.options = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 10,
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
  linkText: {
    marginTop: 15,
    textAlign: 'center',
  },
  iconButton: {
    padding: 10,
    position: 'absolute',
    right: 0,
    marginVertical: 10,
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

export default LoginScreen;