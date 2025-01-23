import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme } from '../hooks/useColorScheme';
import TabIcon from '../componemts/Icon';
import HomeScreen from '../componemts/screens/HomeScreen';
import SettingsScreen from '../componemts/screens/SettingScreen';
import HealthInfoScreen from '../componemts/screens/HealthInfoScreen';
import Map from '../componemts/screens/Map';
import { useTheme } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';

export type BottomTapBar =
    {
        主頁: any,
        醫院地圖: any,
        健康資訊: any,
        設定: any,
    }

const Tab = createBottomTabNavigator();

const TabsLayOut = () => {
    const colorScheme = useColorScheme(); //獲取當前主題顏色
    const themeContainerStyle = colorScheme === 'light' ? styles.lightContainer : styles.darkContainer; //獲取當前主題顏色
    const tabBarActiveTintColor = colorScheme === 'light' ? '#2f57f7' : '#FFA001'; // Light theme: orange, Dark theme: green
    const headerShown = false;
    
    return (
            <Tab.Navigator
                backBehavior="history"
                screenOptions={{
                    headerShown: false, // 隱藏Header
                    tabBarShowLabel: false, // Hide labels
                    tabBarActiveTintColor: tabBarActiveTintColor, // 當Click左嘅顏色 //FFA001 orange
                    tabBarInactiveTintColor: themeContainerStyle.color, // 當未Click時嘅顏色
                    tabBarStyle: {
                        backgroundColor: themeContainerStyle.backgroundColor, // Background color of the navbar
                        borderTopWidth: 1,
                        borderColor: themeContainerStyle.color, // 一條灰色橫線[分隔線] '#232533'
                        height: 70,
                        position: 'absolute',
                    },
                }}
            >
                <Tab.Screen name="主頁" component={HomeScreen}
                    options={{
                        title: '主頁',
                        tabBarShowLabel: headerShown,
                        headerShown: headerShown, // 隱藏Header
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                iconFamily="AntDesign"
                                iconName="home"
                                color={color}
                                name="主頁"
                                focused={focused}
                            />
                        )
                    }}
                />

                <Tab.Screen name="醫院地圖" component={Map}
                    options={{
                        title: '醫院地圖',
                        headerShown: headerShown, // 隱藏Header
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                iconFamily="Ionicons"
                                iconName="bar-chart-outline"
                                color={color}
                                name="醫院地圖"
                                focused={focused}
                            />
                        )
                    }}
                />

                <Tab.Screen name="健康資訊" component={HealthInfoScreen}
                    options={{
                        title: '健康資訊',
                        headerShown: headerShown, // 隱藏Header
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                iconFamily="FontAwesome6"
                                iconName="laptop-medical"
                                color={color}
                                name="健康資訊"
                                focused={focused}
                            />
                        )
                    }}
                />

                <Tab.Screen name="設定" component={SettingsScreen}
                    options={{
                        title: '設定',
                        headerShown: headerShown, // 隱藏Header
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                iconFamily="AntDesign"
                                iconName="setting"
                                color={color}
                                name="設定"
                                focused={focused}
                            />
                        )
                    }}
                />
            </Tab.Navigator>
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