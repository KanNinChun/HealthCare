import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'

const HealthInfoScreen = () => {
  return (
    <ScrollView>
       <StatusBar style="auto"/> 
      <Text>HealthInfoScreen</Text>
    </ScrollView>
  )
}

export default HealthInfoScreen

const styles = StyleSheet.create({})