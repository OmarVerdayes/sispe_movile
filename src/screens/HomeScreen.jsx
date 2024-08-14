import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Bars3CenterLeftIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import TrendingMovies from "../components/TrendingMovies";
import MovieList from "../components/MovieList";
import { useNavigation } from "@react-navigation/native";
import Loading from "../components/Loading";
import {
  fetchingTrendingMovies,
  getFilmsByCategory,
} from "../services/FilmsListService";
import { Avatar } from "react-native-elements";
import { useAvatar } from "../context/AvatarContext";
import { useAuth } from "../services/auth/AuthContext";
import axios from "axios";

const ios = Platform.OS === "ios";
const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const [profileInfo, setProfileInfo] = useState({
    user_id: "",
    name: "",
    lastname: "",
    email: "",
    password: "",
    fk_rol: "",
    fk_subscription: "",
  });
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moviesByCategory, setMoviesByCategory] = useState({});
  const { selectedAvatar } = useAvatar();
  const { authState } = useAuth();
  const { id_token, email } = authState;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfileInfo = async () => {
      if (email && id_token) {
        try {
          const response = await axios.get(
            `https://lhgkaf7rki.execute-api.us-east-1.amazonaws.com/Prod/user/${email}`,
            {
              headers: {
                Authorization: `Bearer ${id_token}`,
                "Content-Type": "application/json",
              },
            }
          );
          const user = response.data.user;

          if (user) {
            setProfileInfo({
              user_id: user.user_id,
              name: user.name,
              lastname: user.lastname,
              email: user.email,
              password: user.password,
              fk_rol: user.fk_rol,
              fk_subscription: user.fk_subscription,
            });
          }
        } catch (error) {
          console.error("Error al obtener la información del perfil:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    const getTrendingMovies = async () => {
      try {
        const movies = await fetchingTrendingMovies();
        setTrending(movies);
      } catch (error) {
        console.error("Error al obtener las películas en tendencia");
      }
    };

    const getCategorizedFilms = async () => {
      try {
        const movies = await getFilmsByCategory();
        setMoviesByCategory(movies);
      } catch (error) {
        console.error("Error al obtener las películas por categoría");
      }
    };

    setLoading(true);
    fetchProfileInfo();
    getTrendingMovies();
    getCategorizedFilms().finally(() => setLoading(false));
  }, [email, id_token]);

  return (
    <View style={{ flex: 1, backgroundColor: "#262626" }}>
      <SafeAreaView
        style={{ marginBottom: ios ? -8 : 12, marginTop: height * 0.03 }}
      >
        <StatusBar style="light" />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginHorizontal: 16,
          }}
        >
          <Avatar
            onPress={() => navigation.navigate("Profile")}
            rounded
            size="small"
            source={selectedAvatar}
            containerStyle={{ marginHorizontal: 10 }}
          />
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 30,
              lineHeight: 36,
            }}
          >
            <Text style={{ color: "#eab308" }}>S</Text>
            ISPE
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Search", { profileInfo })}
          >
            <MagnifyingGlassIcon size="30" strokeWidth={2} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {loading ? (
        <Loading />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          <TrendingMovies data={trending} profileInfo={profileInfo} />
          {Object.keys(moviesByCategory).map((category, index) => (
            <MovieList
              key={index}
              title={category}
              data={moviesByCategory[category]}
              profileInfo={profileInfo}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
