import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { AntDesign, Ionicons, Entypo, MaterialIcons,FontAwesome} from '@expo/vector-icons';
type IconFamily = 'AntDesign' | 'Ionicons' | 'Entypo' | 'MaterialIcons' | 'FontAwesome'

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
};

const TabIcon : React.FC<TabIconProps> = ({ iconFamily, iconName, color, name, focused }) => {
    const IconComponent = IconMap[iconFamily];
    const textStyle = focused ? styles.focusedText : styles.unfocusedText;

  return (
    <View className="items-center justify-center gap-2" style = {{height: 70, paddingTop:37 , width: 80}}>
        {IconComponent && <IconComponent name={iconName} size={24} color={color} />}
        <Text style={[textStyle, { color }]}>

        {/*if focused use font-psemibold else font-pregular, and make the font size extra small when its not forcused*/}
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
