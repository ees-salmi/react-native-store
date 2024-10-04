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
  import ProgressDialog from "react-native-progress-dialog";
  import InternetConnectionAlert from "react-native-internet-connection-alert";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  // Import the functions you need from the SDKs you need
  import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
  import { initializeApp } from "firebase/app";
  import firebaseConfig from "../../config";
  import ArabicText from "../../components/ArabicText/ArabicText";
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  
  const AdminLogin = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);
  
    const auth = getAuth(app);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        if (user) {
          _storeData(user);
          navigation.replace("tab", { user: user }); // Navigate to User Dashboard
        }
      });
  
      return () => unsubscribe();
    }, []);
  
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
      setIsLoading(true);
      //[check validation] -- Start
      if (email === "") {
        setIsLoading(false);
        return setError("Please enter your email");
      }
      if (password === "") {
        setIsLoading(false);
        return setError("Please enter your password");
      }
      if (!email.includes("@")) {
        setIsLoading(false);
        return setError("Email is not valid");
      }
      if (email.length < 6) {
        setIsLoading(false);
        return setError("Email is too short");
      }
      if (password.length < 6) {
        setIsLoading(false);
        return setError("Password must be 6 characters long");
      }
      //[check validation] -- End
  
      try {
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
        setUser(userCredentials.user);
        console.log("User signed in successfully!",userCredentials.user);
        _storeData(userCredentials.user);
        console.log(userCredentials.user);
       if(userCredentials.user.email === "elmustaphaes.salmi@gmail.com"){
          navigation.replace("dashboard", { authUser: userCredentials.user });
        }
        else {
          navigation.replace("homescreen", { authUser: userCredentials.user });
        }
        
      } catch (error) {
        console.error("Authentication error:", error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
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
            <CustomInput value={email} setValue={setEmail} placeholder="البريد الالكتروني" />
            <CustomInput value={password} setValue={setPassword} placeholder="كلمة المرور" secureTextEntry />
            {error ? <CustomAlert message={error} type="error" /> : null}
          </ScrollView>
          <View style={styles.buttomContainer}>
            <CustomButton text={ <ArabicText fsize={20} text={'دخول'} /> } onPress={handleAuthentication} />
          </View>
          <View style={styles.bottomContainer}>
          <Text onPress={() => navigation.navigate("signup")} style={styles.signupText}>تسجيل</Text>
          <ArabicText fsize={14} text={'انشاء حساب'} />
            
          </View>
        </KeyboardAvoidingView>
      </InternetConnectionAlert>
    );
  };
  
  export default AdminLogin;
  
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