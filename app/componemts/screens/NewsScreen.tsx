import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { ThemedView } from '../ThemedView'
import ThemedText from '../ThemedText'
import { NewsDataType } from '@/app/constants/news'
import SliderItem from './SliderItem'
import Animated, { useAnimatedRef, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

//https://newsdata.io/
type Props = {
  newsList: Array<NewsDataType>
}

const  NewsScreen = ({newsList}: Props) => {
  const [data, setData] = useState(newsList);
 const[paginationIndex, setPaginationIndex] = useState(0);
 const scrollX = useSharedValue(0);
 const ref = useAnimatedRef<Animated.FlatList<any>>();

 const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  return (
   <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>新聞</ThemedText>
      <ThemedView style={styles.slideWrapper}>
        <Animated.FlatList
        ref={ref} 
        data={data} 
        keyExtractor={(_, index) => `list_item${index}`}
        renderItem={({item, index}) =>(
          <SliderItem sliderItem={item} index={index} scrollX={scrollX} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={onScrollHandler}
        scrollEventThrottle={16}/>
      </ThemedView>
   </ThemedView>
  )
}
export default NewsScreen

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 20
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    marginLeft: 20,
  },
  slideWrapper: {
    justifyContent: 'center',
  }
})