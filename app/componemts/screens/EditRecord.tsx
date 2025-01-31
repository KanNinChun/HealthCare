import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, TextInput, useColorScheme } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '../ThemedView';
import ThemedText from '../ThemedText';
import { router, useLocalSearchParams } from 'expo-router';
import { format } from 'date-fns';

const EditRecord = () => {
  const params = useLocalSearchParams<{ record: string }>(); // 獲取路由參數
  const [record, setRecord] = useState<{ value: number; timestamp: string } | null>(null); // 當前記錄狀態
  const [isLoading, setIsLoading] = useState(true); // 加載狀態
  const [editing, setEditing] = useState(false); // 是否處於編輯模式
  const [editedValue, setEditedValue] = useState(''); // 編輯後的血糖值
  const [editedDate, setEditedDate] = useState(record ? new Date(record.timestamp) : new Date()); // 編輯後的日期
  const [showDatePicker, setShowDatePicker] = useState(false); // 是否顯示日期選擇器
  const colorScheme = useColorScheme() || 'light'; // 獲取當前主題
  const placeholderTextColor = colorScheme === 'dark' ? '#888' : '#ccc'; // 輸入框提示文字顏色
  const styles = getStyles(colorScheme); // 根據主題獲取樣式

  // 初始化記錄數據
  useEffect(() => {
    const initialize = async () => {
      if (!params.record) {
        console.error('沒有收到記錄參數');
        router.back(); // 如果沒有記錄參數，返回上一頁
        return;
      }

      try {
        const recordData = JSON.parse(params.record); // 解析記錄數據
        setRecord(recordData); // 更新記錄狀態
        console.log('收到記錄:', recordData);
      } catch (error) {
        console.error('解析記錄時出錯:', error);
        Alert.alert('錯誤', '無法讀取記錄數據');
        router.back(); // 返回上一頁
      } finally {
        setIsLoading(false); // 結束加載
      }
    };

    initialize();
  }, [params.record]);

  // 如果正在加載，顯示加載中訊息
  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>加載中...</ThemedText>
      </ThemedView>
    );
  }

  // 如果沒有記錄數據，顯示錯誤訊息
  if (!record) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>無法找到記錄</ThemedText>
      </ThemedView>
    );
  }

  // 處理刪除記錄
  const handleDelete = async () => {
    try {
      if (!record) return;

      const userId = await AsyncStorage.getItem('userToken'); // 獲取用戶 ID
      if (!userId) return;

      const stored = await AsyncStorage.getItem(`bloodSugarRecords_${userId}`); // 獲取保存的記錄
      if (stored) {
        const records = JSON.parse(stored);
        const updatedRecords = records.filter((r: any) =>
          r.timestamp !== record.timestamp || r.value !== record.value // 過濾掉當前記錄
        );

        await AsyncStorage.setItem(
          `bloodSugarRecords_${userId}`,
          JSON.stringify(updatedRecords) // 保存更新後的記錄
        );

        router.back(); // 返回上一頁
      }
    } catch (error) {
      console.error('刪除記錄時出錯:', error);
      Alert.alert('錯誤', '刪除記錄時發生錯誤');
    }
  };

  // 處理編輯記錄
  const handleEdit = async () => {
    try {
      if (!record) return;

      const newValue = parseFloat(editedValue); // 解析新的血糖值
      if (isNaN(newValue) || newValue < 1 || newValue > 30) {
        Alert.alert('錯誤', '請輸入有效的血糖值 (1-30 mmol/L)');
        return;
      }

      const userId = await AsyncStorage.getItem('userToken'); // 獲取用戶 ID
      if (!userId) return;

      const stored = await AsyncStorage.getItem(`bloodSugarRecords_${userId}`); // 獲取保存的記錄
      if (stored) {
        const records = JSON.parse(stored);
        const updatedRecords = records.map((r: any) =>
          r.timestamp === record.timestamp && r.value === record.value
            ? { ...r, value: newValue, timestamp: editedDate.toISOString() } // 更新記錄
            : r
        );

        await AsyncStorage.setItem(
          `bloodSugarRecords_${userId}`,
          JSON.stringify(updatedRecords) // 保存更新後的記錄
        );

        setRecord({ ...record, value: newValue, timestamp: editedDate.toISOString() }); // 更新記錄狀態
        setEditing(false); // 退出編輯模式
        Alert.alert('成功', '記錄已更新');
        router.push('/componemts/screens/BloodSugarRecord'); // 跳轉到記錄列表頁面
      }
    } catch (error) {
      console.error('編輯記錄時出錯:', error);
      Alert.alert('錯誤', '更新記錄時發生錯誤');
    }
  };

  // 確認刪除記錄
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
        {/* 顯示當前記錄的血糖值 */}
        <ThemedText style={styles.label}>血糖值:</ThemedText>
        <ThemedText style={styles.value}>{record.value} mmol/L</ThemedText>

        {/* 顯示當前記錄的時間 */}
        <ThemedText style={styles.label}>時間:</ThemedText>
        <ThemedText style={styles.value}>
          {format(new Date(record.timestamp), 'yyyy-MM-dd HH:mm')}
        </ThemedText>

        {/* 按鈕容器 */}
        <View style={styles.buttonContainer}>
          {editing ? (
            <>
              {/* 編輯模式下的輸入框 */}
              <TextInput
                style={styles.input}
                value={editedValue}
                onChangeText={setEditedValue}
                placeholder="輸入新的血糖值 (1-30)"
                placeholderTextColor={placeholderTextColor}
                keyboardType="decimal-pad"
                textContentType="oneTimeCode"
              />
              {/* 日期選擇按鈕 */}
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <ThemedText style={styles.dateButtonText}>
                  {format(editedDate, 'yyyy-MM-dd HH:mm')}
                </ThemedText>
              </TouchableOpacity>
              {/* 日期選擇器 */}
              {showDatePicker && (
                <DateTimePicker
                  value={editedDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    if (date) {
                      setEditedDate(date); // 更新編輯後的日期
                    }
                    setShowDatePicker(false); // 隱藏日期選擇器
                  }}
                />
              )}
              {/* 保存按鈕 */}
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleEdit}
              >
                <ThemedText style={styles.buttonText}>保存</ThemedText>
              </TouchableOpacity>
              {/* 取消按鈕 */}
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setEditing(false)}
              >
                <ThemedText style={styles.buttonText}>取消</ThemedText>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* 編輯按鈕 */}
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={() => {
                  setEditedValue(record.value.toString()); // 設置編輯值
                  setEditing(true); // 進入編輯模式
                }}
              >
                <ThemedText style={styles.buttonText}>編輯</ThemedText>
              </TouchableOpacity>
              {/* 刪除按鈕 */}
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

// 根據主題獲取樣式
const getStyles = (colorScheme: 'light' | 'dark') => StyleSheet.create({
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
    borderColor: colorScheme === 'dark' ? '#444' : '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 18,
    color: colorScheme === 'dark' ? '#fff' : '#000',
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
  datePickerContainer: {
    marginBottom: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  dateButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default EditRecord;