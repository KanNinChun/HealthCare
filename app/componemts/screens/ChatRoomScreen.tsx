import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TypingIndicator from '../TypingIndicator';
import OpenAI from 'openai';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { useColorScheme } from '../../hooks/useColorScheme';

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY,
});

export default function ChatRoomScreen() {
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<{ id: string; text: string; sender: string }[]>([]);
  const [input, setInput] = useState('');

  const colorScheme = useColorScheme(); // Get the current color scheme
  const userthemeContainerStyle = colorScheme === 'light' ? styles.userlightContainer : styles.userdarkContainer; // Get current theme color
  const airthemeContainerStyle = colorScheme === 'light' ? styles.ailightContainer : styles.aidarkContainer; // Get current theme color
  const inputfiledthemeContainerStyle = colorScheme === 'light' ? styles.inputfiledlightContainer : styles.inputfileddarkContainer; // Get current theme color
  
  const callOpenAI = async (userMessage: string) => {
    try {
      const completion = await openai.chat.completions.create({
        model: 'deepseek-chat',
        messages: [
          { role: 'assistant', content: userMessage },
        ],
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error calling DeepSeek API:', error);
      return 'Error retrieving response from DeepSeek.';
    }
  };

  const sendMessage = async () => {
    if (input.trim()) {
      const newMessage = { id: Date.now().toString(), text: input, sender: 'user' };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      setInput('');
      await AsyncStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
      setIsTyping(true); // Show typing indicator
      const gptMessage = await callOpenAI(input);
      setIsTyping(false); // Stop typing indicator after receiving response
      const gptResponseMessage = { id: Date.now().toString(), text: gptMessage || 'No response from DeepSeek.', sender: 'DeepSeek' };
      setMessages((prevMessages) => [...prevMessages, gptResponseMessage]);
    }
  };

  useEffect(() => {
    const loadMessages = async () => {
      const storedMessages = await AsyncStorage.getItem('chatMessages');
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    };
    loadMessages();
  }, []);

  const clearChat = async () => {
    setMessages([]);
    await AsyncStorage.removeItem('chatMessages');
  };

  const placeholderColor = useThemeColor({ light: '#888', dark: '#ccc' }, 'background'); // Placeholder color based on theme

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.header}>Healthcare Chatbot</ThemedText>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: { id: string; text: string; sender: string } }) => (
          <ThemedText style={item.sender === 'user' ? userthemeContainerStyle : airthemeContainerStyle}>
            {item.text}
          </ThemedText>
        )}
        style={styles.messageList}
      />
      {isTyping && <TypingIndicator />}
      <TextInput
        style={inputfiledthemeContainerStyle} // Use dynamic input field style based on theme
        value={input}
        onChangeText={setInput}
        placeholder="Type your message..."
        placeholderTextColor={placeholderColor} // Use dynamic placeholder color
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
    backgroundColor: '#d4edda',//'#d4edda', // Light green for light mode
    marginBottom: 10,
    alignSelf: 'flex-end', // Align to the right
  },
  userdarkContainer: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#c76e00', // Dark color for dark mode
    marginBottom: 10,
    alignSelf: 'flex-end', // Align to the right
  },
  ailightContainer: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f1f1f1', // Light gray for light mode
    marginBottom: 10,
    alignSelf: 'flex-start', // Align to the left
  },
  aidarkContainer: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#444444', // Darker gray for dark mode
    marginBottom: 10,
    alignSelf: 'flex-start', // Align to the left
  },
  inputfiledlightContainer:{
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  inputfileddarkContainer:{
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: '#fff',
  },  container: {
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
