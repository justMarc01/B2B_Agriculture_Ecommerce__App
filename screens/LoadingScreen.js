import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Image, StyleSheet, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoadingScreen = ({ onLoginCheckComplete }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      checkLoginState();
    }, 5000);
  }, []);

  const checkLoginState = async () => {
    try {
      const isLoggedInStr = await AsyncStorage.getItem("isLoggedIn");
      const isLoggedIn = isLoggedInStr === "true";
      setIsLoggedIn(isLoggedIn);
      onLoginCheckComplete(isLoggedIn);
    } catch (error) {
      console.error("Error checking login state:", error);
    }
  };

  if (isLoggedIn === null) {
    return (
      <>
        <View style={styles.container1}>
          <Image
            source={require("../assets/loadingscreen.jpg")}
            style={styles.logo}
          />
          <Text style={styles.text}>
            Stressed spelled backward is desserts. Coincidence? I don't think
            so!
          </Text>
        </View>
        <View style={styles.container2}>
          <ActivityIndicator size="larger" color="#FF69B4" />
        </View>
      </>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container1: {
    flex: 0.75,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#06AE8C",
  },
  container2: {
    flex: 0.25,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#06AE8C",
  },
  logo: {
    width: 170,
    height: 170,
    marginBottom: 20,
    borderRadius: 100,
  },

  text: {
    fontSize: 20,
    color: "#EDF2F1",
    textAlign: "center",
    paddingHorizontal: 15,
    marginTop: 20,
  },
});

export default LoadingScreen;
