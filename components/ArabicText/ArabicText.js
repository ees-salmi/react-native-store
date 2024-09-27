import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View } from "react-native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const ArabicText = ({ text, fweight, fsize }) => {
  const [dataLoaded, setDataLoaded] = useState(false);

  const fetchFont = async () => {
    await Font.loadAsync({
      CairoRegular: require("../../assets/fonts/static/Cairo-Regular.ttf"),
    });
  };

  useEffect(() => {
    const loadResources = async () => {
      try {
        await fetchFont();
      } catch (error) {
        console.warn(error);
      } finally {
        setDataLoaded(true);
        await SplashScreen.hideAsync();
      }
    };

    loadResources();
  }, []);

  if (!dataLoaded) {
    return null; // Optionally, you could return a loading spinner here
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
