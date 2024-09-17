import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { useFonts } from "expo-font";
//import AppLoading from "expo-app-loading"; // This helps to wait while fonts are loading

const ArabicText = ({ text, fweight, fsize }) => {
  // Load fonts
  const [fontsLoaded] = useFonts({
    CairoRegular: require("../../assets/fonts/static/Cairo-Regular.ttf"),
    CairoBold: require("../../assets/fonts/static/Cairo-Bold.ttf"),
  });

  /*if (!fontsLoaded) {
    return <AppLoading />; // Show a loader until fonts are loaded
  }*/

  return (
      <Text style={[styles.base, { fontSize: fsize || 16, fontWeight: fweight || "400" }]}>
        {text}
      </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: "CairoRegular", // The font you loaded
    fontWeight: "400", // Default weight, you can change it dynamically
    fontSize: 16,
  },
});

export default ArabicText;
