import { View, Text } from 'react-native'
import React from 'react'
import TopTabBar from '../naviagtions/TopTabBar'
import useBackHandler from '../componemts/useBackHandle'

export default function _layout() {
  useBackHandler();
  return (
    <TopTabBar/>
  )
}