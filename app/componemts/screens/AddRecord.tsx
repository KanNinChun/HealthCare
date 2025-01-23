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

const AddRecord = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [date, setDate] = useState(new Date());
  const [value, setValue] = useState(5.0);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = async () => {
    try {
      const newRecord = {
        value: parseFloat(value.toFixed(1)),
        timestamp: date.toISOString(),
        status: getStatusForValue(value)
      };

      // Get existing records
      const existingRecords = await AsyncStorage.getItem('bloodSugarRecords');
      const records = existingRecords ? JSON.parse(existingRecords) : [];
      
      // Add new record and save
      records.push(newRecord);
      await AsyncStorage.setItem('bloodSugarRecords', JSON.stringify(records));
      
      // Navigate back with updated data
      navigation.goBack();
    } catch (error) {
      console.error('Error saving record:', error);
    }
  };

  const getStatusForValue = (value: number): string => {
    if (value < 4.0) return '低血糖';
    if (value <= 5.5) return '正常';
    if (value <= 7.0) return '高血糖';
    return '危險';
  };

  return (
    <ThemedView style={styles.container}>
      {/* DateTime Selector */}
      <View style={styles.section}>
        <ThemedText style={styles.label}>日期和時間 ▸</ThemedText>
        <ThemedText 
          style={styles.dateText}
          onPress={() => setShowDatePicker(true)}
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
            mode="datetime"
            display="default"
            onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
              if (event.type === 'set' && selectedDate) {
                setDate(selectedDate);
              }
              setShowDatePicker(false);
            }}
          />
        )}
      </View>

      {/* Measurement Input */}
      <View style={styles.section}>
        <ThemedText style={styles.label}>血糖值: {value.toFixed(1)} mmol/L</ThemedText>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={35}
          step={0.1}
          value={value}
          onSlidingComplete={setValue}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="#8E8E93"
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        activeOpacity={0.8}
      >
        <ThemedText style={styles.saveButtonText}>保存記錄</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
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