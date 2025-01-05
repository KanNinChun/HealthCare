import { View, Text } from 'react-native'
import React from 'react'
import TopTabBar from '../naviagtions/TopTabBar'
import useBackHandler from '../componemts/useBackHandle'
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function _layout() {
  useBackHandler();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TopTabBar" component={TopTabBar} options={{ headerShown: false}} />
    </Stack.Navigator>
  )
}