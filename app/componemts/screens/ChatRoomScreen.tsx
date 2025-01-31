import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TypingIndicator from '../TypingIndicator';
import OpenAI from 'openai';
import { ThemedView } from '../ThemedView';
import ThemedText from '../ThemedText';
import { useColorScheme } from '../../hooks/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';

// 定義訊息的介面，包含角色（用戶或助手）和內容
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// 初始化 OpenAI 實例
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY,
});

export default function ChatRoomScreen() {
  const [isTyping, setIsTyping] = useState(false); // 是否正在輸入
  const [messages, setMessages] = useState<Message[]>([]); // 聊天訊息列表
  const [input, setInput] = useState(''); // 輸入框內容
  const flatListRef = useRef<FlatList>(null); // 用於 FlatList 的引用

  const colorScheme = useColorScheme();
  const userthemeContainerStyle = colorScheme === 'light' ? styles.userlightContainer : styles.userdarkContainer;
  const airthemeContainerStyle = colorScheme === 'light' ? styles.ailightContainer : styles.aidarkContainer;
  const inputfiledthemeContainerStyle = colorScheme === 'light' ? styles.inputfiledlightContainer : styles.inputfileddarkContainer;

  // 呼叫 OpenAI API 的函數
  const callOpenAI = async (messages: Message[]) => {
    try {
      const formattedMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const completion = await openai.chat.completions.create({
        model: 'deepseek-chat',
        messages: formattedMessages,
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('呼叫 DeepSeek API 時發生錯誤:', error);
      return '無法從 DeepSeek 取得回應。';
    }
  };

  // 發送訊息的函數
  const sendMessage = async () => {
    if (input.trim()) {
      const userId = await AsyncStorage.getItem('userToken'); // 從 AsyncStorage 取得用戶 ID
      if (!userId) return;

      const userMessage: Message = { role: 'user', content: input }; // 建立用戶訊息
      const updatedMessages = [...messages, userMessage]; // 更新訊息列表

      setMessages(updatedMessages); // 更新狀態
      await AsyncStorage.setItem(`chatMessages_${userId}`, JSON.stringify(updatedMessages)); // 將訊息保存到 AsyncStorage

      setInput(''); // 清空輸入框
      setIsTyping(true); // 顯示正在輸入的指示器

      try {
        const gptResponse = await callOpenAI(updatedMessages); // 呼叫 OpenAI API
        const assistantMessage: Message = { role: 'assistant', content: gptResponse || '無法從 DeepSeek 取得回應。' }; // 建立助手訊息

        setMessages(prev => {
          const newMessages = [...prev, assistantMessage]; // 更新訊息列表
          AsyncStorage.setItem(`chatMessages_${userId}`, JSON.stringify(newMessages)).catch(error => {
            console.error('保存訊息時發生錯誤:', error);
          });
          return newMessages;
        });
      } catch (error) {
        console.error('處理訊息時發生錯誤:', error);
      } finally {
        setIsTyping(false); // 隱藏正在輸入的指示器
      }
    }
  };

  // 加載訊息
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const userId = await AsyncStorage.getItem('userToken'); // 從 AsyncStorage 取得用戶 ID
        if (!userId) return;
        
        const storedMessages = await AsyncStorage.getItem(`chatMessages_${userId}`); // 從 AsyncStorage 取得保存的訊息
        if (storedMessages) {
          const parsedMessages = JSON.parse(storedMessages); // 解析訊息
          if (Array.isArray(parsedMessages)) {
            setMessages(parsedMessages); // 更新狀態
          }
        }
      } catch (error) {
        console.error('加載訊息時發生錯誤:', error);
      }
    };

    loadMessages();
  }, []);

  // 當訊息更新時，滾動到 FlatList 的底部
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // 清空聊天記錄
  const clearChat = async () => {
    try {
      const userId = await AsyncStorage.getItem('userToken'); // 從 AsyncStorage 取得用戶 ID
      if (!userId) return;

      setMessages([]); // 清空訊息列表
      await AsyncStorage.removeItem(`chatMessages_${userId}`); // 從 AsyncStorage 移除保存的訊息
      Alert.alert('聊天記錄已清除', '您的聊天記錄已成功清除。');
    } catch (error) {
      console.error('清除聊天記錄時發生錯誤:', error);
      Alert.alert('錯誤', '無法清除聊天記錄。');
    }
  };

  const placeholderColor = useThemeColor({ light: '#888', dark: '#ccc' }, 'background');

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.headerContainer}>
        <ThemedText style={styles.header}>AI 醫生</ThemedText>
      </ThemedView>
      
      {/* 顯示聊天訊息的 FlatList */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }: { item: Message }) => (
          <ThemedText style={item.role === 'user' ? userthemeContainerStyle : airthemeContainerStyle}>
            {item.content}
          </ThemedText>
        )}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
      />
      
      {/* 顯示正在輸入的指示器 */}
      {isTyping && <TypingIndicator />}
      
      {/* 輸入框和按鈕的容器 */}
      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={[styles.inputField, inputfiledthemeContainerStyle]}
          value={input}
          onChangeText={setInput}
          placeholder="請在這裡輸入訊息..."
          placeholderTextColor={placeholderColor}
          multiline
        />
        <ThemedView style={styles.buttonContainer}>
          <Button title="發送" onPress={sendMessage} />
          <Button title="清理聊天記錄" onPress={clearChat} />
        </ThemedView>
      </ThemedView>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingTop: 10,
    textAlign: 'center',
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingBottom: 20,
  },
  inputContainer: {
    padding: 10,
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  inputField: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    minHeight: 40,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    paddingVertical: 10,
    height: 60,
  },
  userlightContainer: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#d4edda',
    marginBottom: 10,
    alignSelf: 'flex-end',
  },
  userdarkContainer: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#c76e00',
    marginBottom: 10,
    alignSelf: 'flex-end',
  },
  ailightContainer: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f1f1f1',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  aidarkContainer: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#444444',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  inputfiledlightContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  inputfileddarkContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: '#fff',
  },
});