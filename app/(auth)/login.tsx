// app/(auth)/login.tsx
import React, { useState, useEffect } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import ThemedText from '../componemts/ThemedText';
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
  const [isFingerprintAvailable, setIsFingerprintAvailable] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const checkFingerprintAvailability = async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsFingerprintAvailable(compatible && enrolled);
    };
    checkFingerprintAvailability();
  }, []);

  const handleFingerprintLogin = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to login',
        disableDeviceFallback: true,
      });

      if (result.success) {
        const storedUsername = await AsyncStorage.getItem('fingerprintUsername');
        if (storedUsername) {
          setUsername(storedUsername);
          const database = await openDatabase();
          if (!database) {
            Alert.alert('Error', 'Failed to open database');
            return;
          }

          const user = await database.getFirstAsync<User>(
            'SELECT * FROM users WHERE username = ?',
            [storedUsername],
          );

          if (user) {
            await AsyncStorage.setItem('userToken', user.id.toString());
            router.replace('../(tabs)');
          } else {
            Alert.alert('Error', 'User not found');
          }
        } else {
          Alert.alert('Error', 'No username stored for fingerprint login');
        }
      } else {
        Alert.alert('Authentication Failed', 'Fingerprint authentication failed');
      }
    } catch (error) {
      console.error('Fingerprint login error:', error);
      Alert.alert('Error', 'Fingerprint authentication failed');
    }
  };

  const handleLogin = async () => {
    const database = await openDatabase();
    if (!database) {
      Alert.alert('Error', 'Failed to open database');
      return;
    }
    if (!username || !password) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await database.getFirstAsync<User>(
        'SELECT * FROM users WHERE username = ?',
        [username],
      );
      if (!result) {
        setErrorMessage('User not found.');
        setLoading(false);
        return;
      }

      const passwordMatch = await compare(password, result.passwordHash);

      if (passwordMatch) {
        await AsyncStorage.setItem('userToken', result.id.toString());
        await AsyncStorage.setItem('fingerprintUsername', username);
        console.log("Login Success", result.id.toString())
        router.replace('../(tabs)'); // Redirect to the main layout
      } else {
        setErrorMessage('Incorrect password.');
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
            testID="username-input"
          />
        </View>

        <View style={{ flexDirection: "row", alignItems: 'center' }}>
          <TextInput
            style={[styles.input, { color: themeContainerStyle.color }]}
            placeholder="Password"
            placeholderTextColor={themeContainerStyle.color}
            value={password}
            onChangeText={(text) => {
              setPassword(text)
            }}
            secureTextEntry={!isPasswordVisible}
            testID="password-input"
          />
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            testID="password-toggle"
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
          <>
            {errorMessage && (
              <ThemedText style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>
                {errorMessage}
              </ThemedText>
            )}
            <TouchableOpacity
              style={[styles.button, { width: '60%', alignSelf: 'center' }]}
              onPress={handleLogin}
              testID="login-button"
            >
              <ThemedText style={styles.buttonText}>Login</ThemedText>
            </TouchableOpacity>
            {isFingerprintAvailable && (
              <>
                <TouchableOpacity
                  style={[styles.button, {
                    width: '60%',
                    alignSelf: 'center',
                    marginTop: 10,
                    backgroundColor: '#34C759',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }]}
                  onPress={handleFingerprintLogin}
                  testID="fingerprint-button"
                >
                  <Ionicons name="finger-print" size={24} color="white" style={{ marginRight: 8 }} />
                  <ThemedText style={styles.buttonText}>Login with Fingerprint</ThemedText>
                </TouchableOpacity>
              </>
            )}
          </>
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