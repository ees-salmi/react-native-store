import {
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  StatusBar,
  Text,
  FlatList,
  RefreshControl,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";

import { Ionicons } from "@expo/vector-icons";
import cartIcon from "../../assets/icons/cart_beg.png";
import emptyBox from "../../assets/image/emptybox.png";
import ProgressDialog from "react-native-progress-dialog";
import { colors, network } from "../../constants";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreaters from "../../states/actionCreaters/actionCreaters";
import CustomIconButton from "../../components/CustomIconButton/CustomIconButton";
import ProductCard from "../../components/ProductCard/ProductCard";
import CustomInput from "../../components/CustomInput";
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore"; 
import firebaseConfig from "../../config";
import { getStorage} from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
const app = initializeApp(firebaseConfig);
const storage =  getStorage(app);
const db = getFirestore(app);

const CategoriesScreen = ({ navigation, route }) => {
  const { categoryName } = route.params;
  const categoryID = "32343";
  const [isloading, setIsloading] = useState(false);
  const [products, setProducts] = useState([]);
  const [refeshing, setRefreshing] = useState(false);
  const [label, setLabel] = useState("جاري التحميل ...");
  const [error, setError] = useState("");
  const [foundItems, setFoundItems] = useState([]);
  const [filterItem, setFilterItem] = useState("");
  const [category, setCategory] = useState([]);
  const [selectedTab, setSelectedTab] = useState(category[0]);

  //get the dimenssions of active window
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width
  );
  const windowHeight = Dimensions.get("window").height;

  //initialize the cartproduct with redux data
  const cartproduct = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const { addCartItem } = bindActionCreators(actionCreaters, dispatch);

  //method to navigate to product detail screen of specific product
  const handleProductPress = (product) => {
    navigation.navigate("productdetail", { product: product });
  };

  //method to add the product to cart (redux)
  const handleAddToCat = (product) => {
    addCartItem(product);
  };

  //method call on pull refresh
  const handleOnRefresh = () => {
    setRefreshing(true);
    fetchProduct();
    setRefreshing(false);
  };

 
  const fetchCategories = async () => {
    setIsloading(true);
  
    try {
      const querySnapshot = await getDocs(collection(db, "category"));
      const categorie = [];
      querySnapshot.forEach((doc) => {
        categorie.push({ id: doc.id, ...doc.data() });
      });
      setCategory(categorie);
      console.log("categories: ", categorie);
      setError("");
      setIsloading(false);
    } catch (error) {
      setError(error.message);
      console.log("error", error);
      setIsloading(false);
    }finally {
      setIsloading(false);
    }
  };

  const fetchProductsByCategory = async (categoryName) => {
    setIsloading(true);
    try {
      const productsQuerySnapshot = await getDocs(
        query(collection(db, "product"), where("category", "==", categoryName))
      );
      const products = [];
      productsQuerySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });
      setProducts(products);
      setFoundItems(products);
      setFilterItem(products);
      console.log(products);
      setIsloading(false);
      setError("");
    } catch (error) {
      setError(error.message);
      console.log("error", error);
    } finally {
      setIsloading(false);
    }
  };
  
  //method to fetch the product from server using API call
  const fetchProduct = () => {
    
  };

  //listener call on tab focus and initlize categoryID
  navigation.addListener("focus", () => {
    if (categoryID) {
      setSelectedTab(categoryID);
    }
  });

  //method to filter the product according to user search in selected category
  const filter = () => {
    const keyword = filterItem;
    if (keyword !== "") {
      const results = products.filter((product) => {
        return product?.title.toLowerCase().includes(keyword.toLowerCase());
      });

      setFoundItems(results);
    } else {
      setFoundItems(products);
    }
  };

  const refresh = async () => {
    setIsloading(true);
    try {
      await fetchData();
      setIsloading(false);
    } catch {
      setIsloading(false);
    } finally {
      setIsloading(false);
    }
    
    setIsloading(false);
  }
  //render whenever the value of filterItem change
  // useEffect(() => {
  //   filter();
  // }, [filterItem]);
  const fetchData = async () => {
      await fetchCategories();
      await fetchProductsByCategory(selectedTab.title);
  }
  //fetch the product on initial render
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar></StatusBar>
      <ProgressDialog visible={isloading} label={label} />
      <View style={styles.topBarContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.jumpTo("home");
          }}
        >
          <Ionicons
            name="arrow-back-circle-outline"
            size={30}
            color={colors.muted}
          />
        </TouchableOpacity>

        <View>
        <TouchableOpacity
          onPress={async ()=> { await refresh()}}
        >
          <Ionicons
            name="refresh"
            size={30}
            color={colors.muted}
          />
        </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.cartIconContainer}
          onPress={() => navigation.navigate("cart")}
        >
          {cartproduct?.length > 0 ? (
            <View style={styles.cartItemCountContainer}>
              <Text style={styles.cartItemCountText}>{cartproduct.length}</Text>
            </View>
          ) : (
            <></>
          )}
          <Image source={cartIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.bodyContainer}>
        <View style={{ padding: 0, paddingLeft: 20, paddingRight: 20 }}>
          <CustomInput
            radius={5}
            placeholder={"Search..."}
            value={filterItem}
            setValue={setFilterItem}
            onChange={() => filterProducts()} // impmeting filering
          />
        </View>
        <FlatList
          data={category}
          keyExtractor={(index, item) => `${index}-${item}`}
          horizontal
          style={{ flexGrow: 0 }}
          contentContainerStyle={{ padding: 10 }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: tab }) => (
            <CustomIconButton
              key={tab}
              text={tab.title}
              image={tab.image}
              active={selectedTab?.title === tab.title ? true : false}
              onPress={() => {
                setSelectedTab(tab);
              }}
            />
          )}
        />

        {foundItems.filter(
          (product) => product?.category?._id === selectedTab?._id
        ).length === 0 ? (
          <View style={styles.noItemContainer}>
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.white,
                height: 150,
                width: 150,
                borderRadius: 10,
              }}
            >
              <Image
                source={emptyBox}
                style={{ height: 80, width: 80, resizeMode: "contain" }}
              />
              <Text style={styles.emptyBoxText}>
                There no product in this category
              </Text>
            </View>
          </View>
        ) : (
          <FlatList
            data={foundItems}
            refreshControl={
              <RefreshControl
                refreshing={refeshing}
                onRefresh={handleOnRefresh}
              />
            }
            keyExtractor={(index, item) => `${index}-${item}`}
            contentContainerStyle={{ margin: 10 }}
            numColumns={2}
            renderItem={({ item: product }) => (
              <View
                style={[
                  styles.productCartContainer,
                  { width: (windowWidth - windowWidth * 0.1) / 2 },
                ]}
              >
                <ProductCard
                  cardSize={"large"}
                  name={product.title}
                  image={product.image}
                  price={product.price}
                  quantity={product.quantity}
                  onPress={() => handleProductPress(product)}
                  onPressSecondary={() => handleAddToCat(product)}
                />
                <View style={styles.emptyView}></View>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default CategoriesScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
  },
  topBarContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  toBarText: {
    fontSize: 15,
    fontWeight: "600",
  },
  bodyContainer: {
    flex: 1,
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.light,

    justifyContent: "flex-start",
    flex: 1,
  },
  cartIconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cartItemCountContainer: {
    position: "absolute",
    zIndex: 10,
    top: -10,
    left: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 22,
    width: 22,
    backgroundColor: colors.danger,
    borderRadius: 11,
  },
  cartItemCountText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 10,
  },
  productCartContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    margin: 5,
    padding: 5,
    paddingBottom: 0,
    paddingTop: 0,
    marginBottom: 0,
  },
  noItemContainer: {
    width: "100%",
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  emptyBoxText: {
    fontSize: 11,
    color: colors.muted,
    textAlign: "center",
  },
  emptyView: {
    height: 20,
  },
});
