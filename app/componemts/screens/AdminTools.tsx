import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import  ThemedText  from '../ThemedText';
import { ThemedView } from '../ThemedView';

const AdminTools = () => {
  const deleteAllUsers = async () => {
    try {
      const db = await SQLite.openDatabaseAsync('healthcare.db');
      await db.execAsync('DELETE FROM users');
      Alert.alert('Success', 'All users have been deleted');
    } catch (error) {
      console.error('Error deleting users:', error);
      Alert.alert('Error', 'Failed to delete users');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity 
        style={styles.button}
        onPress={deleteAllUsers}
      >
        <ThemedText style={styles.buttonText}>Delete All Users</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminTools;