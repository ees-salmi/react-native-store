import {
  StyleSheet,
  Image,
  Text,
  TextInput,
  View,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { colors, network } from "../../constants";
import CustomInput from "../../components/CustomInput";
import header_logo from "../../assets/logo/logo.png";
import CustomButton from "../../components/CustomButton";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import LoginComponent from "../../components/LoginComponent/LoginComponent";
import ProgressDialog from "react-native-progress-dialog";
import InternetConnectionAlert from "react-native-internet-connection-alert";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import firebase from '@react-native-firebase/app';
import { TouchableOpacity } from 'react-native';

const LoginScreen = () => {
  // If null, no SMS has been sent
  const [confirm, setConfirm] = useState(null);

  // Verification code (OTP - One-Time-Passcode)
  const [code, setCode] = useState('');

  const [phoneNumber, setPhoneNumber] = useState('+212606060481');
  // Handle login
  const navigation = useNavigation();

  const signInWithPhoneNumber = async () => {
    try {
      console.log(phoneNumber);
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber, true);
      setConfirm(confirmation);
    } catch (error) {
      console.log("An error occurred", error);
    }
  };

  const confirmCode = async () => {
    try {
      const userCredential = await confirm.confirm(code);
      const user = userCredential.user;
      const userDocument = await firestore()
        .collection("user")
        .doc(user.uid)
        .get();
      if (userDocument.exists) {
        navigation.navigate("HomeScreen");
      } else {
        navigation.navigate("Dashboard");
      }
    } catch (error) {
      console.log('Invalid code.');
    }
  };

  return (
   
        <View>
          {
            !confirm ? (
              <>
                <Text style={{ textAlign: 'center', fontSize: 24, fontWeight: "bold" }}>
                  Enter phone
                </Text>

                <CustomInput
                  placeholder={"Enter phone here"}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
                <CustomButton onPress={signInWithPhoneNumber} text={"Send code"} />
              </>
            ) : (
              <>
                <Text>Enter code</Text>
                <TextInput
                  value={code}
                  onChangeText={setCode}
                  style={{ borderBottomWidth: 1, marginVertical: 10 }}
                />
                <TouchableOpacity onPress={confirmCode}>
                  <Text>Confirm</Text>
                </TouchableOpacity>
              </>
            )
          }
        </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
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
    // padding:15
  },
  formContainer: {
    flex: 3,
    justifyContent: "flex-start",
    alignItems: "center",
    display: "flex",
    width: "100%",
    flexDirection: "row",
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
    justifyContent: "flex-start",
    alignItems: "center",
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.muted,
  },
});
