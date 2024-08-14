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
  Image,
  KeyboardAvoidingView,
} from "react-native";

import React, { useEffect, useState } from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import validator from "validator";
import { useNavigation,useRoute } from "@react-navigation/native";
import { changePassword } from "../services/registerService";

export default function ChangePasswordTemporaryScreen() {

  const insets = useSafeAreaInsets();
  const route = useRoute();
  const navigation = useNavigation();
  const [temporary_password, setTemporary_password] = useState('');
  const [new_password, setNew_password] = useState('');
  const [confirm_password, setConfirm_password] = useState('');
  const email = route.params?.email;
  const [checkPassword, setCheckPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const imageEye='../../assets/images/eyeWhite.png';
  const imageEyeClose ='../../assets/images/eye-slashWhite.png';
  const [hiddenPassword1, setHiddenPassword1] = useState(true);
  const [hiddenPassword2, setHiddenPassword2] = useState(true);
  const [hiddenPassword3, setHiddenPassword3] = useState(true);

  const options = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
};

  const validateForm= async()=>{
    if(validPassword()){
      setIsLoading(true);
      try {
        const response = await changePassword(email,temporary_password,new_password);
        if(response.status==200){
          Alert.alert('Exito','Se ha cambiado tu contraseña correctamente, iniciar sesion con tu correo y tu nueva contraseña');
          navigation.replace('Login');
        }else{
          Alert.alert('Error',response.error_message);
        }
      } catch (error) {
      }
    }
  }

  const validPassword=()=>{
    if(new_password===confirm_password){
      if(validator.isStrongPassword(new_password,options)){
        setCheckPassword(false);
        return true;
      }else{
        setCheckPassword(true)
        return false;
      }
    }else{
      Alert.alert('Error','Las contraseñas no coinciden');
      return false;
    }
  }

  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 0 : StatusBar.currentHeight}>
      <View style={[styles.container,{paddingTop:insets.top, paddingBottom:insets.bottom}]}>
        <StatusBar style='light'/>
        <ScrollView style={styles.scrollView}>

          {/* LOGO SISPE */}
          <View style={styles.logoStyle}>
              <Text style={styles.logo}>
                <Text style={{ color: "#00E7C7" }}>S</Text>
                ISPE
              </Text>
              <Text style={styles.title}>Cambiar contraseña</Text>
          </View>

          {/* FORMULARIO */}
          <View style={styles.formStyle}>

            <View>
              <Text style={styles.label}>Contraseña temporal:</Text>

              <View style={{flexDirection:'row',flex:1,borderColor:'white',borderWidth:1, borderRadius:5}}>
                <View style={{flex:6,justifyContent:'center'}}>
                  <TextInput
                    style={{color:'white',height:50,paddingLeft:10}}
                    placeholder="Ingrese la contraseña temporal"
                    placeholderTextColor="white"
                    keyboardType="password"
                    maxLength={256}
                    textContentType="password"
                    value={temporary_password}
                    onChangeText={setTemporary_password}
                    secureTextEntry={hiddenPassword1}
                  />
                </View>
                <View style={{flex:1, justifyContent:'center'}}>
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
              
            </View>

            <View style={{marginVertical:30}}>
              <Text style={styles.label}>Contraseña nueva:</Text>
              <View style={{flex:1,flexDirection:'row',borderRadius:5, borderColor:'white', borderWidth:1}}>
                <View style={{flex:6,justifyContent:'center'}}>
                  <TextInput
                    style={{color: "white",height: 50,paddingLeft: 10}}
                    placeholder="Ingrese la contraseña nueva"
                    placeholderTextColor="white"
                    value={new_password}
                    onChangeText={setNew_password}
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
              {checkPassword?(
                    <Text style={{marginBottom:10,marginTop:10, color:'#A20000', fontSize:13, fontWeight:'bold'}}>La contraseña debe contener al menos: 1 mayuscula, 1 minuscula, 1 numero, 1 caracter especial</Text>
                  ):(
                    ''
                  )}
            </View>

            <View style={{ marginVertical: checkPassword ? -20 : 5 , marginBottom:50}}>
              <Text style={styles.label}>Confirmar contraseña:</Text>
              <View style={{flexDirection:'row', borderColor:'white', borderWidth:1,borderRadius:5}}>
                <View style={{flex:6}}>
                  <TextInput
                    style={{color:'white', height:50, paddingLeft:10}}
                    placeholder="Ingrese nuevamente su contraseña"
                    placeholderTextColor="white"
                    value={confirm_password}
                    onChangeText={setConfirm_password}
                    secureTextEntry={hiddenPassword3}
                  />
                </View>
                <View style={{flex:1, justifyContent:'center'}}>
                  <Pressable
                      onPress={() => setHiddenPassword3(!hiddenPassword3)}
                      >
                        {hiddenPassword3?(
                          <Image source={require(imageEye)} style={{width:30, height:25}} />
                        ):(
                          <Image source={require(imageEyeClose)} style={{width:30, height:25}}/>
                        )}
                    
                    </Pressable>
                </View>
              </View>
              
                
            </View>
                
          </View>

          <View style={{backgroundColor:'#00B7C7', padding:15, alignItems:'center',marginHorizontal:80, borderRadius:10}}>
            <Pressable
              onPress={()=>{
                validateForm()
              }}
              style={{}}
            >
              {isLoading?(
                <ActivityIndicator size="large" color="#fff" />
              ):(
                <Text style={styles.button}>Cambiar contraseña</Text>
              )}
              
            </Pressable>
          </View>
        </ScrollView>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  )
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
  logo: {
    color: "white",
    fontWeight: "bold",
    fontSize: 30,
    lineHeight: 50,
  },
  formStyle: {
    flex: 1,
    flexDirection:'column',
    padding: 15,
    justifyContent: "center",
    marginTop: 20,
  },
  label: {
    color: "white",
    //fontWeight: "bold",
    fontSize: 18 ,
    marginBottom: 5,
  },
  inputs: {
    color: "white",
    height: 45,
    padding: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 5,
    marginVertical: 30,
  },
  title:{
    color: "white",
    fontSize:25,
    marginTop:20,
    fontWeight:'bold'
  },
  button:{
    color:'white',
    fontSize:15,
    fontWeight:'bold'
  }
})