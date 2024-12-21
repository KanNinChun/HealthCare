import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { AntDesign, Ionicons, Entypo, MaterialIcons, FontAwesome, FontAwesome6} from '@expo/vector-icons';

type IconFamily = 'AntDesign' | 'Ionicons' | 'Entypo' | 'MaterialIcons' | 'FontAwesome' | 'FontAwesome6'

interface TabIconProps {
    iconFamily: IconFamily
    iconName: any;
    color: string;
    name: string;
    focused: boolean;
  }

const IconMap = { 
    AntDesign, 
    Ionicons, 
    Entypo, 
    MaterialIcons,
    FontAwesome,
    FontAwesome6,
};

const TabIcon : React.FC<TabIconProps> = ({ iconFamily, iconName, color, name, focused }) => {
    const IconComponent = IconMap[iconFamily];
    const textStyle = focused ? styles.focusedText : styles.unfocusedText;

  return (
    <View className="items-center justify-center gap-1" style = {{height: 70 ,paddingBottom: 20 ,width: 80}} > 
        {IconComponent && <IconComponent name={iconName} size={24} color={color} />}

        <Text style={[textStyle, { color }]}>
        {name}
        
      </Text> 
    </View>
  )
}

// Define styles using StyleSheet
const styles = StyleSheet.create({

    focusedText: {
        fontWeight: '600', // semi bold
        fontSize: 13, // normal size for focused
    },
    unfocusedText: {
        fontWeight: 'normal', // or use a specific font family if required
        fontSize: 12, // smaller size for unfocused
    }
});

export default TabIcon;
