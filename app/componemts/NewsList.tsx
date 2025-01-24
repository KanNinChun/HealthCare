import { StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import ThemedText from './ThemedText'
import { ThemedView } from './ThemedView'
import { NewsDataType } from '../constants/news'
import { Link } from 'expo-router'

type Props = {
    newsList: Array<NewsDataType>
}

const NewsList = ({ newsList }: Props) => {
    return (
        <ThemedView>
            <ThemedText style={styles.container}></ThemedText>
            {newsList.map((item, index) => (
                <Link href={`../../news/${item.article_id}`} asChild key={index}>
                    <TouchableOpacity>
                        <ThemedView style={styles.itemContainer}>
                            <Image source={{ uri: item.image_url }} style={styles.itemImage} />
                            <ThemedView style={styles.itemInfo}>
                                <ThemedText style={styles.itemCategory}>{item.category}</ThemedText>
                                <ThemedText style={styles.itemTitle}>{item.title}</ThemedText>
                            </ThemedView>
                            <ThemedView style={styles.itemSourceInfo}>
                                <Image source={{ uri: item.source_icon }} style={styles.itemSourceImg} />
                                <ThemedText style={styles.itemSourceName}>{item.source_name}</ThemedText>
                            </ThemedView>
                        </ThemedView>
                    </TouchableOpacity>
                </Link>
            )
            )}
        </ThemedView>
    )
}

export default NewsList

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
    },
    itemContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 10,
    },
    itemInfo: {
        flex: 1,
        gap: 10,
        justifyContent: 'space-between',
    },
    itemCategory: {
        fontSize: 12,
        textTransform: 'capitalize',
    },
    itemTitle: {
        fontSize: 12,
        fontWeight: '600',
    },
    itemImage: {
        width: 90,
        height: 100,
        borderRadius: 20,
        marginRight: 10,
        resizeMode: 'stretch',
    },
    itemSourceInfo: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    itemSourceImg: {
        width: 20,
        height: 20,
        borderRadius: 20,
    },
    itemSourceName: {
        fontSize: 10,
        fontWeight: '400',
    },
})