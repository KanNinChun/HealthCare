import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TypingIndicator from '../TypingIndicator';
import OpenAI from 'openai';
import { ThemedView } from '../ThemedView';
import ThemedText from '../ThemedText';
import { useColorScheme } from '../../hooks/useColorScheme';

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
      const userMessage: Message = { role: 'user', content: input };
      const updatedMessages = [...messages, userMessage];
      
      // Update state and storage atomically
      setMessages(updatedMessages);
      await AsyncStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
      
      setInput('');
      setIsTyping(true);
      
      try {
        const gptResponse = await callOpenAI(updatedMessages);
        const assistantMessage: Message = { role: 'assistant', content: gptResponse || 'No response from DeepSeek.' };
        
        // Update state and storage atomically
        setMessages(prev => {
          const newMessages = [...prev, assistantMessage];
          AsyncStorage.setItem('chatMessages', JSON.stringify(newMessages));
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
    <ThemedView style={styles.container}>
      <ThemedText style={styles.header}>Healthcare Chatbot</ThemedText>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }: { item: Message }) => (
          <ThemedText style={item.role === 'user' ? userthemeContainerStyle : airthemeContainerStyle}>
            {item.content}
          </ThemedText>
        )}
        style={styles.messageList}
      />
      {isTyping && <TypingIndicator />}
      <TextInput
        style={inputfiledthemeContainerStyle}
        value={input}
        onChangeText={setInput}
        placeholder="Type your message..."
        placeholderTextColor={placeholderColor}
      />
      <ThemedView style={styles.buttonContainer}>
        <Button title="Send" onPress={sendMessage} />
        <Button title="Clear" onPress={clearChat} />
      </ThemedView>
    </ThemedView>
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
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center',
  },
  messageList: {
    flex: 1,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
