import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [storedLocation, setStoredLocation] = useState(null);

  // Get the current location on component mount
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
    if (location) {
      setStoredLocation(location);
      Alert.alert('Location Stored', `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`);
    } else {
      Alert.alert('Location not available', 'Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
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
      <Button title="Store Current Location" onPress={storeCurrentLocation} />
      {storedLocation && (
        <Text style={styles.locationText}>
          Stored Location: Latitude {storedLocation.coords.latitude}, Longitude {storedLocation.coords.longitude}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  locationText: {
    margin: 20,
    fontSize: 16,
  },
});
