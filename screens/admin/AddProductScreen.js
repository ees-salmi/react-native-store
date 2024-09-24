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
import React, { useState } from "react";
import { colors, network } from "../../constants";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import * as ImagePicker from "expo-image-picker";
import ProgressDialog from "react-native-progress-dialog";
import { AntDesign } from "@expo/vector-icons";
import { useEffect } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebaseConfig from "../../config";

const app = initializeApp(firebaseConfig);
const storage =  getStorage(app);
const db = getFirestore(app);

const AddProductScreen = ({ navigation, route }) => {
  //const { authUser } = route.params;
  const [isloading, setIsloading] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [sku, setSku] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [user, setUser] = useState({});
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [openbrand, setOpenbrand] = useState(false);
  const [value, setValue] = useState(null);
  const [statusDisable, setStatusDisable] = useState(false);
  const [items, setItems] = useState([]);
  const [brandes, setBrandes] = useState([]);
  var payload = [];

  //method to convert the authUser to json object.
  const getToken = (obj) => {
    try {
      setUser(JSON.parse(obj));
    } catch (e) {
      setUser(obj);
      return obj.token;
    }
    return JSON.parse(obj).token;
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const storageRef = ref(storage, `images/${filename}`);

    try {
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const addProductHandle = async () => {
    setIsloading(true);

    //[check validation] -- Start
    if (title == "") {
      setError("Please enter the product title");
      setIsloading(false);
    } else if (price == 0) {
      setError("Please enter the product price");
      setIsloading(false);
    } else if (quantity <= 0) {
      setError("Quantity must be greater then 1");
      setIsloading(false);
    } else if (brand == ""){
      setError("specify the brand")
    }
    // } else if (image == null) {
    //   setError("Please upload the product image");
    //   setIsloading(false);
    else {
      const imageUrl = await uploadImage(image);
      const product = {
        title: title,
        sku : sku,
        price : price,
        image: imageUrl,
        description : description,
        category : category,
        brand : brand ,
        quantity: quantity,
      };
        try {
          await addDoc(collection(db, "product"), product);
          setAlertType("success");
          setIsloading(false);
          navigation.goBack();
        } catch (error) {
          setAlertType("error");
          setError("Failed to add product: " + error.message);
          setIsloading(false);
        }
    }
  };
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
   // console.log(result.assets[0].uri);
  }
  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "category"));
      const categorie = [];
      querySnapshot.forEach((doc) => {
        categorie.push({ id: doc.id, ...doc.data() });
      });

      let categories = [];
      categorie.map(cat => categories.push({label : ""+cat.title, value : ""+cat.title}));
      setItems(categories);
      
      setError("");
    } catch (error) {
      setError(error.message);
      console.log("error", error);
    } finally {
      setIsloading(false);
    }
  };
  const fetchBrands = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "brand"));
      const brands = [];
      querySnapshot.forEach((doc) => {
        brands.push({ id: doc.id, ...doc.data() });
      });

      let brandes = [];
      brands.map(cat => brandes.push({label : ""+cat.title, value : ""+cat.title}));
      setBrandes(brandes);
      
      setError("");
    } catch (error) {
      setError(error.message);
      console.log("error", error);
    } finally {
      setIsloading(false);
    }
  };
  useEffect(() => {
      fetchCategories();
      fetchBrands();
  }, []);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <StatusBar></StatusBar>
      <ProgressDialog visible={isloading} label={"Adding ..."} />
      <View style={styles.TopBarContainer}>
        <TouchableOpacity
          onPress={() => {
            // navigation.replace("viewproduct", { authUser: authUser });
            navigation.goBack();
          }}
        >
          <Ionicons
            name="arrow-back-circle-outline"
            size={30}
            color={colors.muted}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.screenNameContainer}>
        <View>
          <Text style={styles.screenNameText}>Add Product</Text>
        </View>
        <View>
          <Text style={styles.screenNameParagraph}>Add product details</Text>
        </View>
      </View>
      <CustomAlert message={error} type={alertType} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, width: "100%" }}
      >
        <View style={styles.formContainer}>
          <View style={styles.imageContainer}>
            {image ? (
              <TouchableOpacity style={styles.imageHolder} onPress={pickImage}>
                <Image
                  source={{ uri: image }}
                  style={{ width: 200, height: 200 }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.imageHolder} onPress={pickImage}>
                <AntDesign name="pluscircle" size={50} color={colors.muted} />
              </TouchableOpacity>
            )}
          </View>

          <CustomInput
            value={sku}
            setValue={setSku}
            placeholder={"SKU"}
            placeholderTextColor={colors.muted}
            radius={5}
          />
          <CustomInput
            value={title}
            setValue={setTitle}
            placeholder={"Title"}
            placeholderTextColor={colors.muted}
            radius={5}
          />
          <CustomInput
            value={price}
            setValue={setPrice}
            placeholder={"Price"}
            keyboardType={"number-pad"}
            placeholderTextColor={colors.muted}
            radius={5}
          />
          <CustomInput
            value={quantity}
            setValue={setQuantity}
            placeholder={"Quantity"}
            keyboardType={"number-pad"}
            placeholderTextColor={colors.muted}
            radius={5}
          />
          <CustomInput
            value={description}
            setValue={setDescription}
            placeholder={"Description"}
            placeholderTextColor={colors.muted}
            radius={5}
          />
          <DropDownPicker
            placeholder={"Select brand "}
            open={open}
            value={brand}
            items={brandes}
            setOpen={setOpen}
            setValue={setBrand}
            setItems={setBrandes}
            disabled={statusDisable}
            disabledStyle={{
              backgroundColor: colors.light,
              borderColor: colors.white,
            }}
            labelStyle={{ color: colors.muted }}
            style={{ borderColor: "#fff", elevation: 5 }}
          />
        </View>
     
          <DropDownPicker
            placeholder={"Select  Category"}
            open={openbrand}
            value={category}
            items={items}
            setOpen={setOpenbrand}
            setValue={setCategory}
            setItems={setItems}
            disabled={statusDisable}
            disabledStyle={{
              backgroundColor: colors.light,
              borderColor: colors.white,
            }}
            labelStyle={{ color: colors.muted }}
            style={{ borderColor: "#fff", elevation: 5 }}
          />
       </ScrollView>
      <View style={styles.buttomContainer}>
        <CustomButton text={"Add Product"} onPress={addProductHandle} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddProductScreen;

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
