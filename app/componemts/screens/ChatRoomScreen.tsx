import React, { useState, useEffect, useRef } from 'react'; // Add useRef
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

export default function ChatRoomScreen() {
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null); // Add a ref for FlatList

  const colorScheme = useColorScheme();
  const userthemeContainerStyle = colorScheme === 'light' ? styles.userlightContainer : styles.userdarkContainer;
  const airthemeContainerStyle = colorScheme === 'light' ? styles.ailightContainer : styles.aidarkContainer;
  const inputfiledthemeContainerStyle = colorScheme === 'light' ? styles.inputfiledlightContainer : styles.inputfileddarkContainer;

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

      setMessages(updatedMessages);
      await AsyncStorage.setItem(`chatMessages_${userId}`, JSON.stringify(updatedMessages));

      setInput('');
      setIsTyping(true);

      try {
        const gptResponse = await callOpenAI(updatedMessages);
        const assistantMessage: Message = { role: 'assistant', content: gptResponse || 'No response from DeepSeek.' };

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

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

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
        ref={flatListRef} // Add ref to FlatList
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