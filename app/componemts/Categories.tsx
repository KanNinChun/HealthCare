import { StyleSheet, ScrollView, TouchableOpacity, View, TouchableOpacityProps } from 'react-native'
import React, { useRef, useState } from 'react'
import { ThemedView } from './ThemedView'
import ThemedText from './ThemedText'
import newsCategoryList from '../constants/Catergories'
import { Colors } from '../constants/Colors'

type Props = {
    onCategoriesChanged: (category: string) => void;
}
const Categories = ({onCategoriesChanged}: Props) => {
    const scrollRef = useRef<ScrollView>(null);
    const itemRef = useRef<TouchableOpacity[] | null>([]); // 無視Error
    const [activeIndex, setActiveIndex] = useState(0);
    
    const handleSelectCategory = (index: number) => {
        const selectedItem = itemRef.current[index];
        setActiveIndex(index);

        selectedItem?.measure((x: number) => {
            scrollRef.current?.scrollTo({x: x - 25, y: 0, animated: true});
        });
        onCategoriesChanged(newsCategoryList[index].slug);
    }

    return (
        <ThemedView>
            <ThemedText style={styles.title}>熱點新聞</ThemedText>
            <ScrollView
                ref={scrollRef}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.itemWrapper}>
                {newsCategoryList.map((item, index) => (
                    <TouchableOpacity
                        ref={(el) => (itemRef.current[index] = el)}
                        key={index}
                        style={activeIndex === index ? styles.itemActive : styles.item}
                        onPress={() => handleSelectCategory(index)}>
                        <ThemedText style={styles.itemText}>{item.title}</ThemedText>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </ThemedView>
    )
}

export default Categories

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    itemWrapper: {
        gap: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    item: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    itemActive: {
        backgroundColor: '#fa883c',
        borderColor: '#fa883c',
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    itemText: {
        fontSize: 14,
        letterSpacing: 0.5,
    },
})