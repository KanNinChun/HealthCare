import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TypingIndicator from '../TypingIndicator';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY,
});

export default function ChatRoomScreen() {
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<{ id: string; text: string; sender: string }[]>([]);
  const [input, setInput] = useState('');

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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Healthcare Chatbot</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: { id: string; text: string; sender: string } }) => (
          <Text style={item.sender === 'user' ? styles.userMessage : styles.openAIMessage}>
            {item.text}
          </Text>
        )}
        style={styles.messageList}
      />
      {isTyping && <TypingIndicator />}
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="Type your message..."
      />
      <View style={styles.buttonContainer}>
        <Button title="Send" onPress={sendMessage} />
        <Button title="Clear" onPress={clearChat} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  messageList: {
    flex: 1,
    marginBottom: 20,
  },
  openAIMessage: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f1f1f1',
    marginBottom: 10,
    alignSelf: 'flex-start', // Align to the left
  },
  userMessage: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#d4edda', // Light green color
    marginBottom: 10,
    alignSelf: 'flex-end', // Align to the right
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
