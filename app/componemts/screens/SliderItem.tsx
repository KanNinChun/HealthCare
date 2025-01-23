import { Dimensions, StyleSheet, Image, Share, View } from 'react-native'
import React from 'react'
import { NewsDataType } from '@/app/constants/news'
import { ThemedView } from '../ThemedView'
import ThemedText from '../ThemedText'
import { SharedValue } from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
type Props = {
    sliderItem: NewsDataType,
    index: number
    scrollX: SharedValue<number>
}

const { width } = Dimensions.get('screen')
const SliderItem = ({ sliderItem, index, scrollX }: Props) => {
    return (
        <ThemedView style={styles.itemWrapper}>
            <Image source={{ uri: sliderItem.image_url }} style={styles.image} />
            <LinearGradient colors={["transparent", "rgba(0,0,0,0.4)"]} style={styles.background}>
                <View style={styles.sourceInfo}>

                    {sliderItem.source_icon && (
                        <Image source={{ uri: sliderItem.source_icon }} style={styles.sourceIcon} />
                    )}
                    <ThemedText>{sliderItem.source_name}</ThemedText>
                </View>

                <ThemedText style={styles.content}
                        numberOfLines={3} // 限制文本顯示行數
                        ellipsizeMode='tail' // 超出部分顯示省略號
                        adjustsFontSizeToFit //自動調整字體大小以便填滿寬度
                    >{sliderItem.title}
                    </ThemedText>
            </LinearGradient>

        </ThemedView>
    )
}

export default SliderItem

const styles = StyleSheet.create({
    itemWrapper: {
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5,
    },
    content: {
        marginTop: 10, 
        fontSize: 14, 
        alignItems: 'center',
    },

    image: {
        width: width - 30,
        justifyContent: 'center',
        alignItems: 'center',
        height: 180,
        borderRadius: 20,
        borderColor: 'white',
        borderWidth: 1,
        paddingRight: 5,
    },
    background: {
        position: 'absolute',
        left: 20,
        right: 0,
        top: 0,
        width: width - 40,
        height: 180,
        borderRadius: 20,
        padding: 20,
    },
    sourceIcon: {
        width: 25,
        height: 25,
        borderRadius: 20,
    },
    sourceInfo:{
        flexDirection: 'row',
        position: 'absolute',
        top:120,
        paddingHorizontal: 20,
        gap: 10,
    }
})