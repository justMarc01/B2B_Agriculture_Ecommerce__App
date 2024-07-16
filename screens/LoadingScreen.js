import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Image, StyleSheet, Text, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

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
      <View style={styles.container}>
        <Image
          source={require("../assets/loadingscreen.jpg")}
          style={styles.logo}
        />
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "cover",
    alignItems: "cover",
    backgroundColor: "#ffffff",
    paddingBottom: 0, 
  },
  logo: {
    width: screenWidth, 
    height: screenHeight, 
    resizeMode: 'cover', 
  },
});

export default LoadingScreen;
