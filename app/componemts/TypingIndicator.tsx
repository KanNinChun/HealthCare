import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TypingIndicator = () => {
  const [dots, setDots] = useState('.');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.dot}>{dots}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  dot: {
    fontSize: 24,
    marginHorizontal: 5,
    color: '#ccc',
  },
});

export default TypingIndicator;