import {
  StyleSheet,
  Text,
  View,
  Alert,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Pressable,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  Image
} from "react-native";
import React, { useState } from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { recoverPassword } from "../services/registerService";
import { useNavigation,useRoute } from "@react-navigation/native";
import validator from "validator";

export default function RecoverPassword() {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const navigation = useNavigation();
  const imageEye='../../assets/images/eyeWhite.png';
  const imageEyeClose ='../../assets/images/eye-slashWhite.png';
  const [hiddenPassword1, setHiddenPassword1] = useState(true);
  const [hiddenPassword2, setHiddenPassword2] = useState(true);
  const [confirmation_code, setConfirmation_code] = useState("");
  const [new_password, setNew_password] = useState("");
  const [confirm_password, setConfirm_password] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const email = route.params?.email;
  const [checkPassword, setCheckPassword] = useState(false);
  const options = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  };

  const callrecoverPassword =async()=>{
    try {
      setIsLoading(true);
      if(validator.isEmpty(confirmation_code) || validator.isEmpty(new_password) || validator.isEmpty(confirm_password)){
        Alert.alert('Error','Ingrese todos los datos solicitados')
      }else{
        if(validator.isStrongPassword(new_password,options)){
          setCheckPassword(false);
          if(new_password===confirm_password){
            const response = await recoverPassword(email,confirmation_code,new_password);
            if(response.status == 200){
              Alert.alert('Exito','Contraseña actualizada, ahora puede iniciar sesion con sus nuevos datos');
              navigation.replace('Login');
            }else if(response.status==400){
              Alert.alert('Error','Código de confirmación incorrecto');
            }
          }else{
            Alert.alert('Error','Las contraseñas no coinciden')
          }
        }else{
          setCheckPassword(true);
        }
      }
    } catch (error) {
    }finally{
      setIsLoading(false);
    }
  }

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
          <ScrollView>
            <View style={{ flex: 0.2, padding: 5 }}>
              <View style={styles.logoContainer}>
                <Text style={styles.logo}>
                  <Text style={{ color: "#00E7C7" }}>S</Text>
                  ISPE
                </Text>
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Cambio de Contraseña</Text>
              </View>
            </View>

            <View
              style={{
                flex: 2,
                justifyContent: "center",
                padding: 15,
                marginTop: 20,
              }}
            >
              <Text style={styles.label}>Codigo de verifiación</Text>
              <TextInput
                style={styles.inputStyle}
                placeholder="Ingrese el código de verifiación"
                placeholderTextColor="white"
                onChangeText={setConfirmation_code}
                value={confirmation_code}
              />
            </View>

            <Text style={[styles.label,{marginLeft:15,marginTop:15}]}>Nueva contraseña</Text>
            <View style={{flex:1,flexDirection:'row',borderRadius:5, borderColor:'white', borderWidth:1,marginHorizontal:15}}>
                <View style={{flex:6,justifyContent:'center'}}>
                  <TextInput
                    style={{color: "white",height: 50,paddingLeft: 10}}
                    placeholder="Ingrese la contraseña nueva"
                    placeholderTextColor="white"
                    value={new_password}
                    onChangeText={setNew_password}
                    secureTextEntry={hiddenPassword1}
                  />
                </View>
                <View style={{flex:1,justifyContent:'center'}}>
                  <Pressable
                    onPress={() => setHiddenPassword1(!hiddenPassword1)}
                  >
                    {hiddenPassword1?(
                      <Image source={require(imageEye)} style={{width:30, height:25}} />
                    ):(
                      <Image source={require(imageEyeClose)} style={{width:30, height:25}}/>
                    )}
                  </Pressable>
                </View>
              </View>
            <View style={{alignItems:'center',marginLeft:15,marginRight:15}}>
              {checkPassword?(
                <Text style={{marginBottom:10,marginTop:10, color:'#A20000', fontSize:13, fontWeight:'bold'}}>La contraseña debe contener al menos: 1 mayuscula, 1 minuscula, 1 numero, 1 caracter especial</Text>
              ):(
                ''
              )}
            </View>

            <Text style={[styles.label,{marginLeft:15,marginTop:30}]}>Confirmar contraseña</Text>
            <View style={{flex:1,flexDirection:'row',borderRadius:5, borderColor:'white', borderWidth:1,marginHorizontal:15}}>
                <View style={{flex:6,justifyContent:'center'}}>
                  <TextInput
                    style={{color: "white",height: 50,paddingLeft: 10}}
                    placeholder="Ingrese la contraseña nueva"
                    placeholderTextColor="white"
                    value={confirm_password}
                    onChangeText={setConfirm_password}
                    secureTextEntry={hiddenPassword2}
                  />
                </View>
                <View style={{flex:1,justifyContent:'center'}}>
                  <Pressable
                    onPress={() => setHiddenPassword2(!hiddenPassword2)}
                  >
                    {hiddenPassword2?(
                      <Image source={require(imageEye)} style={{width:30, height:25}} />
                    ):(
                      <Image source={require(imageEyeClose)} style={{width:30, height:25}}/>
                    )}
                  </Pressable>
                </View>
              </View>

            <View>
              <Pressable
                onPress={callrecoverPassword}
                style={styles.buttonContainer}
                disabled={isLoading}
              >
                {isLoading?(
                  <ActivityIndicator size='small' color='#fff'/>
                ):(
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Cambiar contraseña
                  </Text>
                )}
              </Pressable>
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
    marginTop: 50,
    backgroundColor: "#00B7C7",
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 80,
  },
});
