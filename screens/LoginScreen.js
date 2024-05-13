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
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useFormik } from "formik";
/* import * as Yup from "yup";
 */ import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const navigation = useNavigation();
  const initialValues = {
    email: "",
    password: "",
  };

  const navigateToStore = () => {
    navigation.reset({ index: 0, routes: [{ name: "AppStack" }] });
  };

  /* const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  }); */

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
      const response = await fetch("http://192.168.1.7:3000/api/login", {
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
            "Contact us at SweetyCandy@support.com."
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
    /*     validationSchema,
     */ onSubmit: handleLogin, //use the handleLogin function to handle form submission
  });

  if (isLoggedIn) {
    //return null if the user is already logged in
    return null;
  }

  return (
    <ImageBackground
      source={require("../assets/candies.jpg")}
      imageStyle={{ resizeMode: "cover" }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={styles.container}
      >
        <Image
          source={require("../assets/logo.png")}
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
            <Text style={styles.buttonText}>Login</Text>
          )}
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
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  input: {
    width: "100%",
    height: "8%",
    borderWidth: 1,
    borderColor: "gray",
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 15,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#2980B9",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  /*   errorText: {
    color: "#ECF0F1",
    marginBottom: 5,
  }, */
  logo: {
    width: 270,
    height: 170,
    marginBottom: 70,
  },

  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  orLine: {
    flex: 1,
    height: 3,
    backgroundColor: "#2980B9",
  },
  orText: {
    color: "white",
    marginHorizontal: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  signupButton: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 10,
  },
  signupButtonText: {
    color: "#2980B9",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoginScreen;
