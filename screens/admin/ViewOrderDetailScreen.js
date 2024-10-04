import {
  StyleSheet,
  Text,
  StatusBar,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { colors, network } from "../../constants";
import { Ionicons } from "@expo/vector-icons";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import ProgressDialog from "react-native-progress-dialog";
import BasicProductList from "../../components/BasicProductList/BasicProductList";
import CustomButton from "../../components/CustomButton";
import DropDownPicker from "react-native-dropdown-picker";
import { collection, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore"; 
import firebaseConfig from "../../config";
import { getStorage} from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import ModalDialog from "../../components/Modal/Modal";
const app = initializeApp(firebaseConfig);
const storage =  getStorage(app);
const db = getFirestore(app);

const ViewOrderDetailScreen = ({ navigation, route }) => {
  const { orderDetail, Token } = route.params;
  const [isloading, setIsloading] = useState(false);
  const [label, setLabel] = useState("Loading..");
  const [location, setLocation] = useState();
  const [error, setError] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [totalCost, setTotalCost] = useState(0);
  const [address, setAddress] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [statusDisable, setStatusDisable] = useState(false);
  const [items, setItems] = useState([
    { label: "قيد الانتظار", value: "قيد الانتظار" },
    { label: "تم شحنها", value: "تم شحنها" },
    { label: "تم التوصيل", value: "تم التوصيل" },
  ]);

  //method to convert the time into AM PM format
  function tConvert(time) {
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) {
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join("");
  }

  //method to convert the Data into dd-mm-yyyy format
  const dateFormat = (datex) => {
    // Convert Firebase Timestamp to Date object if necessary
    let t = datex instanceof Date ? datex : datex.toDate();
  
    const date = ("0" + t.getDate()).slice(-2);
    const month = ("0" + (t.getMonth() + 1)).slice(-2); // Month is zero-based
    const year = t.getFullYear();
  
    return `${date}-${month}-${year}`;
  };
  
  const handleUpdateStatus = async (orderId) => {
    setIsloading(true);
    setError("");
    setAlertType("error");
  
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        status: value, 
      });
  
      setError(
        <Text>
          تم تحديث حالة الطلب بنجاح إلى <Text style={{ fontWeight: "bold" }}>{value}</Text>
        </Text>
      );
      setAlertType("success");
    } catch (error) {
      setAlertType("error");
      setError("Failed to update order status: " + error.message);
      console.log("Error updating status:", error);
    } finally {
      setIsloading(false);
    }
  };

  // calculate the total cost and set the all requried variables on initial render
  useEffect(() => {
    setError("");
    setLocation(orderDetail.location);
    setAlertType("error");
    if (orderDetail?.status == "delivered") {
      setStatusDisable(true);
    } else {
      setStatusDisable(false);
    }
    setValue(orderDetail?.status);
    setAddress(
      orderDetail?.country +
        ", " +
        orderDetail?.city +
        ", " +
        orderDetail?.shippingAddress
    );
    setTotalCost(
      orderDetail?.items.reduce((accumulator, object) => {
        return accumulator + object.price * object.quantity; // Multiply first, then accumulate
      }, 0) // calculate the total cost
    );
    
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
      </View>
      <View style={styles.screenNameContainer}>
        <View>
          <Text style={styles.screenNameText}>تفاصيل الطلب</Text>
        </View>
        <View>
          <Text style={styles.screenNameParagraph}>
          عرض كافة التفاصيل حول الطلب
          </Text>
        </View>
      </View>
      <CustomAlert message={error} type={alertType} />
      <ScrollView
        style={styles.bodyContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.containerNameContainer}>
          <View>
            <Text style={styles.containerNameText}>عنوان الارسال</Text>
          </View>
        </View>
        <View style={styles.ShipingInfoContainer}>
          <ModalDialog location={location}/>
          <Text style={styles.secondarytextMedian}>
            {orderDetail?.user?.name}
          </Text>
          <Text style={styles.secondarytextMedian}>
            {orderDetail?.user?.email}
          </Text>
          <Text style={styles.secondarytextSm}>{address}</Text>
          <Text style={styles.secondarytextSm}>{orderDetail?.zipcode}</Text>
        </View>
        <View>
        </View>
        <View>
          <Text style={styles.containerNameText}>معلومات الطلب</Text>
        </View>
        <View style={styles.orderInfoContainer}>
          <Text style={styles.secondarytextMedian}>
            طلب # {orderDetail?.orderId}
          </Text>
          <Text style={styles.secondarytextSm}>
            تم الطلب في {dateFormat(orderDetail?.createdAt)}
          </Text>
          {orderDetail?.shippedOn && (
            <Text style={styles.secondarytextSm}>
              تم الشحن في {orderDetail?.shippedOn}
            </Text>
          )}
          {orderDetail?.deliveredOn && (
            <Text style={styles.secondarytextSm}>
              تم التوصيل في {orderDetail?.deliveredOn}
            </Text>
          )}
        </View>
        <View style={styles.containerNameContainer}>
          <View>
            <Text style={styles.containerNameText}>تفاصيل الطلب</Text>
          </View>
        </View>
        <View style={styles.orderItemsContainer}>
          <View style={styles.orderItemContainer}>
            <Text style={styles.orderItemText}>Package</Text>
            <Text>{value}</Text>
          </View>
          <View style={styles.orderItemContainer}>
            <Text style={styles.orderItemText}>
              Order on : {dateFormat(orderDetail?.createdAt)}
            </Text>
          </View>
          <ScrollView
            style={styles.orderSummaryContainer}
            nestedScrollEnabled={true}
          >
            {orderDetail?.items.map((product, index) => (
              <View key={index}>
                <BasicProductList
                  title={product?.title}
                  price={product?.price}
                  quantity={product?.quantity}
                />
              </View>
            ))}
          </ScrollView>
          <View style={styles.orderItemContainer}>
            <Text style={styles.orderItemText}>Total</Text>
            <Text>{totalCost} dh</Text>
          </View>
        </View>
        <View style={styles.emptyView}></View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <View>
          <DropDownPicker
            style={{ width: 200 }}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            disabled={statusDisable}
            disabledStyle={{
              backgroundColor: colors.light,
              borderColor: colors.white,
            }}
            labelStyle={{ color: colors.muted }}
          />
        </View>
        <View>
          {statusDisable == false ? (
            <CustomButton
              text={"تحديث"}
              onPress={() => handleUpdateStatus(orderDetail?.id)}
            />
          ) : (
            <CustomButton text={"تحديث"} disabled />
          )}
        </View>
      </View>
    </View>
  );
};

export default ViewOrderDetailScreen;

const styles = StyleSheet.create({
  container: {
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingBottom: 0,
    flex: 1,
  },
  TopBarContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  screenNameContainer: {
    marginTop: 10,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    marginBottom: 5,
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.muted,
  },
  screenNameParagraph: {
    marginTop: 10,
    fontSize: 15,
  },
  bodyContainer: { flex: 1, width: "100%", padding: 5 },
  ShipingInfoContainer: {
    marginTop: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 10,
    borderColor: colors.muted,
    elevation: 5,
    marginBottom: 10,
  },
  containerNameContainer: {
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  containerNameText: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.muted,
  },
  secondarytextSm: {
    color: colors.muted,
    fontSize: 13,
  },
  orderItemsContainer: {
    marginTop: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 10,

    borderColor: colors.muted,
    elevation: 3,
    marginBottom: 10,
  },
  orderItemContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderItemText: {
    fontSize: 13,
    color: colors.muted,
  },
  orderSummaryContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
    maxHeight: 220,
    width: "100%",
    marginBottom: 5,
  },
  bottomContainer: {
    backgroundColor: colors.white,
    width: "110%",
    height: 70,
    borderTopLeftRadius: 10,
    borderTopEndRadius: 10,
    elevation: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingLeft: 10,
    paddingRight: 10,
  },
  orderInfoContainer: {
    marginTop: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 10,

    borderColor: colors.muted,
    elevation: 1,
    marginBottom: 10,
  },
  primarytextMedian: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "bold",
  },
  secondarytextMedian: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: "bold",
  },
  emptyView: {
    height: 20,
  },
});
