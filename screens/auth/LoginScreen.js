import {
  StyleSheet,
  Image,
  Text,
  View,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { colors, network } from "../../constants";
import CustomInput from "../../components/CustomInput";
import header_logo from "../../assets/logo/logo.png";
import CustomButton from "../../components/CustomButton";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import LoginComponent from "../../components/LoginComponent/LoginComponent";
import ProgressDialog from "react-native-progress-dialog";
import InternetConnectionAlert from "react-native-internet-connection-alert";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import ArabicText from "../../components/ArabicText/ArabicText";

import { OtpInput } from "react-native-otp-entry";


const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmResult, setConfirmResult] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [otp, setOtp] = useState('');

  const verifyCode = async () => {
    setIsLoading(true);
    console.log(otp);
    try {
      const response = await axios.post('http://192.168.8.153:3000/verify-code', {
        phoneNumber: "+212606060481",
        code: otp,
      });
      setIsLoading(false);
      if (response.data.success) {
        //const user = { phoneNumber: phoneNumber, };
        //_storeData(user);
        navigation.navigate('confirmlocation');
      }
      
    } catch (error) {
      console.error('Error verifying code:', error);
      setIsLoading(false);
    }
  };


  const sendVerification = async () => {
    setIsVisible(true);
   /* setIsLoading(true);
    try {
      const response = await axios.post('http://192.168.8.153:3000/send-verification', {
        phoneNumber: "+212606060481",
      });
      setIsVisible(true);
      setIsLoading(false);
      console.log(response.data);
    } catch (error) {
      setIsLoading(false);
      console.error('Error sending verification:', error);
    }*/
  };

  // Method to store the authUser to async storage
  const _storeData = async (user) => {
    try {
      await AsyncStorage.setItem("authUser", JSON.stringify(user));
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

 

  return (
    <InternetConnectionAlert onChange={(connectionState) => {}}>
      <KeyboardAvoidingView
        style={styles.container}
      >
        <ScrollView style={{ flex: 1, width: "100%" }}>
          <ProgressDialog visible={isLoading} label={"دخول ..."} />
          <StatusBar></StatusBar>
          <View style={styles.welconeContainer}>
            <View>
            <ArabicText style={styles.welcomeText} fsize={28} fweight={50} text={'مرحبا بكم هوتة شوب'} />
              
              <Text style={styles.welcomeParagraph}>make your ecommerce easy</Text>
            </View>
            <View>
              <Image style={styles.logo} source={header_logo} />
            </View>
          </View>
          <View style={styles.screenNameContainer}>
          <ArabicText style={styles.screenNameText} fsize={28} fweight={80} text={'تسجيل الدخول'} />
          </View>
        { !isVisible && <View style={styles.phoneNumber}>
            <View style={styles.countryCodeInput}>
              <CustomInput value={"+212"}/>
            </View>
            <View style={styles.phoneNumberInput}>
              <CustomInput value={phoneNumber}
                 keyboardType='phone-pad'
                 setValue={setPhoneNumber} 
                 placeholder="661235679"
                 textAlign={'left'} />
            </View>
          </View>}
          { isVisible && (
            <OtpInput
              numberOfDigits={6}
              focusColor="green"
              focusStickBlinkingDuration={500}
            />
          )
          }
          {error ? <CustomAlert message={error} type="error" /> : null}
        </ScrollView>
        <View style={styles.buttomContainer}>
          { !isVisible && <CustomButton text={ <ArabicText fweight={700} fsize={24} text={"تأكيد"} /> } onPress={sendVerification} /> }
          { isVisible && <CustomButton text={ <ArabicText  fweight={700} fsize={26} text={"تأكيد"} /> } onPress={verifyCode}  />}
        </View>
        <View style={styles.bottomContainer}>
       { /* <Text onPress={() => navigation.navigate("signup")} style={styles.signupText}>تسجيل</Text>
        <ArabicText fsize={14} text={'انشاء حساب'} />*/}
          
        </View>
      </KeyboardAvoidingView>
    </InternetConnectionAlert>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    flex: 1,
  },
  welconeContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: "30%",
  },
  formContainer: {
    flex: 3,
    justifyContent: "flex-start",
    alignItems: "center",
    display: "flex",
    width: "100%",
    flexDirecion: "row",
    padding: 5,
  },
  logo: {
    resizeMode: "contain",
    width: 80,
  },
  welcomeText: {
    fontSize: 42,
    fontWeight: "bold",
    color: colors.muted,
  },
  welcomeParagraph: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.primary_shadow,
  },
  forgetPasswordContainer: {
    marginTop: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  ForgetText: {
    fontSize: 15,
    fontWeight: "600",
  },
  buttomContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  bottomContainer: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    marginLeft: 2,
    color: colors.primary,
    fontSize: 15,
    fontWeight: "600",
  },
  screenNameContainer: {
    marginTop: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "end",
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.muted,
  },
  phoneNumber: {
    flexDirection: "row",  
    width: "100%",         
    justifyContent: "left",  
    alignItems: "left", 
  },
  countryCodeInput: {
    marginRight : 5,
    width: 85,         
  },
  phoneNumberInput: {
    width: "70%",         
  },
});
