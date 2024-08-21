import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Platform,
  Linking,
  Text,
} from 'react-native';

const App = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  const sendWhatsApp = () => {
    if (phoneNumber.length === 0) {
      Alert.alert('Error', 'Please insert mobile number');
      return;
    }

    if (message.length === 0) {
      Alert.alert('Error', 'Please insert a message to send');
      return;
    }

    let mobile = Platform.OS === 'ios' ? phoneNumber : `+${phoneNumber}`;

    let url = `whatsapp://send?text=${message}&phone=${mobile}`;
    
    Linking.openURL(url)
      .then(() => {
        console.log('WhatsApp Opened');
      })
      .catch(() => {
        Alert.alert('Error', 'Make sure WhatsApp is installed on your device');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Phone Number (include country code):</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      
      <Text style={styles.label}>Message:</Text>
      <TextInput
        style={styles.input}
        placeholder="Type your message"
        value={message}
        onChangeText={setMessage}
      />

      <Button title="Send WhatsApp Message" onPress={sendWhatsApp} />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
});
