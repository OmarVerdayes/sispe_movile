import React from "react";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const convertDuration = (duration) => {
  const hours = Math.floor(duration);
  const minutes = Math.round((duration - hours) * 100);
  return `${hours}h ${minutes}min`;
};

const FavoriteMovies = ({ data, profileInfo }) => {
  const safeData = Array.isArray(data) ? data : [];
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ backgroundColor: "#262626", flex: 1 }}>
      <View style={{ marginHorizontal: 16, marginBottom: 12, marginTop: 20 }}>
        <Text
          style={{
            color: "white",
            fontSize: 20,
            textAlign: "center",
            marginBottom: 10,
            fontWeight: "bold",
          }}
        >
          Películas favoritas
        </Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15, marginTop: 12 }}
        >
          {safeData.length > 0 ? (
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "semibold",
                  marginLeft: 4,
                  marginBottom: 10,
                }}
              >
                Resultados ({safeData.length})
              </Text>
              {safeData.map((movie) => (
                <TouchableOpacity
                  key={movie.fk_film}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: 10,
                    width: "100%",
                  }}
                  onPress={() => {
                    navigation.navigate("Movie", { item: movie, profileInfo });
                  }}
                >
                  <Image
                    source={{ uri: movie.front_page }}
                    style={{
                      borderRadius: 10,
                      width: width * 0.3,
                      height: height * 0.1,
                    }}
                    resizeMode="cover"
                  />
                  <View style={{ marginLeft: 10 }}>
                    <Text
                      style={{
                        color: "white",
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      {movie.title}
                    </Text>
                    <Text
                      style={{ color: "white", fontSize: 14, marginTop: 10 }}
                    >
                      {convertDuration(movie.length)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                Lo siento, no tienes películas favoritas.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default FavoriteMovies;
