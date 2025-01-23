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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { genSaltSync, hashSync } from "bcrypt-ts";
import 'react-native-get-random-values';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import  ThemedText  from '../componemts/ThemedText';
import { ThemedView } from '../componemts/ThemedView';
import { useColorScheme } from '../hooks/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';

let db: SQLite.SQLiteDatabase | null = null;
const openDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync('healthcare.db');
    return db;
  } catch (error) {
    console.error("Error while opening the database in register page", error);
    return null;
  }
}


const RegisterScreen = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const themeContainerStyle = colorScheme === 'light' ? styles.lightContainer : styles.darkContainer; //獲取當前主題顏色
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null); // Store password validation error
  const [usernameError, setUsernameError] = useState<string | null>(null);  // Store username validation error
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const database = SQLite.useSQLiteContext();

  const validatePassword = (text: string) => {
    if (text.length < 6) {
      setPasswordError('密碼最少需要6個字元');
      return false
    } else {
      setPasswordError(null);
      return true;
    }
  }

  const validateUsername = (text: string) => {
    if (text.length < 6) {
      setUsernameError('用戶名最少需要6個字元');
      return false
    } else {
      setUsernameError(null);
      return true;
    }
  }

  const handleRegister = async () => {
    const database = await openDatabase();
    if (!database) {
      Alert.alert('錯誤', '無法開啟資料庫');
      return;
    }
    if (!username || !password) {
      Alert.alert('錯誤', '請輸入用戶名和密碼');
      return;
    }
    if (!validateUsername(username) || !validatePassword(password)) {
      return;
    }
    setLoading(true);
    try {
      const salt = await genSaltSync(4); // when login compare with it can be faster
      const passwordHash = await hashSync(password, salt); // hash password

      await database.withTransactionAsync(async () => {
        await database.runAsync(
          'INSERT INTO users (username, passwordHash) VALUES (?, ?)',
          [username, passwordHash],
        );

      });
      console.log("註冊成功: ", username, " : ", passwordHash)
      setLoading(false);
      Alert.alert('成功', '註冊成功. 現在可以登入了.');
      router.push('/login')
    } catch (error) {
      console.error('註冊失敗:', error);
      Alert.alert('錯誤', '註冊失敗.');
      setLoading(false);
    }
  };

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaView style={styles.container}>
      <ThemedView style={styles.container2}>
        <ThemedText type='title' style={{ textAlign: 'center' }}>註冊</ThemedText>
        <View style={{ flexDirection: "row", alignItems: 'center', }}>
          <TextInput
            style={[styles.input, { color: themeContainerStyle.color, }]}
            placeholder="用戶名"
            placeholderTextColor={themeContainerStyle.color}
            value={username}
            onChangeText={(text) => {
              setUsername(text)
              validateUsername(text)
            }}
            autoCapitalize="none"
          />
        </View>
        {usernameError ? <ThemedText style={styles.errorText}>{usernameError}</ThemedText> : null}
        <View style={{ flexDirection: "row", alignItems: 'center', }}>
          <TextInput
            style={[styles.input, { color: themeContainerStyle.color, }]}
            placeholder="密碼"
            placeholderTextColor={themeContainerStyle.color}
            value={password}
            onChangeText={(text) => {
              setPassword(text)
              validatePassword(text);
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
        {passwordError ? <ThemedText style={styles.errorText}>{passwordError}</ThemedText> : null}

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <TouchableOpacity style={[styles.button, { width: '60%', alignSelf: 'center' }]} onPress={handleRegister}>
            <ThemedText style={styles.buttonText}>註冊賬號</ThemedText>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => router.push('/login')}
          style={{alignSelf: 'center', marginTop: 15}}
        >
          <ThemedText type="link" style={{ textAlign: 'center' }} >已有帳號? 登入</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      </SafeAreaView>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container2: {
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
  errorText: {
    color: 'red',
    marginBottom: 10
  },
  passwordContainer: {
    width: '100%',
    marginBottom: 10,
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

export default RegisterScreen;