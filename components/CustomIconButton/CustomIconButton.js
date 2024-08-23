import { StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { colors } from "../../constants";
import garmentsIcon from "../../assets/adaptive-icon.png";

const CustomIconButton = ({image, onPress, active }) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: active ? colors.success : colors.white },
      ]}
      onPress={onPress}
    >
      <Image source={{ uri: image }} style={styles.buttonIcon} />
      
    </TouchableOpacity>
  );
};

export default CustomIconButton;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 40,
    height: 70,
    width: 70,
    elevation: 3,
    margin: 5,
  },
  buttonText: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: "bold",
  },
  buttonIcon: {
    height: "90%",
    width: "90%",
    borderRadius : 40,
    resizeMode: "contain",
  },
});
