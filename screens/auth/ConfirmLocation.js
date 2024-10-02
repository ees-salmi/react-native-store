import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, KeyboardAvoidingView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import CustomButton from '../../components/CustomButton';

export default function App({navigation}) {
  const [location, setLocation] = useState(null);
  const [storedLocation, setStoredLocation] = useState(null);

  const handleAuthentication = async () => {
    setIsLoading(true);
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, "weldsalem17@gmail.com", "Password@123");
      setUser(userCredentials.user);
      console.log("User signed in successfully!",userCredentials.user);
      _storeData(userCredentials.user);
      console.log(userCredentials.user);
     if(userCredentials.user.email === "weldsalem17@gmail.com"){
      navigation.replace("homescreen", { authUser: userCredentials.user });
      }
  
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
  const storeCurrentLocation = () => {
    /*if (location) {
      setStoredLocation(location);
      Alert.alert('Location Stored', `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`);
    } else {
      Alert.alert('Location not available', 'Please try again later.');
    }*/
      navigation.navigate("homescreen");
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
    
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
      <CustomButton text="تأكيد الموقع" onPress={storeCurrentLocation} />
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
