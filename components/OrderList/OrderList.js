import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState, useEffect } from "react";
import { colors } from "../../constants";
function getTime(date) {
  // Convert Firebase Timestamp to Date object if necessary
  
  let t = date instanceof Date ? date : date.toDate();
  
  const hours = t.getHours();
  const minutes = ("0" + t.getMinutes()).slice(-2);
  const seconds = ("0" + t.getSeconds()).slice(-2);
  
  const ampm = hours >= 12 ? " PM" : " AM";
  const formattedHours = hours % 12 || 12; // Convert 0 to 12
  
  return `${formattedHours}:${minutes}:${seconds}${ampm}`;
}
const str = (str) => {
  return str.substring(0,3);
}
const dateFormat = (datex) => {
  // Convert Firebase Timestamp to Date object if necessary
  let t = datex instanceof Date ? datex : datex.toDate();

  const date = ("0" + t.getDate()).slice(-2);
  const month = ("0" + (t.getMonth() + 1)).slice(-2); // Month is zero-based
  const year = t.getFullYear();

  return `${date}-${month}-${year}`;
};


const OrderList = ({ item, onPress }) => {
  const [totalCost, setTotalCost] = useState(0);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    let packageItems = 0;
    item?.items.forEach(() => {
      ++packageItems;
    });
    setQuantity(packageItems);
    setTotalCost(
      item?.items.reduce((accumulator, object) => 
        accumulator + (object.price * object.quantity), 0
      )
    );    
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.innerRow}>
        <View>
          <Text style={styles.primaryText}>رقم الطلب :  {str(item?.id)}</Text>
        </View>
        <View style={styles.timeDateContainer}>
          <Text style={styles.secondaryTextSm}>
            {dateFormat(item?.createdAt)}
          </Text>
          <Text style={styles.secondaryTextSm}>{getTime(item?.createdAt)}</Text>
        </View>
      </View>
      {item?.user?.name && (
        <View style={styles.innerRow}>
          <Text style={styles.secondaryText}>{item?.user?.name} </Text>
        </View>
      )}
      {item?.user?.email && (
        <View style={styles.innerRow}>
          <Text style={styles.secondaryText}>{item?.email} </Text>
        </View>
      )}
      <View style={styles.innerRow}>
        <Text style={styles.secondaryText}>كمية : {quantity}</Text>
        <Text style={styles.secondaryText}>المجموع  : {totalCost} dh</Text>
      </View>
      <View style={styles.innerRow}>
        <TouchableOpacity style={styles.detailButton} onPress={onPress}>
          <Text>تفاصيل</Text>
        </TouchableOpacity>
        <Text 
          style={[
            item?.status === 'قيد الانتظار' && styles.pending,
            item?.status === 'تم شحنها' && styles.shipped,
            item?.status === 'تم التوصيل' && styles.delivered
          ]}
        >
          {item?.status}
        </Text>


      </View>
    </View>
  );
};

export default OrderList;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: "auto",
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 1,
  },
  innerRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  primaryText: {
    fontSize: 15,
    color: colors.dark,
    fontWeight: "bold",
  },
  secondaryTextSm: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: "bold",
  },
  secondaryText: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: "bold",
  },
  timeDateContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  detailButton: {
    marginTop: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    padding: 5,
    borderColor: colors.muted,
    color: colors.muted,
    width: 100,
  },
  pending: {
    backgroundColor: '#FFD700', // gold color for "Pending"
    color: 'black',
    padding: 2,
    borderRadius: 5,
  },
  shipped: {
    backgroundColor: '#00BFFF', // deep sky blue color for "Shipped"
    color: 'white',
    padding: 2,
    borderRadius: 5,
  },
  delivered: {
    backgroundColor: '#32CD32', // lime green color for "Delivered"
    color: 'white',
    padding: 2,
    borderRadius: 5,
  },
});
