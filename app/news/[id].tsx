import { ActivityIndicator, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, Stack, router } from 'expo-router'
import { ThemedView } from '../componemts/ThemedView'
import ThemedText from '../componemts/ThemedText'
import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import { NewsDataType } from '../constants/news'

type Props = {}

const NewDetails = (props: Props) => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [News, setNews] = useState<NewsDataType[]>([]);

    useEffect(() => {
        getNews();
    }, []);

    const getNews = async () => {
        try {
            const apiUrl = `https://newsdata.io/api/1/news?apikey=${process.env.EXPO_PUBLIC_API_KEY}&id=${id}`;
            if (!apiUrl) {
                console.error('News API URL is not defined');
                return;
            }
            const respond = await axios.get(apiUrl);
            if (respond && respond.data) {

                setNews(respond.data.results);
                setIsLoading(false);
            }
        }
        catch (error: any) {
            console.error('Error fetching news (Maybe RateLimitExceeded):', error.message);
        }
    }

    return (
        <>
            <Stack.Screen
                options={{
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={22} color="#ff1900" />
                        </TouchableOpacity>
                    ),
                    title: '',
                }}
            />

            {isLoading ? (  //alert not finish because api issue
                <ThemedView style={styles.container}>
                    <ActivityIndicator size="large" color="#ff1900" />
                </ThemedView>

            ) : (
                <ThemedView style={styles.wrappper}>
                    <ThemedView style={styles.contentContainer}>
                    <ThemedText style={styles.title}>{News[0].title}</ThemedText>
                    <ThemedView style={styles.newsinfoWrapper}>
                        <ThemedText style={styles.newsinfo}>{News[0].pubDate}</ThemedText>
                        <ThemedText style={styles.newsinfo}>{News[0].source_name}</ThemedText>
                    </ThemedView>
                    <Image source = {{uri: News[0].image_url}} style={styles.newsImg} />
                    <ThemedText>{News[0].description}</ThemedText>
                    </ThemedView>
                </ThemedView>)

            }

        </>
    )
}

export default NewDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrappper: {
        flex: 1,
    },
    title:{
        fontSize: 16,
        fontWeight: '600',
        marginVertical: 10,
        letterSpacing: 0.6,
    },
    newsinfoWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    newsinfo: {
        fontSize: 12,
        color: '#89bcc4',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    newsImg: {
        width: '100%',
        height: 300,
        marginBottom: 20,
        borderRadius: 10,
    },
})