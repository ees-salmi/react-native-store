import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ArabicText from '../ArabicText/ArabicText';
import MapView, { Marker } from 'react-native-maps';

const ModalDialog = ({location}) => {
  const [modalVisible, setModalVisible] = useState(false);
  //const [locations, setLocations] = useState(location ? location : {coords : {latitude : 33.0015969, longitude : -7.60031}}); // Your location
  console.log(location);
  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const ShowLocation = ({location}) => {
    if (!location || !location.latitude || !location.longitude) {
        return (
          <View >
            <ArabicText text={'الموقع عير محدد الموجو الاتصال'} />
          </View>
        );
      }
    return(
      <MapView
        style={styles.map}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Current Location"
        />
      </MapView>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleOpenModal} style={styles.button}>
        <ArabicText fweight={700} text={'عرض على الخريطة'} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ArabicText text={'  الخريطة'} />
            <ShowLocation location={location}/>
            <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>اغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ModalDialog;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 2
  },
  map: {
    width: 300, // Ensure the map has width
    height: 300, // Ensure the map has height
    marginBottom: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // To dim the background
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
  },
});
