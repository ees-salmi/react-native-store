import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App({ navigation }) {
  const [location, setLocation] = useState(null);
  const [storedLocation, setStoredLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

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

      setRegion({
        ...region,
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    })();
  }, []);

  // Function to handle storing the current location
  const storeCurrentLocation = () => {
    if (location) {
      setStoredLocation(location);
      Alert.alert('Location Stored', `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`);
      navigation.replace("login");
    } else {
      Alert.alert('Location not available', 'Please try again later.');
    }

    
  };

  // Function to zoom in by decreasing the latitudeDelta and longitudeDelta
  const zoomIn = () => {
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta / 2,
      longitudeDelta: region.longitudeDelta / 2,
    });
  };

  // Function to zoom out by increasing the latitudeDelta and longitudeDelta
  const zoomOut = () => {
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta * 2,
      longitudeDelta: region.longitudeDelta * 2,
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={(region) => setRegion(region)}
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
      <View style={styles.buttonContainer}>
        <Button title="تكبير" onPress={zoomIn} />
        <Button title="تصغير" onPress={zoomOut} />
      </View>
      <Button title="تأكيد الموقع" onPress={storeCurrentLocation} />
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    position: 'absolute',
    bottom: 80,
  },
  locationText: {
    margin: 20,
    fontSize: 16,
  },
});
