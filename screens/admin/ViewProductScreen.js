import {
  StyleSheet,
  Text,
  StatusBar,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { colors, network } from "../../constants";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import ProductList from "../../components/ProductList/ProductList";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import CustomInput from "../../components/CustomInput/";
import ProgressDialog from "react-native-progress-dialog";
import { collection, getDocs, deleteDoc, doc, Firestore } from "firebase/firestore"; 
import firestore from "@react-native-firebase/firestore";
import firebaseConfig from "../../config";
import { getStorage} from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
const app = initializeApp(firebaseConfig);
const storage =  getStorage(app);
const db = getFirestore(app);

const ViewProductScreen = ({ navigation, route }) => {
  const { authUser } = route.params;
  const [isloading, setIsloading] = useState(false);
  const [refeshing, setRefreshing] = useState(false);
  const [alertType, setAlertType] = useState("error");

  const [label, setLabel] = useState("Loading...");
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [filterItem, setFilterItem] = useState("");

  //method call on pull refresh
  const handleOnRefresh = () => {
    setRefreshing(true);
    fetchProduct();
    setRefreshing(false);
  };

  //method to delete the specific order
  const handleDelete = async (id) => {
  
    try {
      const productRef = doc(db, 'product', id);
     await deleteDoc(productRef);
      setIsloading(false);
      //await deleteDoc(doc(db, 'product', id));
      console.log('Product deleted successfully');
      setIsloading(false);
      
     await fetchProduct();
    } catch (error) {
      console.error('Error deleting product:', error.message);
      setIsloading(false);
    }

    setIsloading(false);
  };

  //method for alert
  const showConfirmDialog = (id) => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to delete the category?"+id,
      [
        {
          text: "Yes",
          onPress: () => {
            handleDelete(id);
          },
        },
        {
          text: "No",
        },
      ]
    );
  };

  //method the fetch the product data from server using API call
  const fetchProduct = async () => {
    setIsloading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "product"));
      const products = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });
      setProducts(products);
      setFoundItems(products);
      setError("");
    } catch (error) {
      setError(error.message);
      console.log("error", error);
    } finally {
      setIsloading(false);
    }
  };

  //method to filer the orders for by title [search bar]
  const filter = () => {
    const keyword = filterItem;
    if (keyword !== "") {
      const results = products?.filter((product) => {
        return product?.title.toLowerCase().includes(keyword.toLowerCase());
      });
      setFoundItems(results);
    } else {
      setFoundItems(products);
    }
  };

  //filter the data whenever filteritem value change
  useEffect(() => {
    filter();
  }, [filterItem]);

  //fetch the categories on initial render
  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <View style={styles.container}>
      <ProgressDialog visible={isloading} label={label} />
      <StatusBar></StatusBar>
      <View style={styles.TopBarContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons
            name="arrow-back-circle-outline"
            size={30}
            color={colors.muted}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("addproduct", { authUser: authUser });
          }}
        >
          <AntDesign name="plussquare" size={30} color={colors.muted} />
        </TouchableOpacity>
      </View>
      <View style={styles.screenNameContainer}>
        <View>
          <Text style={styles.screenNameText}>View Product</Text>
        </View>
        <View>
          <Text style={styles.screenNameParagraph}>View all products</Text>
        </View>
      </View>
      <CustomAlert message={error} type={alertType} />
      <CustomInput
        radius={5}
        placeholder={"Search..."}
        value={filterItem}
        setValue={setFilterItem}
      />
      <ScrollView
        style={{ flex: 1, width: "100%" }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refeshing} onRefresh={handleOnRefresh} />
        }
      >
        {foundItems && foundItems.length == 0 ? (
          <Text>{`No product found with the name of ${filterItem}!`}</Text>
        ) : (
          foundItems.map((product, index) => {
            return (
              <ProductList
                key={index}
                image={product.image}
                title={product?.title}
                category={product?.category}
                price={product?.price}
                qantity={product?.sku}
                onPressView={() => {
                  console.log("view is working " + product._id);
                }}
                onPressEdit={() => {
                  navigation.navigate("editproduct", {
                    product: product,
                    authUser: authUser,
                  });
                }}
                onPressDelete={() => {
                  showConfirmDialog(product.id);
                }}
              />
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default ViewProductScreen;

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
    justifyContent: "space-between",
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
});
