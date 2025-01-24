import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TypingIndicator from '../TypingIndicator';
import OpenAI from 'openai';
import { ThemedView } from '../ThemedView';
import ThemedText from '../ThemedText';
import { useColorScheme } from '../../hooks/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY,
});

// https://api-docs.deepseek.com/zh-cn/ API文檔
export default function ChatRoomScreen() {
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const colorScheme = useColorScheme();
  const userthemeContainerStyle = colorScheme === 'light' ? styles.userlightContainer : styles.userdarkContainer;
  const airthemeContainerStyle = colorScheme === 'light' ? styles.ailightContainer : styles.aidarkContainer;
  const inputfiledthemeContainerStyle = colorScheme === 'light' ? styles.inputfiledlightContainer : styles.inputfileddarkContainer;

  const callOpenAI = async (messages: Message[]) => {
    try {
      // Ensure messages have proper role/content structure
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
      console.error('Error calling DeepSeek API:', error);
      return 'Error retrieving response from DeepSeek.';
    }
  };

  const sendMessage = async () => {
    if (input.trim()) {
      const userId = await AsyncStorage.getItem('userToken');
      if (!userId) return;

      const userMessage: Message = { role: 'user', content: input };
      const updatedMessages = [...messages, userMessage];

      // Update state and storage atomically
      setMessages(updatedMessages);
      await AsyncStorage.setItem(`chatMessages_${userId}`, JSON.stringify(updatedMessages));

      setInput('');
      setIsTyping(true);

      try {
        const gptResponse = await callOpenAI(updatedMessages);
        const assistantMessage: Message = { role: 'assistant', content: gptResponse || 'No response from DeepSeek.' };

        // Update state and storage atomically
        setMessages(prev => {
          const newMessages = [...prev, assistantMessage];
          AsyncStorage.setItem(`chatMessages_${userId}`, JSON.stringify(newMessages));
          return newMessages;
        });
      } catch (error) {
        console.error('Error processing message:', error);
      } finally {
        setIsTyping(false);
      }
    }
  };

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const storedMessages = await AsyncStorage.getItem('chatMessages');
        if (storedMessages) {
          const parsedMessages = JSON.parse(storedMessages);
          if (Array.isArray(parsedMessages)) {
            setMessages(parsedMessages);
          }
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    loadMessages();
  }, []);

  const clearChat = async () => {
    setMessages([]);
    await AsyncStorage.removeItem('chatMessages');
  };

  const placeholderColor = useThemeColor({ light: '#888', dark: '#ccc' }, 'background');

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.headerContainer}>
        <ThemedText style={styles.header}>AI 醫生</ThemedText>
      </ThemedView>
      
      <FlatList
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
      
      {isTyping && <TypingIndicator />}
      
      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={inputfiledthemeContainerStyle}
          value={input}
          onChangeText={setInput}
          placeholder="請在這裡輸入訊息..."
          placeholderTextColor={placeholderColor}
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
  container: {
    flex: 1,
  },
  container2: {
    flex: 1,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    paddingVertical: 10,
    height: 60,
  },
  headerContainer: {
    paddingTop: 10,
  },
  messageListContent: {
    paddingBottom: 20,
  },
  inputContainer: {
    padding: 10,
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
});
