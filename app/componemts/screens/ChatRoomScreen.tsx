import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPEN_AI_API_KEY,
});

const API_URL = 'https://api.openai.com/v1/chat/completions';

export default function ChatRoomScreen() {
  const [messages, setMessages] = useState<{ id: string; text: string; sender: string }[]>([]);
  const [input, setInput] = useState('');

  const callOpenAI = async (userMessage: string) => {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: userMessage },
        ],
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      return 'Error retrieving response from OpenAI.';
    }
  };

  const sendMessage = async () => {
    if (input.trim()) {
      const newMessage = { id: Date.now().toString(), text: input, sender: 'user' };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      setInput('');
      await AsyncStorage.setItem('chatMessages', JSON.stringify(updatedMessages));

      const gptMessage = await callOpenAI(input);
      const gptResponseMessage = { id: Date.now().toString(), text: gptMessage || 'No response from OpenAI.', sender: 'openai' };
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
        renderItem={({ item }) => (
          <Text style={item.sender === 'user' ? styles.userMessage : styles.openAIMessage}>
            {item.text}
          </Text>
        )}
        style={styles.messageList}
      />
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
};

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
