import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '../ThemedView';
import ThemedText from '../ThemedText';
import { router, useLocalSearchParams } from 'expo-router';
import { format } from 'date-fns';

const EditRecord = () => {
  const params = useLocalSearchParams<{ record: string }>();
  const [record, setRecord] = useState<{ value: number; timestamp: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedValue, setEditedValue] = useState('');

  useEffect(() => {
    const initialize = async () => {
      if (!params.record) {
        console.error('No record provided');
        router.back();
        return;
      }
      
      try {
        const recordData = JSON.parse(params.record);
        setRecord(recordData);
        console.log('Received record:', recordData);
      } catch (error) {
        console.error('Error parsing record:', error);
        Alert.alert('錯誤', '無法讀取記錄數據');
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [params.record]);

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>加載中...</ThemedText>
      </ThemedView>
    );
  }

  if (!record) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>無法找到記錄</ThemedText>
      </ThemedView>
    );
  }

  const handleDelete = async () => {
    try {
      if (!record) return;
      
      const userId = await AsyncStorage.getItem('userToken');
      if (!userId) return;

      const stored = await AsyncStorage.getItem(`bloodSugarRecords_${userId}`);
      if (stored) {
        const records = JSON.parse(stored);
        const updatedRecords = records.filter((r: any) =>
          r.timestamp !== record.timestamp || r.value !== record.value
        );
        
        await AsyncStorage.setItem(
          `bloodSugarRecords_${userId}`,
          JSON.stringify(updatedRecords)
        );
        
        router.back();
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      Alert.alert('錯誤', '刪除記錄時發生錯誤');
    }
  };

  const handleEdit = async () => {
    try {
      if (!record) return;
      
      const newValue = parseFloat(editedValue);
      if (isNaN(newValue)) {
        Alert.alert('錯誤', '請輸入有效的血糖值');
        return;
      }

      const userId = await AsyncStorage.getItem('userToken');
      if (!userId) return;

      const stored = await AsyncStorage.getItem(`bloodSugarRecords_${userId}`);
      if (stored) {
        const records = JSON.parse(stored);
        const updatedRecords = records.map((r: any) =>
          r.timestamp === record.timestamp && r.value === record.value
            ? { ...r, value: newValue }
            : r
        );
        
        await AsyncStorage.setItem(
          `bloodSugarRecords_${userId}`,
          JSON.stringify(updatedRecords)
        );
        
        setRecord({ ...record, value: newValue });
        setEditing(false);
        Alert.alert('成功', '記錄已更新');
      }
    } catch (error) {
      console.error('Error editing record:', error);
      Alert.alert('錯誤', '更新記錄時發生錯誤');
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      '刪除記錄',
      '確定要刪除此記錄嗎？',
      [
        { text: '取消', style: 'cancel' },
        { text: '刪除', onPress: handleDelete }
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.label}>血糖值:</ThemedText>
        <ThemedText style={styles.value}>{record.value} mmol/L</ThemedText>

        <ThemedText style={styles.label}>時間:</ThemedText>
        <ThemedText style={styles.value}>
          {format(new Date(record.timestamp), 'yyyy-MM-dd HH:mm')}
        </ThemedText>

        <View style={styles.buttonContainer}>
          {editing ? (
            <>
              <TextInput
                style={styles.input}
                value={editedValue}
                onChangeText={setEditedValue}
                placeholder="輸入新的血糖值"
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleEdit}
              >
                <ThemedText style={styles.buttonText}>保存</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setEditing(false)}
              >
                <ThemedText style={styles.buttonText}>取消</ThemedText>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={() => {
                  setEditedValue(record.value.toString());
                  setEditing(true);
                }}
              >
                <ThemedText style={styles.buttonText}>編輯</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={confirmDelete}
              >
                <ThemedText style={styles.buttonText}>刪除</ThemedText>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    marginTop: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: '#666',
  },
  value: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 18,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  saveButton: {
    backgroundColor: '#2196F3',
  },
  cancelButton: {
    backgroundColor: '#9E9E9E',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditRecord;