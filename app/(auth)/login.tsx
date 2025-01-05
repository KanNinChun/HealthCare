// app/(auth)/login.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { compare, hash } from 'bcrypt-ts';

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
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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

          if(passwordMatch){
            await AsyncStorage.setItem('userToken', result.id.toString());
            console.log("Login Success", result.id.toString())
            router.replace('../(tabs)'); // Redirect to the main layout
          } else{
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
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                )}
            <TouchableOpacity
                onPress={() => router.push('/register')}
            >
                <Text style={styles.linkText}>Don't have an account? Register</Text>
            </TouchableOpacity>
        </View>
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
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
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
    color: '#007bff',
    marginTop: 15,
    fontSize: 16,
  },
});

export default LoginScreen;