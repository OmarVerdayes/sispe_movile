import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

var { width, height } = Dimensions.get("window");

const MovieList = ({ title, data, hideSeeAll, profileInfo }) => {
  const navigation = useNavigation();
  const limitedData = data.slice(0, 5);

  return (
    <View style={{ marginTop: 20 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 16,
        }}
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
          {title}
        </Text>
        {!hideSeeAll && (
          <Pressable
            onPress={() => {
              navigation.navigate("ListMovies", {
                title: title,
                data: data,
                profileInfo,
              });
            }}
          >
            <Text style={{ color: "#eab308", fontSize: 16 }}>Ver más</Text>
          </Pressable>
        )}
      </View>
      <FlatList
        data={limitedData}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.push("Movie", { item, profileInfo })}
            style={{ marginLeft: 16, marginTop: 12 }}
          >
            <Image
              source={{ uri: item.front_page }}
              style={{
                width: width * 0.5,
                height: height * 0.1,
                borderRadius: 8,
              }}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
      />
    </View>
  );
};

export default MovieList;
