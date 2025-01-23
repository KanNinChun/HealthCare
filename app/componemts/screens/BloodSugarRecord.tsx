import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '../ThemedView';
import ThemedText from '../ThemedText';
import { format } from 'date-fns';
import { LineChart } from 'react-native-chart-kit';
import { Circle } from 'react-native-svg';
import { FloatingAction } from 'react-native-floating-action';
import { router } from 'expo-router';


const BloodSugarRecord = () => {
  const [records, setRecords] = useState<Array<{value: number; timestamp: string}>>([]);

  useEffect(() => {
    const loadRecords = async () => {
      try {
        const stored = await AsyncStorage.getItem('bloodSugarRecords');
        if (stored) setRecords(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading records:', error);
      }
    };
    loadRecords();
  }, []);

  const getStatus = (value: number): string => {
    if (value < 4.0) return 'Low';
    if (value <= 5.5) return 'Normal';
    if (value <= 7.0) return 'High';
    return 'Dangerous';
  };

  const hexToRgb = (hex: string): number => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ?
      parseInt(result[1], 16) << 16 |
      parseInt(result[2], 16) << 8 |
      parseInt(result[3], 16)
      : 0xFF0000; // default to red if parsing fails
  };

  const colorNumberToHex = (color: number): string => {
    return `#${(color & 0xFFFFFF).toString(16).padStart(6, '0')}`;
  };

  const getColorForValue = (value: number): number => {
    if (value < 4.0) return hexToRgb('#0000FF');
    if (value <= 5.5) return hexToRgb('#00FF00');
    if (value <= 7.0) return hexToRgb('#FFA500');
    return hexToRgb('#FF0000');
  };

  // Chart configuration with proper TypeScript types
  interface ChartData {
    labels: string[];
    datasets: Array<{
      data: number[];
      color?: (opacity: number) => string;
      strokeWidth?: number;
    }>;
  }

  const chartData: ChartData = {
    labels: records.map(r => format(new Date(r.timestamp), 'MM/dd')),
    datasets: [{
      data: records.map(r => r.value),
      color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
      strokeWidth: 2
    }]
  };

  // Chart config with proper TypeScript type
  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForDots: {
      strokeWidth: 2,
      stroke: '#fff'
    }
  };

  // Chart measurements
  const chartWidth = Dimensions.get('window').width - 32;
  const chartHeight = 220;
  const maxValue = Math.max(...records.map(r => r.value));
  const maxYValue = Math.ceil(maxValue / 2) * 2; // Round up to nearest even number
  const verticalPadding = 40;

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <ThemedView style={[styles.card, styles.latestCard]}>
            <ThemedText style={styles.cardTitle}>Latest</ThemedText>
            <ThemedText style={styles.cardValue}>5.6 mmol/L</ThemedText>
          </ThemedView>
          
          <ThemedView style={[styles.card, styles.average3Card]}>
            <ThemedText style={styles.cardTitle}>3-Day Avg</ThemedText>
            <ThemedText style={styles.cardValue}>5.8 mmol/L</ThemedText>
          </ThemedView>
          
          <ThemedView style={[styles.card, styles.average7Card]}>
            <ThemedText style={styles.cardTitle}>7-Day Avg</ThemedText>
            <ThemedText style={styles.cardValue}>6.1 mmol/L</ThemedText>
          </ThemedView>
        </View>

        {/* Chart */}
        <View style={styles.chartContainer}>
          {records.length > 0 ? (
            <LineChart
              data={{
                labels: records.map((r) => format(new Date(r.timestamp), 'MM/dd')),
                datasets: [{
                  data: records.map((r) => r.value),
                  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                  strokeWidth: 2
                }]
              }}
              width={chartWidth}
              height={220}
              chartConfig={{
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                propsForDots: {
                  r: '5',
                  strokeWidth: '2',
                  stroke: '#fff'
                }
              }}
              bezier
              style={{ marginVertical: 8 }}
              formatYLabel={(value) => `${(Math.round(Number(value) * 2)/2).toFixed(1)} mmol/L`}
              segments={5}
              fromZero
              decorator={() => (
                records.map((record, index) => (
                  <Circle
                    key={index}
                    cx={(chartWidth * index) / Math.max(records.length - 1, 1)}
                    cy={Number(chartHeight) - 40 - (
                      (Number(record.value) / (Math.max(Number(maxYValue), 1) || 1)) *
                      (Number(chartHeight) - 80)
                    )}
                    r="5"
                    fill={colorNumberToHex(getColorForValue(record.value))}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))
              )}
            />
          ) : (
            <ThemedText style={styles.noDataText}>
              No blood sugar records available
            </ThemedText>
          )}
        </View>

        {/* Record List */}
        <View style={styles.recordList}>
          {records.map((record, index) => (
            <ThemedView key={index} style={styles.recordItem}>
              <ThemedText style={[styles.recordValue, { color: colorNumberToHex(getColorForValue(record.value)) }]}>
                {record.value} mmol/L
              </ThemedText>
              <ThemedText style={styles.recordStatus}>{getStatus(record.value)}</ThemedText>
              <ThemedText style={styles.recordTimestamp}>
                {format(new Date(record.timestamp), 'yyyy-MM-dd HH:mm')}
              </ThemedText>
            </ThemedView>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <FloatingAction
        actions={[{
          text: 'Add Record',
          icon: <ThemedText style={{ fontSize: 24 }}>+</ThemedText>,
          name: 'add_record',
        }]}
        onPressItem={() => router.push('/componemts/screens/AddRecord')}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  card: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  latestCard: {
    backgroundColor: '#e3f2fd',
  },
  average3Card: {
    backgroundColor: '#fff3e0',
  },
  average7Card: {
    backgroundColor: '#fbe9e7',
  },
  cardTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chartContainer: {
    height: 300,
    marginBottom: 24,
  },
  chart: {
    flex: 1,
  },
  recordList: {
    marginBottom: 80,
  },
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  recordValue: {
    flex: 1,
    fontWeight: 'bold',
  },
  recordStatus: {
    flex: 2,
    textAlign: 'center',
  },
  recordTimestamp: {
    flex: 1,
    textAlign: 'right',
  },
  noDataText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default BloodSugarRecord;