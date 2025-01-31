import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedView } from '../ThemedView';
import ThemedText from '../ThemedText';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../naviagtions/types';
import { SafeAreaView } from 'react-native-safe-area-context';

const AddRecord = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // 獲取導航對象
  const [date, setDate] = useState(new Date()); // 日期狀態
  const [value, setValue] = useState(5.0); // 血糖值狀態
  const [showDatePicker, setShowDatePicker] = useState(false); // 是否顯示日期選擇器

  // 保存記錄的函數
  const handleSave = async () => {
    try {
      const newRecord = {
        value: parseFloat(value.toFixed(1)), // 格式化血糖值
        timestamp: date.toISOString(), // 格式化日期
        status: getStatusForValue(value) // 根據血糖值獲取狀態
      };
      const userId = await AsyncStorage.getItem('userToken'); // 從 AsyncStorage 獲取用戶 ID
      if (!userId) return;

      // 獲取現有記錄
      const existingRecords = await AsyncStorage.getItem(`bloodSugarRecords_${userId}`);
      const records = existingRecords ? JSON.parse(existingRecords) : [];

      // 添加新記錄並保存
      records.push(newRecord);
      await AsyncStorage.setItem(`bloodSugarRecords_${userId}`, JSON.stringify(records));

      // 返回上一頁
      navigation.goBack();
    } catch (error) {
      console.error('保存記錄時發生錯誤:', error);
    }
  };

  // 根據血糖值獲取狀態的函數
  const getStatusForValue = (value: number): string => {
    if (value < 4.0) return '低血糖';
    if (value <= 5.5) return '正常';
    if (value <= 7.0) return '高血糖';
    return '危險';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.container2}>
        {/* 日期選擇器 */}
        <View style={styles.section}>
          <ThemedText style={styles.label}>日期和時間 ▸</ThemedText>
          <ThemedText
            style={styles.dateText}
            onPress={() => setShowDatePicker(true)} // 點擊後顯示日期選擇器
          >
            {date.toLocaleString('zh-HK', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </ThemedText>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                if (event.type === 'set' && selectedDate) {
                  setDate(selectedDate); // 更新日期狀態
                }
                setShowDatePicker(false); // 隱藏日期選擇器
              }}
            />
          )}
        </View>

        {/* 血糖值輸入 */}
        <View style={styles.section}>
          <ThemedText style={styles.label}>血糖值: {value.toFixed(1)} mmol/L</ThemedText>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={35}
            step={0.1}
            value={value}
            onSlidingComplete={setValue} // 滑動完成後更新血糖值
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#8E8E93"
          />
        </View>

        {/* 保存按鈕 */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave} // 點擊後保存記錄
          activeOpacity={0.8}
        >
          <ThemedText style={styles.saveButtonText}>保存記錄</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container2: {
    padding: 5,
    flex: 1,
  },
  section: {
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddRecord;