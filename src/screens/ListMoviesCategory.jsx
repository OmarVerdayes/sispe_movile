import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  Pressable,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

var { width, height } = Dimensions.get("window");

export default function ListMoviesCategory() {
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const numColumn = 2;
  const { title, data, profileInfo } = route.params || {};

  return (
    <SafeAreaProvider>
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <StatusBar style="light" />

        <View style={{ flex: 1 }}>
          {/* AQUI VA EL TITULO */}
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Pressable
                onPress={() => navigation.goBack()}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#eab308",
                  borderRadius: 120,
                  height: 35,
                  width: 35,
                }}
              >
                <ChevronLeftIcon strokeWidth={3} color={"white"} size={30} />
              </Pressable>
            </View>
            <View style={{ flex: 5 }}>
              <Text
                style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
              >
                {title}
              </Text>
            </View>
          </View>

          {/* CONTENIDO DE LAS PELICULAS */}
          <View style={{ flex: 6 }}>
            <FlatList
              data={data}
              renderItem={({ item }) => (
                <Pressable
                  style={{ marginHorizontal: 6, marginVertical: 10 }}
                  onPress={() => {
                    navigation.push("Movie", { item, profileInfo });
                  }}
                >
                  <Image
                    source={{ uri: item.front_page }}
                    style={{
                      width: width * 0.47,
                      height: height * 0.11,
                      borderRadius: 8,
                    }}
                  />
                  <View style={{ width: "70%", marginTop: 5 }}>
                    <Text style={{ color: "white" }}>{item.title}</Text>
                  </View>
                </Pressable>
              )}
              keyExtractor={(item, index) => item.film_id || index.toString()} 
              numColumns={numColumn}
            />
          </View>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#262626",
    flex: 1,
  },
});
