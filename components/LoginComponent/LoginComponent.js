import React, { useState, useEffect } from 'react';
import { Button, Text, TextInput,View } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

function LoginComponent() {
  // If null, no SMS has been sent
  const [confirm, setConfirm] = useState(null);

  // verification code (OTP - One-Time-Passcode)
  const [code, setCode] = useState('');

  const [phoneNumber, setPhoneNumber] = useState('');
  // Handle login
  const navigation = useNavigation();

  const signInWithPhoneNumber = async () => {
    try{
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        setConfirm(confirmation);
    }
    catch(error){
        console.log("an error occured",error);
    }
  }

  const  confirmCode = async () => {
    try {
     const userCredential =  await confirm.confirm(code);
     const user = userCredential.user;
     const userDocument = await firestore()
     .collection("user")
     .doc(user.id)
     .get();
     if(userDocument.exists){
        navigation.navigate("HomeScreen");
     }
     else{
        navigation.navigate("dashboard")
     }
    } catch (error) {
      console.log('Invalid code.');
    }
  }

//   if (!confirm) {
//     return (
//       <Button
//         title="Phone Number Sign In"
//         onPress={() => signInWithPhoneNumber('+1 650-555-3434')}
//       />
//     );
//   }

  return (
    <View>
        
      {
        !confirm ? (
            <>
                <Text>
                    enter phone
                </Text>

                <TextInput value={phoneNumber} onChange={setPhoneNumber}>
                    
                </TextInput>
                <TouchableOpacity onPress={signInWithPhoneNumber}>
                    <Text>
                        send code
                    </Text>
                </TouchableOpacity>
            </>
        )  : (
            <>
                <Text>
                    enter code
                </Text>
                <TextInput value={code} onChangeText={setCode}>
                    
                </TextInput>
                <TouchableOpacity onPress={confirmCode}>
                    <Text>
                        confirm
                    </Text>
                </TouchableOpacity>
            </>
        )
      }
    </View>
  );
}

export default LoginComponent