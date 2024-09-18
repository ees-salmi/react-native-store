import React, { useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading"; 

const ArabicText = ({ text, fweight, fsize }) => {
  const [dataLoaded, setDataLoaded] = useState(false);

  const fetchFont = () => {
    return Font.loadAsync({
      CairoRegular: require("../../assets/fonts/static/Cairo-Regular.ttf"),
    });
  };

  if (!dataLoaded) {
    return (
      <AppLoading
        startAsync={fetchFont}
        onFinish={() => setDataLoaded(true)}
        onError={(error) => console.warn(error)} // Optional: to catch errors while loading fonts
      />
    );
  }

  return (
    <Text
      style={[
        styles.base,
        { fontSize: fsize || 16, fontWeight: fweight || "400" },
      ]}
    >
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: "CairoRegular", // The font you loaded
    fontWeight: "400", // Default weight, adjustable
    fontSize: 16, // Default size, adjustable
  },
});

export default ArabicText;
