import { View, Text, Dimensions, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { XMarkIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { useNavigation,useRoute } from "@react-navigation/native";
import Loading from "../components/Loading";
import { findMovieByName } from "../services/FilmsListService";

const { width, height } = Dimensions.get('window');

export default function SearchScreen() {
    const {
        params: { profileInfo } = {},
      } = useRoute();
    const navigation = useNavigation();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchInitiated, setSearchInitiated] = useState(false);


    const handleSearch = async () => {
        setIsSearching(true);
        setLoading(true);
        setSearchInitiated(true); 
        try{
            const movies = await findMovieByName(searchQuery);
            setResults(movies);
        }catch(error){
            console.error(error);
        }finally{
            setLoading(false);
        }
    };

    const handleIconPress = () => {
        if (searchQuery === '') {
            navigation.navigate("Home");
        } else if (isSearching) {
            setSearchQuery('');
            setIsSearching(false);
            setResults([]);
        } else {
            handleSearch();
        }
    };

    const convertDuration = (duration) => {
        const hours = Math.floor(duration);
        const minutes = Math.round((duration - hours) * 100);
        return `${hours}h ${minutes}min`;
    };

    return (
        <SafeAreaView style={{ backgroundColor: '#262626', flex: 1 }}>
            <View style={{ marginHorizontal: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#737373', borderRadius: 9999, marginTop: (height * 0.03) }}>
                <TextInput
                    placeholder="Buscar película"
                    placeholderTextColor={'lightgray'}
                    style={{ flex: 1, paddingBottom: 4, paddingLeft: 24, fontSize: 16, lineHeight: 24, fontWeight: '500', letterSpacing: 0.8, color: "white" }}
                    value={searchQuery}
                    onChangeText={text => {
                        setSearchQuery(text);
                        setIsSearching(false);
                    }}
                />
                <TouchableOpacity
                    onPress={handleIconPress}
                    style={{ borderRadius: 9999, padding: 12, margin: 4, backgroundColor: '#737373' }}
                >
                    {searchQuery === '' || isSearching ? (
                        <XMarkIcon size="25" color="white" />
                    ) : (
                        <MagnifyingGlassIcon size="20" color="white" />
                    )}
                </TouchableOpacity>
            </View>
            {loading ? (
                <Loading />
            ) : results.length > 0 ? (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 15, marginTop: 12 }}
                >
                    <Text style={{ color: 'white', fontWeight: '400', marginLeft: 4, marginBottom: 10 }}>
                        Resultados ({results.length})
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        {results.map((item, index) => {
                            return (
                                <TouchableOpacity key={index} onPress={() => navigation.push("Movie", {item,profileInfo})}
                                                  style={{ marginVertical: 10, flexDirection: 'row', alignItems: 'center', width: '100%' }}
                                >
                                    <Image style={{ borderRadius: 10, width: width * 0.3, height: height * 0.1 }}
                                           source={{uri: item.front_page}}
                                    />
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                                            {item.title}
                                        </Text>
                                        <Text style={{ color: 'white', fontSize: 14 }}>
                                            {convertDuration(item.length)}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </ScrollView>
            ) : searchInitiated ? (
                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <Image source={require('../../assets/images/notFound.png')}
                           style={{ height: 384, width: 384 }}
                    />
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 30, textAlign: 'center' }}>
                        No hay resultados para su búsqueda
                    </Text>
                </View>
            ) : null}
        </SafeAreaView>
    );
}
