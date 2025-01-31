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
import { genSaltSync, hashSync } from "bcrypt-ts"; // 引入密碼加密工具
import 'react-native-get-random-values'; // 引入隨機值生成工具
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'; 
import ThemedText from '../componemts/ThemedText';
import { ThemedView } from '../componemts/ThemedView';
import { useColorScheme } from '../hooks/useColorScheme';

let db: SQLite.SQLiteDatabase | null = null;

// 打開資料庫的函數
const openDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync('healthcare.db'); // 打開 healthcare.db 的資料庫
    return db;
  } catch (error) {
    console.error("在註冊頁面打開資料庫時發生錯誤", error);
    return null;
  }
}

const RegisterScreen = () => {
  const colorScheme = useColorScheme(); // 獲取當前主題顏色
  const router = useRouter(); // 獲取路由對象
  const themeContainerStyle = colorScheme === 'light' ? styles.lightContainer : styles.darkContainer; // 根據主題設置容器樣式
  const [username, setUsername] = useState(''); // 用戶名狀態
  const [password, setPassword] = useState(''); // 密碼狀態
  const [loading, setLoading] = useState(false); // 加載狀態
  const [passwordError, setPasswordError] = useState<string | null>(null); // 密碼錯誤訊息
  const [usernameError, setUsernameError] = useState<string | null>(null); // 用戶名錯誤訊息
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // 密碼是否可見

  const database = SQLite.useSQLiteContext(); // 獲取 SQLite 上下文

  // 驗證密碼的函數
  const validatePassword = (text: string) => {
    if (text.length < 6) {
      setPasswordError('密碼長度必須至少為 6 個字符');
      return false;
    } else {
      setPasswordError(null);
      return true;
    }
  }

  // 驗證用戶名的函數
  const validateUsername = (text: string) => {
    if (text.length < 6) {
      setUsernameError('用戶名長度必須至少為 6 個字符');
      return false;
    } else {
      setUsernameError(null);
      return true;
    }
  }

  // 處理註冊的函數
  const handleRegister = async () => {
    const database = await openDatabase(); // 打開資料庫
    if (!database) {
      Alert.alert('錯誤', '無法打開資料庫');
      return;
    }
    if (!username || !password) {
      Alert.alert('錯誤', '請輸入用戶名和密碼。');
      return;
    }
    if (!validateUsername(username) || !validatePassword(password)) {
      return; // 如果用戶名或密碼驗證失敗，則返回
    }
    setLoading(true); // 開始加載
    try {
      const salt = await genSaltSync(4); // 生成鹽值
      const passwordHash = await hashSync(password, salt); // 生成密碼Hash值

      await database.withTransactionAsync(async () => {
        await database.runAsync(
          'INSERT INTO users (username, passwordHash) VALUES (?, ?)', // 插入用戶數據到資料庫
          [username, passwordHash],
        );
      });
      console.log("註冊成功: ", username, " : ", passwordHash);
      setLoading(false); // 結束加載
      Alert.alert('成功', '註冊成功。您現在可以登錄。');
      router.push('/login'); // 跳轉到登錄頁面
    } catch (error) {
      console.error('註冊錯誤:', error);
      Alert.alert('錯誤', '註冊失敗。');
      setLoading(false); // 結束加載
    }
  };

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ThemedView style={styles.container}>
        <ThemedText type='title' style={{ textAlign: 'center' }}>註冊</ThemedText>
        {/* 用戶名輸入框 */}
        <View style={{ flexDirection: "row", alignItems: 'center', }}>
          <TextInput
            style={[styles.input, { color: themeContainerStyle.color, }]}
            placeholder="用戶名"
            placeholderTextColor={themeContainerStyle.color}
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              validateUsername(text); // 驗證用戶名
            }}
            autoCapitalize="none"
          />
        </View>
        {usernameError ? <ThemedText style={styles.errorText}>{usernameError}</ThemedText> : null}
        {/* 密碼輸入框 */}
        <View style={{ flexDirection: "row", alignItems: 'center', }}>
          <TextInput
            style={[styles.input, { color: themeContainerStyle.color, }]}
            placeholder="密碼"
            placeholderTextColor={themeContainerStyle.color}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              validatePassword(text); // 驗證密碼
            }}
            secureTextEntry={!isPasswordVisible} // 控制密碼是否可見
          />
          {/* 密碼可見性切換按鈕 */}
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
        {passwordError ? <ThemedText style={styles.errorText}>{passwordError}</ThemedText> : null}

        {/* 註冊按鈕 */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            testID="loading-indicator"
          />
        ) : (
          <TouchableOpacity
            style={[styles.button, { width: '60%', alignSelf: 'center' }]}
            onPress={handleRegister}
            testID="register-button"
          >
            <ThemedText style={styles.buttonText}>註冊</ThemedText>
          </TouchableOpacity>
        )}
        {/* 跳轉到登錄頁面的鏈接 */}
        <TouchableOpacity
          onPress={() => router.push('/login')}
          style={{ alignSelf: 'center', marginTop: 15 }}
        >
          <ThemedText type="link" style={{ textAlign: 'center' }}>已經有帳號？登錄</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemeProvider>
  );
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