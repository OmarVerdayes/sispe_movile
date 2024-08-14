import React, { useState } from "react";
import {
  View,
  Text,
  Platform,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Input, Icon } from "react-native-elements";
import axios from "axios";
import Loading from "../components/Loading";

const ios = Platform.OS === "ios";
const { width, height } = Dimensions.get("window");

export default function UpdatePasswordScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { profileInfo } = route.params || {};

  const [newPassword, setNewPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);

  const handleCancel = () => {
    navigation.navigate("Profile");
  };

  const handleUpdatePassword = async () => {
    if (!profileInfo.email || !confirmationCode || !newPassword) {
      Alert.alert("Error", "Por favor, complete todos los campos.");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert("Error", "La contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      Alert.alert("Error", "La contraseña debe tener al menos una mayúscula");
      return;
    }

    if (!/\d/.test(newPassword)) {
      Alert.alert("Error", "La contraseña debe tener al menos un número");
      return;
    }

    if (!/[!@#$%^&*()_+\-=\]{};':"\\|,.<>?]/.test(newPassword)) {
      Alert.alert(
        "Error",
        "La contraseña debe tener al menos un caracter especial"
      );
      return;
    }
    const forbiddenChars = /[;()\-%\\]/;
    if (forbiddenChars.test(newPassword)) {
      Alert.alert(
        "Error",
        "La contraseña contiene caracteres no permitidos: ;, --, (), \\, % intente con otro"
      );
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://lhgkaf7rki.execute-api.us-east-1.amazonaws.com/Prod/user/recover_password",
        {
          email: profileInfo.email,
          confirmation_code: confirmationCode,
          new_password: newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      Alert.alert("Éxito", "Tu contraseña ha sido actualizada.");
      navigation.navigate("Login");
    } catch (error) {
      console.error(
        "Error al actualizar la contraseña:",
        error.response ? error.response.data : error.message
      );
      if (
        error.response &&
        error.response.data.error_message ===
          "Invalid verification code provided, please try again."
      ) {
        Alert.alert(
          "Error",
          "El código de confirmación es incorrecto, verifique el codigo enviado a su email."
        );
      } else {
        Alert.alert("Error", "Hubo un problema al actualizar la contraseña.");
      }
    } finally {
      setLoading(false);
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
          <Text></Text>

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

          <Text></Text>
        </View>
      </SafeAreaView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 40,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 24 }}>
              Actualiza tu contraseña
            </Text>

            <View style={{ marginTop: 20, width: width * 0.8 }}>
              <Input
                placeholder="Código de Confirmación"
                inputContainerStyle={{
                  backgroundColor: "white",
                  padding: 5,
                  borderRadius: 5,
                  marginBottom: 10,
                }}
                value={confirmationCode}
                onChangeText={(text) => setConfirmationCode(text)}
              />
              <Input
                placeholder="Nueva Contraseña"
                inputContainerStyle={{
                  backgroundColor: "white",
                  padding: 5,
                  borderRadius: 5,
                }}
                secureTextEntry={hidePassword}
                value={newPassword}
                onChangeText={(text) => setNewPassword(text)}
                rightIcon={
                  <Icon
                    type="material-community"
                    name={hidePassword ? "eye-off" : "eye"}
                    onPress={() => setHidePassword(!hidePassword)}
                  />
                }
              />
              <TouchableOpacity
                style={{
                  backgroundColor: "#A98B00",
                  paddingVertical: 10,
                  borderRadius: 5,
                  marginVertical: 10,
                  marginLeft: 10,
                  marginRight: 10,
                  alignItems: "center",
                }}
                onPress={handleUpdatePassword}
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
                    <Text>Actualizar Contraseña</Text>
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <TouchableOpacity
          style={{
            backgroundColor: "red",
            paddingVertical: 10,
            borderRadius: 5,
            marginTop: 20,
            marginBottom: 20,
            width: width * 0.3,
            alignItems: "center",
          }}
          onPress={handleCancel}
        >
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Cancelar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
