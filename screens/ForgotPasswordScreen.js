import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleResetPassword = async () => {
    try {
      const response = await fetch('http://192.168.1.8:3000/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      // Log the response before parsing
      console.log('Response:', response);

      // Check if the response status indicates success
      if (response.ok) {
        const data = await response.json();
        Alert.alert("Password Reset Request", `A verification code has been sent to ${email}. Please check your inbox.`);
        // Navigate to CodeScreen after sending reset password request
        navigation.navigate("CodeScreen", { email: email });
      } else {
        // Handle different error status codes
        if (response.status === 404) {
          Alert.alert("Error", "Email not found. Please check the email address and try again.");
        } else {
          Alert.alert("Error", "An error occurred. Please try again later.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "An error occurred. Please try again later.");
    }
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    setIsButtonDisabled(text === "");
  };

  return (
    <ImageBackground
      source={require("../assets/white-background.jpg")}
      imageStyle={{ resizeMode: "cover" }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Forgot Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
            onPress={handleResetPassword}
            disabled={isButtonDisabled}
          >
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </View>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#53B175",
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 10,
  },
  buttonDisabled: {
    backgroundColor: "#A5D6A7",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ForgotPasswordScreen;

