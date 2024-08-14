import {
  useFocusEffect,
  useRoute,
  useNavigation,
} from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import { LinearGradient } from "expo-linear-gradient";
import MovieList from "../components/MovieList";
import Loading from "../components/Loading";
import { getAllFilmsByCategory } from "../services/FilmsListService";
import axios from "axios";
import { useAuth } from "../services/auth/AuthContext";

const { width, height } = Dimensions.get("window");
const ios = Platform.OS === "ios";
const topMargin = ios ? null : 12;

export default function MovieScreen() {
  const { params: { item, profileInfo } = {} } = useRoute();
  const navigation = useNavigation();
  const [isFavorite, setIsFavorite] = useState(false);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authState } = useAuth();
  const { id_token } = authState || {};

  // Fetch similar movies
  useEffect(() => {
    const getSimilarMovies = async () => {
      try {
        const movies = await getAllFilmsByCategory(
          item.fk_category || item.category_id
        );
        const filteredMovies = movies.filter(
          (movie) =>
            movie.film_id !== item.film_id && movie.film_id !== item.fk_film
        );
        setSimilarMovies(filteredMovies);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getSimilarMovies();
  }, [item.fk_film, item.fk_category, item.category_id]);

  const checkIfFavorite = async (fk_film, film_id) => {
    try {
      const response = await axios.get(
        `https://qhl0fcehdg.execute-api.us-east-1.amazonaws.com/Prod/favorites/${profileInfo.user_id}`,
        {
          headers: {
            Authorization: `Bearer ${id_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Extrae los fk_film de los objetos favoritos
      //const favorites = response.data.map(film => film.fk_film||film.film_id);

      let favorites = [];

      if (Array.isArray(response.data)) {
        favorites = response.data.map((film) => film.fk_film || film.film_id);
      } else {
      }

      const isFavorite =
        favorites.includes(fk_film) || favorites.includes(film_id);

      return isFavorite;
    } catch (error) {
      console.error("Error checking favorite status:", error);
      return false;
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchFavoriteStatus = async () => {
        const favoriteStatus = await checkIfFavorite(
          item.fk_film || item.film_id
        );
        setIsFavorite(favoriteStatus);
      };

      fetchFavoriteStatus();
    }, [item.fk_film, item.film_id, profileInfo.user_id, id_token])
  );

  const convertDuration = (duration) => {
    const hours = Math.floor(duration);
    const minutes = Math.round((duration - hours) * 100);
    return `${hours}h ${minutes}min`;
  };

  const handleToggleFavorite = async () => {
    try {
      const favoriteData = {
        fk_user: profileInfo.user_id,
        fk_film: item.fk_film || item.film_id,
      };

      if (isFavorite) {
        await axios.delete(
          `https://qhl0fcehdg.execute-api.us-east-1.amazonaws.com/Prod/favorite`,
          {
            data: favoriteData,
            headers: {
              Authorization: `Bearer ${id_token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setIsFavorite(false);
      } else {
        await axios.post(
          `https://qhl0fcehdg.execute-api.us-east-1.amazonaws.com/Prod/favorite`,
          favoriteData,
          {
            headers: {
              Authorization: `Bearer ${id_token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error managing favorite movie:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#262626" }}>
      <SafeAreaView
        style={{
          position: "absolute",
          zIndex: 20,
          width: width,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          marginTop: topMargin,
        }}
      >
        <TouchableOpacity
          style={{ borderRadius: 12, padding: 4, backgroundColor: "#eab308" }}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeftIcon size="20" strokeWidth={2.5} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleToggleFavorite}>
          <HeartIcon size="35" color={isFavorite ? "red" : "white"} />
        </TouchableOpacity>
      </SafeAreaView>
      {loading ? (
        <Loading />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={{ width: "100%", position: "relative" }}>
            <Image
              source={{ uri: item.front_page }}
              style={{ width: width, height: height * 0.45 }}
            />
            <LinearGradient
              colors={["transparent", "#262626"]}
              style={{
                width: width,
                height: height * 0.45,
                position: "absolute",
                bottom: 0,
              }}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
          </View>
          <View style={{ marginTop: -(height * 0.06) + 12 }}>
            <Text
              style={{
                color: "white",
                fontSize: 30,
                fontWeight: "bold",
                textAlign: "center",
                letterSpacing: 1.5,
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{
                color: "rgb(163,163,163)",
                fontWeight: "semibold",
                textAlign: "center",
                letterSpacing: 1.5,
                marginTop: 10,
              }}
            >
              {item.status === "Activo" ? "Activo" : "Inactivo"} -{" "}
              {convertDuration(item.length)}
            </Text>
            <Text
              style={{
                color: "rgb(163,163,163)",
                marginHorizontal: 16,
                letterSpacing: 0.4,
                textAlign: "center",
                marginTop: 20,
                fontSize: 16,
              }}
            >
              {item.description}
            </Text>

            <View style={{ alignItems: "center", marginTop: 20 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "white",
                  width: width * 0.8,
                  height: 40,
                  borderRadius: 9999,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() =>
                  navigation.navigate("VideoPlayer", { source: item.file })
                }
              >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  Reproducir Película
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <MovieList
            title="Películas Relacionadas"
            hideSeeAll={true}
            data={similarMovies || []}
            profileInfo={profileInfo}
          />
        </ScrollView>
      )}
    </View>
  );
}
