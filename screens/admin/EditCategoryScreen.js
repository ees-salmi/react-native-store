import {
  StyleSheet,
  Text,
  Image,
  StatusBar,
  View,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { colors, network } from "../../constants";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import * as ImagePicker from "expo-image-picker";
import ProgressDialog from "react-native-progress-dialog";
import { AntDesign } from "@expo/vector-icons";
import { getFirestore, addDoc,updateDoc, getDocs, deleteDoc, doc, Firestore } from "firebase/firestore";
import firebaseConfig from "../../config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";
const app = initializeApp(firebaseConfig);
const storage =  getStorage(app);
const db = getFirestore(app);

const EditCategoryScreen = ({ navigation, route }) => {
  const { category, authUser } = route.params;
  const [isloading, setIsloading] = useState(false);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("easybuycat.png");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [user, setUser] = useState({});

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const storageRef = ref(storage, `imgaes/${filename}`);

    try {
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  //Method to post the data to server to edit the category using API call
  const editCategoryHandle = async () => {
    setIsloading(true);
    if (title === "" || description === "") {
      setError("Please fill in all fields");
      setIsloading(false);
      return;
    }

    try {
      let imageUrl = image;
      if (image && !image.includes("firebasestorage")) {
        imageUrl = await uploadImage(image);
      }

      const categoryData = {
        title,
        description,
        image: imageUrl,
      };

      const categoryRef = doc(db, "category", category?.id);
      await updateDoc(categoryRef, categoryData);

      setAlertType("success");
      setError("Category updated successfully");
      setIsloading(false);
      navigation.goBack();
    } catch (error) {
      setAlertType("error");
      setError("Failed to update category: " + error.message);
      setIsloading(false);
    }
  };

  //inilize the title and description input fields on initial render
  useEffect(() => {
    setTitle(category?.title);
    setDescription(category?.description);
  }, []);
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <StatusBar />
      <ProgressDialog visible={isloading} label={"Updating category..."} />
      <View style={styles.TopBarContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-circle-outline" size={30} color={colors.muted} />
        </TouchableOpacity>
      </View>
      <View style={styles.screenNameContainer}>
        <Text style={styles.screenNameText}>Edit Category</Text>
        <Text style={styles.screenNameParagraph}>Update category details</Text>
      </View>
      <CustomAlert message={error} type={alertType} />
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, width: "100%" }}>
        <View style={styles.formContainer}>
          <TouchableOpacity style={styles.imageHolder} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
            ) : (
              <AntDesign name="pluscircle" size={50} color={colors.muted} />
            )}
          </TouchableOpacity>
          <CustomInput value={title} setValue={setTitle} placeholder={"Title"} radius={5} />
          <CustomInput value={description} setValue={setDescription} placeholder={"Description"} radius={5} />
        </View>
      </ScrollView>
      <View style={styles.buttomContainer}>
        <CustomButton text={"Update Category"} onPress={editCategoryHandle} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditCategoryScreen;

const styles = StyleSheet.create({
  container: {
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    flex: 1,
  },
  TopBarContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  formContainer: {
    flex: 2,
    justifyContent: "flex-start",
    alignItems: "center",
    display: "flex",
    width: "100%",
    flexDirecion: "row",
    padding: 5,
  },

  buttomContainer: {
    marginTop: 10,
    width: "100%",
  },
  bottomContainer: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  screenNameContainer: {
    marginTop: 10,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.muted,
  },
  screenNameParagraph: {
    marginTop: 5,
    fontSize: 15,
  },
  imageContainer: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    height: 250,
    backgroundColor: colors.white,
    borderRadius: 10,
    elevation: 5,
    paddingLeft: 20,
    paddingRight: 20,
  },
  imageHolder: {
    height: 200,
    width: 200,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light,
    borderRadius: 10,
    elevation: 5,
  },
});
