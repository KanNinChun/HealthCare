import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../componemts/screens/HomeScreen'; 
import SettingsScreen from '../componemts/screens/SettingsScreen';
import { useColorScheme} from '../hooks/useColorScheme';
import { ThemedView } from '../componemts/ThemedView';
import { ThemedText } from '../componemts/ThemedText';
import Ionicons from '@expo/vector-icons/Ionicons';



interface TabIconProps {
    icon: any;
    color: string;
    name: string;
    focused: boolean;
  }

const TabIcon : React.FC<TabIconProps> = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-2" style = {{height: 70,paddingTop: 40, width: 80}}>
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
    
       <Text className={`${focused ? 'font-psemibold' : 'font-pregular'}`} style={{color: color, fontSize: 13}}>
        {/*if focused use font-psemibold else font-pregular, and make the font size extra small when its not forcused*/}
        {name}
      </Text> 
    </View>
  )
}

const Tab = createBottomTabNavigator(); 

const TabsLayOut = () => { 
    const colorScheme = useColorScheme(); //獲取當前主題顏色
    const themeContainerStyle = colorScheme === 'light' ? styles.lightContainer : styles.darkContainer; //獲取當前主題顏色

    return ( 
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: true, // Hide labels
                tabBarActiveTintColor: '#FFA001', // 當Click左嘅顏色 //FFA001 orange
                tabBarInactiveTintColor: themeContainerStyle.color, // 當未Click時嘅顏色
                tabBarStyle: {
                    backgroundColor: themeContainerStyle.backgroundColor, // Background color of the navbar
                    borderTopWidth: 1,
                    borderColor: themeContainerStyle.color, // 一條灰色橫線[分隔線] '#232533'
                    height: 73,
                },
            }}
        > 
            <Tab.Screen name="Home" component={HomeScreen} 
                options={{
                    title: 'Home',
                    headerShown: false, // 隱藏Header
                }}
            /> 

            <Tab.Screen name="Settings" component={SettingsScreen} 
                  options={{
                    title: 'Settings',
                    headerShown: false, // 隱藏Header
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
    
});

export default TabsLayOut;