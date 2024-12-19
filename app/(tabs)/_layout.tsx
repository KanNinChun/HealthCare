import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme} from '../hooks/useColorScheme';
import TabIcon from '../componemts/Icon';
import HomeScreen from '../componemts/screens/HomeScreen'; 
import SettingsScreen from '../componemts/screens/SettingsScreen';
const Tab = createBottomTabNavigator(); 

const TabsLayOut = () => { 
    const colorScheme = useColorScheme(); //獲取當前主題顏色
    const themeContainerStyle = colorScheme === 'light' ? styles.lightContainer : styles.darkContainer; //獲取當前主題顏色

    return ( 
        <>
            <Tab.Navigator
                screenOptions={{
                    tabBarShowLabel: false, // Hide labels
                    tabBarActiveTintColor: '#FFA001', // 當Click左嘅顏色 //FFA001 orange
                    tabBarInactiveTintColor: themeContainerStyle.color, // 當未Click時嘅顏色
                    tabBarStyle: {
                        backgroundColor: themeContainerStyle.backgroundColor, // Background color of the navbar
                        borderTopWidth: 1,
                        borderColor: themeContainerStyle.color, // 一條灰色橫線[分隔線] '#232533'
                        height: 70,
                    },
                }}
            > 
                <Tab.Screen name="Home" component={HomeScreen} 
                    options={{
                        title: '主頁',
                        headerShown: false, // 隱藏Header
                        tabBarIcon: ({ color, size, focused }) => (
                            <TabIcon
                                iconFamily = "AntDesign"
                                iconName="home"
                                color={color}
                                name="主頁"
                                focused={focused}
                            />
                        )
                    }}
                /> 

                <Tab.Screen name="Settings" component={SettingsScreen} 
                    options={{
                        title: '設定',
                        headerShown: false, // 隱藏Header
                        tabBarIcon: ({ color, size, focused }) => (
                            <TabIcon
                                iconFamily = "AntDesign"
                                iconName="setting"
                                color={color}
                                name="設定"
                                focused={focused}
                            />
                        )
                    }}
                /> 
            </Tab.Navigator>
        </>
    ); 
}; 

const styles = StyleSheet.create({

    lightContainer: {
      color: '#191919',
      backgroundColor: '#FFFFFF',
    },
    darkContainer: {
      color: '#d1d1d1',
      backgroundColor: '#000105',
    },
    semiboldText: { fontFamily: 'font-psemibold', }, 
    regularText: { fontFamily: 'font-pregular', },
});

export default TabsLayOut;