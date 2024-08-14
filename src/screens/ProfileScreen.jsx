import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Platform,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import Loading from "../components/Loading";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { HomeIcon } from "react-native-heroicons/outline";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Avatar } from "react-native-elements";
import axios from "axios";
import { useAuth } from "../services/auth/AuthContext";
import FavoriteMovies from "../components/FavoriteMovies";
import { useAvatar } from "../context/AvatarContext";
import { getAllFilmsByCategory } from "../services/FilmsListService";

const ios = Platform.OS === "ios";
const { width, height } = Dimensions.get("window");

export default function ProfileScreen() {
  const { selectedAvatar, setSelectedAvatar, avatarImages } = useAvatar();
  const [profileInfo, setProfileInfo] = useState({
    user_id: "",
    name: "",
    lastname: "",
    email: "",
    password: "",
    fk_rol: "",
    fk_subscription: "",
  });
  const [hidePassword, setHidePassword] = useState(true);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const { authState, onLogout } = useAuth();
  const { id_token, email } = authState;
  const navigation = useNavigation();

  const fetchProfileInfo = useCallback(async () => {
    if (email && id_token) {
      setLoading(true); // Inicia el loading
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
  }, [email, id_token]);

  const fetchFavoriteMovies = useCallback(async () => {
    if (profileInfo.user_id) {
      setLoading(true);
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

        let favorites = response.data;

        if (!Array.isArray(favorites)) {
          favorites = [];
        }
        setFavoriteMovies(favorites);

        const categoriesResponse = await axios.get(
          "https://vu2ps1ry7c.execute-api.us-east-1.amazonaws.com/Prod/category",
          {
            headers: {
              Authorization: `Bearer ${id_token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const categories = categoriesResponse.data;

        const categoryMap = categories.reduce((map, category) => {
          map[category.name] = category.category_id;
          return map;
        }, {});

        const favoriteMoviesWithCategoryId = favorites.map((movie) => ({
          ...movie,
          category_id: categoryMap[movie.category_name] || null,
        }));

        setFavoriteMovies(favoriteMoviesWithCategoryId);
      } catch (error) {
        console.error("Error al obtener las películas favoritas:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [profileInfo.user_id, id_token]);

  useFocusEffect(
    useCallback(() => {
      fetchProfileInfo();
      fetchFavoriteMovies();
    }, [fetchProfileInfo, fetchFavoriteMovies])
  );

  const handleLogout = async () => {
    await onLogout();
    navigation.navigate("Login");
  };

  const confirmUpdate = () => {
    Alert.alert(
      "Confirmar",
      "¿Estás seguro de que deseas actualizar la contraseña?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sí, actualizar",
          onPress: async () => {
            await updatePassword1();
            Alert.alert(
              "Éxito",
              "Se ha enviado un código a tu correo. Por favor, revisa tu correo.",
              [
                {
                  text: "OK",
                  onPress: () => {
                    navigation.navigate("UpdatePassword", { profileInfo });
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const updatePassword1 = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://lhgkaf7rki.execute-api.us-east-1.amazonaws.com/Prod/user/recover_password",
        profileInfo,
        {
          headers: {
            Authorization: `Bearer ${id_token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error al actualizar la información del usuario:", error);
    } finally {
      setLoading(false); // Detiene el loading
    }
  };

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
          <HomeIcon
            size="30"
            strokeWidth={2}
            color="white"
            onPress={() => navigation.navigate("Home", { profileInfo })}
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

      <View style={{ alignItems: "center", paddingHorizontal: 16 }}>
        <Avatar
          rounded
          backgroundColor="white"
          size="xlarge"
          source={selectedAvatar}
          containerStyle={{ marginBottom: 20 }}
        />
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {avatarImages.map((image, index) => (
              <TouchableOpacity
                key={index}
                style={{ margin: 10 }}
                onPress={() => setSelectedAvatar(image)}
              >
                <Avatar
                  rounded
                  size="small"
                  source={image}
                  containerStyle={{
                    borderWidth: selectedAvatar === image ? 2 : 0,
                    borderColor: "#facc15",
                  }}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 24 }}>
          {profileInfo.name} {profileInfo.lastname}
        </Text>

        <Text style={{ color: "gray", fontSize: 16, marginTop: 5 }}>
          {profileInfo.email}
        </Text>

        <View style={{ marginTop: 20, width: width * 0.8 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#A98B00",
              paddingVertical: 10,
              borderRadius: 5,
              marginVertical: 10,
              alignItems: "center",
            }}
            onPress={confirmUpdate}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                "Actualizar contraseña"
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 16 }}>
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <FavoriteMovies data={favoriteMovies} profileInfo={profileInfo} />
          )}
        </View>
      </ScrollView>

      <View style={{ alignItems: "center", paddingBottom: 20 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "red",
            paddingVertical: 10,
            borderRadius: 5,
            marginTop: 20,
            width: width * 0.3,
            alignItems: "center",
          }}
          onPress={handleLogout}
        >
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Cerrar sesión
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
