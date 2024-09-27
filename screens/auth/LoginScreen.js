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

import ArabicText from "../../components/ArabicText/ArabicText";
import auth from '@react-native-firebase/auth';


const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmResult, setConfirmResult] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isVisible, setIsVisible] = useState(false);



  // Method to store the authUser to async storage
  const _storeData = async (user) => {
    try {
      await AsyncStorage.setItem("authUser", JSON.stringify(user));
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  const handleAuthentication = async () => {
    console.log("clicked here ");
    setIsLoading(true);
    if (phoneNumber === "") {
      setIsLoading(false);
      return setError("Please enter your phone");
    }

    try {
      console.log("inside try ");
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirmResult(confirmation);
      setIsVisible(true); // Show verification code input
      
    } catch (error) {
      console.log("inside catch ",error);
    } finally {
      console.log("finnaly");
      setIsLoading(false);
    }
  };

  const confirmCode = async () => {
    if (verificationCode === "") {
      return setError("Please enter the verification code");
    }
    try {
      await confirmResult.confirm(verificationCode);
      Alert.alert("Phone number verified!");
      navigation.replace("tab"); // Navigate to User Dashboard
    } catch (error) {
      Alert.alert('Invalid code:', error.message);
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
          <CustomInput value={phoneNumber} setValue={setPhoneNumber} placeholder="رقم الهاتف" />
          {isVisible && (
            <CustomInput
              value={verificationCode}
              setValue={setVerificationCode}
              placeholder="كلمة المرور"
            />
          )}
          {error ? <CustomAlert message={error} type="error" /> : null}
        </ScrollView>
        <View style={styles.buttomContainer}>
          <CustomButton text={"Send Code"} onPress={handleAuthentication} />
          {isVisible && <CustomButton text={"Confirm Code"} onPress={confirmCode} />}
        </View>
        <View style={styles.bottomContainer}>
        <Text onPress={() => navigation.navigate("signup")} style={styles.signupText}>تسجيل</Text>
        <ArabicText fsize={14} text={'انشاء حساب'} />
          
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
});
