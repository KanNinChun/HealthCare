import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '../ThemedView';
import ThemedText from '../ThemedText';
import { format } from 'date-fns';
import { LineChart } from 'react-native-chart-kit';
import { FloatingAction } from 'react-native-floating-action';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const BloodSugarRecord = () => {
  const [records, setRecords] = useState<Array<{ value: number; timestamp: string }>>([]); // 血糖記錄狀態

  // 當頁面聚焦時加載記錄
  useFocusEffect(
    useCallback(() => {
      const loadRecords = async () => {
        try {
          const userId = await AsyncStorage.getItem('userToken'); // 從 AsyncStorage 獲取用戶 ID
          if (!userId) return;

          const stored = await AsyncStorage.getItem(`bloodSugarRecords_${userId}`); // 獲取保存的血糖記錄

          if (stored) setRecords(JSON.parse(stored)); // 更新記錄狀態
        } catch (error) {
          console.error('加載記錄時發生錯誤:', error);
        }
      };
      loadRecords();
    }, [])
  );

  // 根據血糖值獲取健康狀態
  const getStatus = (value: number): string => {
    if (value < 4.0) return '低血糖';
    if (value <= 5.5) return '正常';
    if (value <= 7.0) return '高血糖';
    return '危險';
  };

  // 計算指定天數的平均值
  const getAverage = (days: number): number => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days); // 計算截止日期

    const recentRecords = records.filter(record =>
      new Date(record.timestamp) > cutoffDate // 過濾出最近指定天數的記錄
    );

    return recentRecords.length > 0
      ? recentRecords.reduce((sum, r) => sum + r.value, 0) / recentRecords.length // 計算平均值
      : 0;
  };

  // 將十六進制顏色轉換為 RGB 數值
  const hexToRgb = (hex: string): number => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ?
      parseInt(result[1], 16) << 16 |
      parseInt(result[2], 16) << 8 |
      parseInt(result[3], 16)
      : 0xFF0000; // 如果解析失敗，默認為紅色
  };

  // 將 RGB 數值轉換為十六進制顏色
  const colorNumberToHex = (color: number): string => {
    return `#${(color & 0xFFFFFF).toString(16).padStart(6, '0')}`;
  };

  // 根據血糖值獲取對應的顏色
  const getColorForValue = (value: number): number => {
    if (value < 4.0) return hexToRgb('#0000FF'); // 低血糖：藍色
    if (value <= 5.5) return hexToRgb('#00FF00'); // 正常：綠色
    if (value <= 7.0) return hexToRgb('#FFA500'); // 高血糖：橙色
    return hexToRgb('#FF0000'); // 危險：紅色
  };

  // 圖表數據配置
  interface ChartData {
    labels: string[];
    datasets: Array<{
      data: number[];
      color?: (opacity: number) => string;
      strokeWidth?: number;
    }>;
  }

  const chartData: ChartData = {
    labels: records.map(r => format(new Date(r.timestamp), 'MM/dd')), // 格式化日期標籤
    datasets: [{
      data: records.map(r => r.value), // 血糖值數據
      color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`, // 線條顏色
      strokeWidth: 2 // 線條寬度
    }]
  };

  // 圖表配置
  const chartConfig = {
    backgroundGradientFrom: '#fff', // 背景漸變起始顏色
    backgroundGradientTo: '#fff', // 背景漸變結束顏色
    decimalPlaces: 1, // 小數位數
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // 文字顏色
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // 標籤顏色
    propsForDots: {
      strokeWidth: 2, // 點邊框寬度
      stroke: '#fff' // 點邊框顏色
    }
  };

  // 圖表尺寸
  const chartWidth = Dimensions.get('window').width - 32; // 圖表寬度
  const chartHeight = 220; // 圖表高度
  const maxYValue = 10; // Y 軸最大值
  const verticalPadding = 20; // 垂直間距

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.container2}>
        <ScrollView>
          {/* 摘要卡片 */}
          <View style={styles.summaryRow}>
            <ThemedView style={[styles.card, styles.latestCard]}>
              <ThemedText style={styles.cardTitle}>最近新增</ThemedText>
              <ThemedText style={styles.cardValue}>
                {records.length > 0 ?
                  `${records[records.length - 1].value.toFixed(1)} mmol/L` : // 顯示最新記錄
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

          {/* 圖表 */}
          <View style={styles.chartContainer}>
            {records.length > 0 ? (
              <LineChart
                data={{
                  labels: records.map((r) => format(new Date(r.timestamp), 'MM/dd')), // 格式化日期標籤
                  datasets: [{
                    data: records.map((r) => r.value), // 血糖值數據
                    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`, // 線條顏色
                    strokeWidth: 2 // 線條寬度
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
                bezier // 使用貝塞爾曲線
                style={{ marginVertical: 25 }}
                formatYLabel={(value) => `${(Math.round(Number(value))).toFixed(1)} `} // 格式化 Y 軸標籤
                segments={5} // Y 軸分段
                fromZero // Y 軸從 0 開始
              />
            ) : (
              <ThemedText style={styles.noDataText}>
                沒有血糖記錄
              </ThemedText>
            )}
          </View>

          {/* 記錄列表 */}
          <ThemedView>
            {records.length > 0 ? (
              <ThemedView style={styles.infocontainer}>
                <ThemedView style={styles.infolist}>
                  <ThemedText>血糖值</ThemedText>
                  <ThemedText>情況</ThemedText>
                  <ThemedText>日期</ThemedText>
                </ThemedView>

                <View style={styles.recordList}>
                  {records.map((record, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.recordItem}
                      onPress={() => router.push({
                        pathname: '/componemts/screens/EditRecord',
                        params: { record: JSON.stringify(record) }
                      })}
                    >
                      <ThemedText style={[styles.recordValue, { color: colorNumberToHex(getColorForValue(record.value)) }]}>
                        {record.value} mmol/L
                      </ThemedText>
                      <ThemedText style={styles.recordStatus}>{getStatus(record.value)}</ThemedText>
                      <ThemedText style={styles.recordTimestamp}>
                        {format(new Date(record.timestamp), 'yyyy-MM-dd HH:mm')}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </ThemedView>
            ) : null}
          </ThemedView>
        </ScrollView>

        {/* 浮動按鈕 */}
        <FloatingAction
          actions={[
            {
              text: '新增記錄',
              icon: <ThemedText style={{ fontSize: 24 }}>+</ThemedText>,
              name: 'add_record',
            },
          ]}
          onPressItem={(name) => {
            if (name === 'add_record') {
              router.push('/componemts/screens/AddRecord'); // 跳轉到新增記錄頁面
            } else if (name === 'edit_record') {
              router.push('/componemts/screens/EditRecord'); // 跳轉到編輯記錄頁面
            }
          }}
        />
      </ThemedView>
    </SafeAreaView>
  );
};

// 樣式表
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container2: {
    padding: 5,
    flex: 1,
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
    backgroundColor: '#8ccfff',
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
    paddingTop: 10,
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 24,
    color: '#949494',
  },
});

export default BloodSugarRecord;