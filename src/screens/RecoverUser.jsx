import {
  StyleSheet,
  Alert,
  Text,
  View,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Pressable,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { recoverUser as recoverUserService } from "../services/registerService";
import validator from "validator";
import { useNavigation } from "@react-navigation/native";

export default function RecoverUser() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const callrecoverUser = async () => {
    try {
      setIsLoading(true);
      if (!validator.isEmpty(email)) {
        if (validator.isEmail(email)) {
          const response = await recoverUserService(email);
          if (response && response.data && response.status == 200) {
            navigation.navigate("RecoverPassword", { email: email });
            Alert.alert(
              "Exito",
              "Hemos enviado un correo con el codigo de verifiacion, revisa tu correo"
            );
          } else if (response.status == 400) {
            Alert.alert("Error", response.data.error_message);
          }
        } else {
          Alert.alert("Error", "Debe ingresar un correo valido");
        }
      } else {
        Alert.alert("Error", "Debe ingresar un correo");
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
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
                <Text style={styles.title}>Recuperar cuenta</Text>
              </View>
            </View>

            <View>
              <View style={{ flex: 1, justifyContent: "center", padding: 15 }}>
                <Text style={styles.label}>Correo electrónico</Text>
                <TextInput
                  style={styles.inputStyle}
                  placeholder="Ingrese su correo"
                  placeholderTextColor="white"
                  onChangeText={setEmail}
                  value={email}
                />
              </View>

              <View
                style={{ flex: 2, marginVertical: 50, marginHorizontal: 20 }}
              >
                <Pressable
                  onPress={callrecoverUser}
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed ? "#0097C7" : "#00B7C7",
                      opacity: isLoading ? 0.5 : 1,
                    },
                    styles.pressable,
                  ]}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="large" color="#fff" />
                  ) : (
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 15,
                      }}
                    >
                      Enviar
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
  },
  logo: {
    color: "white",
    fontWeight: "bold",
    fontSize: 30,
    lineHeight: 50,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    padding: 10,
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
  },
  label: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
  },
  inputStyle: {
    borderColor: "white",
    borderWidth: 1,
    height: 45,
    borderRadius: 5,
    padding: 10,
    color: "white",
  },
  buttonContainer: {
    backgroundColor: "#00B7C7",
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 100,
  },
  pressable: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 12,
    margin: 10,
  },
});
