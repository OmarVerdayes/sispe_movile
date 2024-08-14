import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  Pressable,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView
} from "react-native";
import React, { useState } from "react";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import validator from "validator";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../services/auth/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [hiddenPassword, setHiddenPassword] = useState(true);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { onLogin } = useAuth();
  const imageEye = '../../assets/images/eyeWhite.png';
  const imageEyeClose = '../../assets/images/eye-slashWhite.png';

  const changeshow = () => {
    setHiddenPassword(!hiddenPassword);
  };

  const validateEmail = async () => {
    if (validator.isEmpty(email) || validator.isEmpty(password)) {
      Alert.alert("Error", "Por favor, llena todos los campos");
    } else {
      if (!validator.isEmail(email)) {
        Alert.alert("Error", "El correo electrónico es inválido");
      } else {
        setIsLoading(true);
        const result = await onLogin(email, password);
        setIsLoading(false);

        if (result && result.error) {
          Alert.alert("Error", "Usuario o contraseña incorrecta");
        } else {
          navigation.navigate("Home");
        }
      }
    }
  };

  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 0 : StatusBar.currentHeight}>
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <StatusBar style="light" />
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{ flex: 1 }}>
              <View style={styles.logoStyle}>
                <Text style={styles.logo}>
                  <Text style={{ color: "#00E7C7" }}>S</Text>
                  ISPE
                </Text>
              </View>
              <View style={styles.formStyle}>
                <View style={styles.inputsContainer}>
                  <Text style={styles.label}>Correo:</Text>
                  <View style={styles.inputWrapper}>
                    <View style={{ flex: 6, justifyContent: 'center' }}>
                      <TextInput
                        style={{ color: 'white', height: 25, paddingLeft: 10 }}
                        placeholder="Ingrese su correo electrónico"
                        placeholderTextColor="white"
                        keyboardType="email-address"
                        maxLength={256}
                        textContentType="emailAddress"
                        value={email}
                        onChangeText={setEmail}
                      />
                    </View>
                  </View>
                  <Text style={styles.label}>Contraseña:</Text>
                  <View style={styles.inputWrapper}>
                    <View style={{ flex: 6, justifyContent: 'center' }}>
                      <TextInput
                        style={{ color: "white", height: 25, paddingLeft: 10 }}
                        placeholder="Ingrese su contraseña"
                        placeholderTextColor="white"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={hiddenPassword}
                      />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      <Pressable onPress={changeshow}>
                        {hiddenPassword ? (
                          <Image source={require(imageEye)} style={{ width: 30, height: 25 }} />
                        ) : (
                          <Image source={require(imageEyeClose)} style={{ width: 30, height: 25 }} />
                        )}
                      </Pressable>
                    </View>
                  </View>
                </View>
                <View style={styles.buttonContainer}>
                  <Pressable
                    onPress={validateEmail}
                    disabled={isLoading}
                    style={({ pressed }) => [
                      {
                        backgroundColor: pressed ? "#0097C7" : "#00B7C7",
                        opacity: isLoading ? 0.5 : 1,
                      },
                      styles.pressable,
                    ]}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Text style={styles.text}>Iniciar sesión</Text>
                    )}
                  </Pressable>
                  <Pressable onPress={() => navigation.navigate("RecoverUser")} style={styles.pressable}>
                    {({ pressed }) => (
                      <Text style={[{ color: pressed ? "#0060B4" : "#008EE4", fontSize: 15 }]}>
                        Recuperar cuenta
                      </Text>
                    )}
                  </Pressable>
                </View>
                <View style={styles.viewButtonRegisterStyle}>
                  <Pressable style={styles.pressable} onPress={() => navigation.navigate("SignIn")}>
                    {({ pressed }) => (
                      <Text style={[{ color: pressed ? '#0070B4' : '#008EE4', fontSize: 15 }]}>Registrarse</Text>
                    )}
                  </Pressable>
                </View>
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
  logoStyle: {
    marginTop: 10,
    alignItems: "center",
    flex: 0.1,
  },
  formStyle: {
    flex: 1,
    padding: 15,
    justifyContent: "center",
    marginTop: 20,
  },
  logo: {
    color: "white",
    fontWeight: "bold",
    fontSize: 30,
    lineHeight: 50,
  },
  inputsContainer: {
    flex: 1,
  },
  label: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
  },
  inputs: {
    color: "white",
    height: 45,
    padding: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 5,
    marginVertical: 50,
  },
  buttonContainer: {
    flex: 4,
    marginVertical: 50,
  },
  pressable: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 12,
    margin: 10,
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  viewButtonRegisterStyle: {},
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 50,
    height: 45,
    alignItems: 'center',
  },
});
