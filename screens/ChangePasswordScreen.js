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

const ChangePasswordScreen = ({ navigation }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match", "Please make sure the passwords match.");
      return;
    }

    try {
      const response = await fetch('http://192.168.1.8:3000/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          new_password: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Password change failed');
      }

      navigation.navigate("LoginScreen");
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "An error occurred. Please try again later.");
    }
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
          <Text style={styles.title}>Change Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
            <Text style={styles.buttonText}>Change Password</Text>
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
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ChangePasswordScreen;