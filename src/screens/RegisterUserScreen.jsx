import {
  StyleSheet,
  View,
  Text,
  Platform,
  TextInput,
  Alert,
  ScrollView,
  StatusBar,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import validator from "validator";
import { useNavigation } from "@react-navigation/native";
import { CardField } from "@stripe/stripe-react-native";
import { register } from "../services/registerService";

export default function RegisterUserScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [subscription, setSubscription] = useState(
    "3A62B7E2E2F1472EBE5C14EE01A960E8"
  );
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState(null);

  const validateEmail = () => validator.isEmail(email);

  const validateForm = async () => {
    if (
      validator.isEmpty(name) ||
      validator.isEmpty(lastname) ||
      validator.isEmpty(email)
    ) {
      Alert.alert("Error", "Por favor, llena todos los campos");
    } else {
      if (!validateEmail()) {
        Alert.alert("Error", "El correo electrónico es inválido");
      } else {
        await registerUser();
      }
    }
  };

  const registerUser = async () => {
    setLoading(true);
    try {
      const response = await register(name, lastname, email, subscription);
      if (response.status === 200 || response.data) {
        Alert.alert("Registro exitoso", response.data);
        navigation.navigate("ChangePasswordTemporary", { email: email });
      } else {
        Alert.alert(
          "Error",
          "Ha ocurrido un error, por favor intenta de nuevo"
        );
      }
    } catch (error) {
      if (error.response.status === 400) {
        Alert.alert("Error", error.response.data.error_message);
      } else {
        Alert.alert("Error", "Error al registrar el usuario");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={
          Platform.OS === "ios" ? 0 : StatusBar.currentHeight
        }
      >
        <View
          style={[
            styles.container,
            { paddingTop: insets.top, paddingBottom: insets.bottom },
          ]}
        >
          <StatusBar style="light" />
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{ flex: 0.2, padding: 5 }}>
              <View style={styles.logoContainer}>
                <Text style={styles.logo}>
                  <Text style={{ color: "#00E7C7" }}>S</Text>
                  ISPE
                </Text>
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Registrar cuenta</Text>
              </View>
            </View>

            <View style={{ flex: 2, padding: 15 }}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nombre:</Text>
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Ingrese su nombre"
                  placeholderTextColor="white"
                  onChangeText={setName}
                  value={name}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Apellido:</Text>
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Ingrese su primer apellido"
                  placeholderTextColor="white"
                  onChangeText={setLastname}
                  value={lastname}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Correo:</Text>
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Ingrese su correo electrónico"
                  placeholderTextColor="white"
                  onChangeText={setEmail}
                  value={email}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Número de tarjeta:</Text>
                <CardField
                  postalCodeEnabled={false}
                  placeholder={{ number: "4242 4242 4242 4242" }}
                  cardStyle={{
                    backgroundColor: "#FFFFFF",
                    textColor: "#000000",
                  }}
                  style={{ width: "100%", height: 50, marginVertical: 30 }}
                  onChange={(cardDetails) => setCardDetails(cardDetails)}
                />
              </View>
              <View style={{ flex: 1, marginVertical: 50 }}>
                <Pressable
                  style={styles.buttonContainer}
                  onPress={() => validateForm()}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text
                      style={{
                        color: "white",
                        fontSize: 15,
                        fontWeight: "bold",
                      }}
                    >
                      Registrarse
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#262626",
    flex: 1,
  },
  logoContainer: {
    marginTop: 10,
    alignItems: "center",
    flex: 0.1,
  },
  logo: {
    color: "white",
    fontWeight: "bold",
    fontSize: 30,
    lineHeight: 50,
  },
  titleContainer: {
    alignItems: "center",
    flex: 0.1,
    justifyContent: "center",
  },
  title: {
    padding: 10,
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
  },
  inputContainer: {
    margin: 5,
    flex: 0.1,
    marginVertical: 20,
  },
  inputStyle: {
    borderColor: "white",
    borderWidth: 1,
    height: 45,
    borderRadius: 5,
    padding: 10,
    color: "white",
  },
  label: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
  },
  buttonContainer: {
    backgroundColor: "#00B7C7",
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 100,
  },
});
