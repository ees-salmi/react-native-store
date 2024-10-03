import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, KeyboardAvoidingView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import CustomButton from '../../components/CustomButton';
import ProgressDialog from "react-native-progress-dialog";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebaseConfig from "../../config";
import ArabicText from "../../components/ArabicText/ArabicText";
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default function ConfirmLocation({ navigation, route }) {
  const { phoneNumber } = route.params;
  const [phone, setPhone] = useState(phoneNumber);
  const [location, setLocation] = useState(null);
  const [storedLocation, setStoredLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({});
  const auth = getAuth(app);

 /* useEffect(() => {
    console.log("Phone Number:", phoneNumber); // Debugging
  }, [phoneNumber]);*/

  const handleAuthentication = async () => {
    setIsLoading(true);
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        "weldsalem17@gmail.com",
        "Password@123"
      );
      const { latitude, longitude } = location.coords;
      const updatedUser = {
        ...userCredentials.user,
        phoneNumber: phoneNumber,
        location : {
          latitude : latitude,
          longitude : longitude
        }
      };
      if(phone){
        await AsyncStorage.setItem("phoneNumber", phone);
      }
      
      setUser(updatedUser); 

      console.log("User authenticated:", updatedUser);
      navigation.replace("homescreen", { authUser: updatedUser });
      _storeData(updatedUser);
      
    } catch (error) {
      console.error("Authentication error:", error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);



  // Function to handle storing the current location
  const storeCurrentLocation = async () => {
    const u = await AsyncStorage.getItem("authUser");
      console.log(u);
      //await handleAuthentication();
      //navigation.navigate("homescreen");
  };

  const _storeData = async (user) => {
    try {
      await AsyncStorage.setItem("authUser", JSON.stringify(user));
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ProgressDialog visible={isLoading} label={"دخول ..."} />
      <MapView
        style={styles.map}
        region={{
          latitude: location ? location.coords.latitude : 37.78825,
          longitude: location ? location.coords.longitude : -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Current Location"
          />
        )}
      </MapView>
      <CustomButton text="تأكيد الموقع" onPress={handleAuthentication} />
      {storedLocation && (
        <Text style={styles.locationText}>
          Stored Location: Latitude {storedLocation.coords.latitude}, Longitude {storedLocation.coords.longitude}
        </Text>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding : 10,
    margin : 10 ,
    borderColor : 'balck',
    borderWidth : 2,
    borderRadius : 4,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  locationText: {
    margin: 20,
    fontSize: 16,
  },
});
