import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
  const [records, setRecords] = useState<Array<{ value: number; timestamp: string }>>([]);

  useFocusEffect(
    useCallback(() => {
      const loadRecords = async () => {
        try {
          const stored = await AsyncStorage.getItem('bloodSugarRecords');
          if (stored) setRecords(JSON.parse(stored));
        } catch (error) {
          console.error('Error loading records:', error);
        }
      };
      loadRecords();
    }, [])
  );

  const getStatus = (value: number): string => {
    if (value < 4.0) return '低血糖';
    if (value <= 5.5) return '正常';
    if (value <= 7.0) return '高血糖';
    return '危險';
  };

  // Calculate rolling average for given days
  const getAverage = (days: number): number => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentRecords = records.filter(record =>
      new Date(record.timestamp) > cutoffDate
    );

    return recentRecords.length > 0
      ? recentRecords.reduce((sum, r) => sum + r.value, 0) / recentRecords.length
      : 0;
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
  const maxYValue = 10; // Fixed maximum for 0-10 scale
  const verticalPadding = 20;

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <ThemedView style={[styles.card, styles.latestCard]}>
            <ThemedText style={styles.cardTitle}>最近新增</ThemedText>
            <ThemedText style={styles.cardValue}>
              {records.length > 0 ?
                `${records[records.length - 1].value.toFixed(1)} mmol/L` :
                '--'
              }
            </ThemedText>
          </ThemedView>

          <ThemedView style={[styles.card, styles.average3Card]}>
            <ThemedText style={styles.cardTitle}>3日 平均值</ThemedText>
            <ThemedText style={styles.cardValue}>
              {getAverage(3).toFixed(1)} mmol/L
            </ThemedText>
          </ThemedView>

          <ThemedView style={[styles.card, styles.average7Card]}>
            <ThemedText style={styles.cardTitle}>7日 平均值</ThemedText>
            <ThemedText style={styles.cardValue}>
              {getAverage(7).toFixed(1)} mmol/L
            </ThemedText>
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
              style={{ marginVertical: 25 }}
              formatYLabel={(value) => `${(Math.round(Number(value) ) ).toFixed(1)} `}
              segments={5}
              fromZero
            />
          ) : (
            <ThemedText style={styles.noDataText}>
              No blood sugar records available
            </ThemedText>
          )}
        </View>

        {/* Record List */}

        
        <ThemedView style={styles.infocontainer}>
          <ThemedView style={styles.infolist}>
            <ThemedText>血糖值</ThemedText>
            <ThemedText>情況</ThemedText>
            <ThemedText>日期</ThemedText>
          </ThemedView>

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
          </ThemedView>
      </ScrollView>

      {/* Floating Action Button */}
      <FloatingAction
        actions={[{
          text: '新增記錄',
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
    padding: 12,
    paddingTop: 40,
  },
  infocontainer: {
    borderWidth: 1,
    borderColor: '#eee',
  },
  infolist: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#cdb3fc',
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
    backgroundColor: '#8ccfff',//'#e3f2fd',
  },
  average3Card: {
    backgroundColor: '#fcc46d',
  },
  average7Card: {
    backgroundColor: '#ff8578',
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',

  },
  chartContainer: {
    height: 300,
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