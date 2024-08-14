import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Dimensions, View, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TrendingMovies = ({ data, profileInfo }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);
    const navigation = useNavigation();

    const handleClick = (item) => {

        navigation.navigate('Movie', { item, profileInfo });
    }

    const autoRotate = () => {
        const nextIndex = (currentIndex + 1) % data.length;

        if (nextIndex >= 0 && nextIndex < data.length) {
            const nextItemOffset = Dimensions.get('window').width * nextIndex;
            flatListRef?.current?.scrollToOffset({
                animated: true,
                offset: nextItemOffset,
            });
            setCurrentIndex(nextIndex);
        } else {
            setCurrentIndex(0);
        }
    };

    useEffect(() => {
        const interval = setInterval(autoRotate, 4000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    const renderItems = ({ item }) => (
        <View style={styles.carouselItem}>
            <TouchableWithoutFeedback onPress={() => handleClick(item)}>
                <Image
                    source={{uri: item.front_page}}
                    style={styles.image}
                />
            </TouchableWithoutFeedback>
        </View>
    );

    return (
        <View style={{ marginBottom: 32 }}>
            <FlatList
                ref={flatListRef}
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItems}
                contentContainerStyle={styles.flatListContainer}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled={true}
                snapToInterval={Dimensions.get('window').width}
                decelerationRate="fast"
                getItemLayout={(data, index) => (
                    { length: Dimensions.get('window').width, offset: Dimensions.get('window').width * index, index }
                )}
                initialScrollIndex={0}
                onScrollToIndexFailed={(info) => {
                    const wait = new Promise(resolve => setTimeout(resolve, 500));
                    wait.then(() => {
                        flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
                    });
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    flatListContainer: {
        alignItems: 'center',
    },
    carouselItem: {
        width: Dimensions.get('window').width,
        alignItems: 'center',
    },
    image: {
        width: Dimensions.get('window').width - 20,
        height: 200,
        resizeMode: 'cover',
    },
});

export default TrendingMovies;
