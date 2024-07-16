import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  Alert,
  KeyboardAvoidingView, // Import KeyboardAvoidingView
  Platform,
  ActivityIndicator,
} from "react-native";
import { useFormik } from "formik";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import ForgotPasswordScreen from "./ForgotPasswordScreen"; // Import ForgotPasswordScreen

const LoginScreen = () => {
  const navigation = useNavigation();
  const initialValues = {
    email: "",
    password: "",
  };

  const navigateToStore = () => {
    navigation.reset({ index: 0, routes: [{ name: "AppStack" }] });
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (values) => {
    try {
      setIsLoggingIn(true);
      //send the login data to the backend
      const userData = {
        email: values.email,
        password: values.password,
      };

      //make a POST request to the backend API for user login
      const response = await fetch("http://192.168.1.8:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      console.log(data);
      //check if login was successful
      if (response.ok) {
        if (data.user.enabled === 0) {
          //user account is disabled
          Alert.alert(
            "Account Disabled",
            "Contact us at mahsoulnagroup@gmail.com"
          );
        } else {
          //save the isLoggedIn state to AsyncStorage
          await AsyncStorage.setItem("isLoggedIn", "true");
          await AsyncStorage.setItem("userId", data.user.userId.toString());
          await AsyncStorage.setItem("token", JSON.stringify(data));

          setIsLoggedIn(true);

          navigateToStore();
        }
      } else {
        console.log("Login failed. Invalid credentials.");
        Alert.alert("Login Failed.", "Invalid Credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit: handleLogin,
  });

  if (isLoggedIn) {
    return null;
  }

  return (
    <ImageBackground
      source={require("../assets/white-background.jpg")}
      imageStyle={{ resizeMode: "cover" }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }} // Set flex: 1 to make KeyboardAvoidingView take up the entire screen
      >
        <View style={styles.container}>
          <Image
            source={require("../assets/signin.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formik.values.email}
            onChangeText={formik.handleChange("email")}
            onBlur={formik.handleBlur("email")}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={formik.values.password}
            onChangeText={formik.handleChange("password")}
            onBlur={formik.handleBlur("password")}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={formik.handleSubmit}>
            {isLoggingIn ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.buttonText}>   Login   </Text>
            )} 
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={() => navigation.navigate("ForgotPasswordScreen")}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => navigation.navigate("RegistrationScreen")}
          >
            <Text style={styles.signupButtonText}>Register</Text>
          </TouchableOpacity>
          
          
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#53B175",
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  logo: {
    position: 'absolute',
    top: 1,
    right: 0,
    left:8,
    width: 430,
    height: 370,
    resizeMode: 'cover',
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  orLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: "#53B175",
  },
  orText: {
    color: "#53B175",
    marginHorizontal: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  signupButton: {
    backgroundColor: "#cbf5d6",
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 10,
    marginTop: 10,
  },
  signupButtonText: {
    color: "#53B175",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  forgotPasswordButton: {
    position: "absolute",
    bottom: 145,
    right: 20,
  },
  forgotPasswordText: {
    color: "#53B175",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoginScreen;
