import React, { useState, useEffect } from "react";
import { useRoute } from '@react-navigation/native';
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

const CodeScreen = ({ navigation }) => {
  const [code, setCode] = useState("");
  const route = useRoute();
  const email = route.params.email;
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer === 1) {
          setIsResendDisabled(false);
        }
        return prevTimer === 0 ? 0 : prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVerifyCode = async () => {
    try {
      const response = await fetch('http://192.168.1.8:3000/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, code: code }),
      });

      const responseBody = await response.text(); // Get response body as text

      console.log('Response:', responseBody); // Log the response body

      const data = JSON.parse(responseBody); // Parse response body as JSON

      if (response.ok) {
        if (data.success) {
          navigation.navigate("ChangePasswordScreen", { email: email });
        } else {
          Alert.alert("Error", "Incorrect verification code. Please try again.");
          setCode("");
        }
      } else {
        Alert.alert("Error", data.error || "An error occurred. Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "An error occurred. Please try again later.");
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await fetch('http://192.168.1.8:3000/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "A new verification code has been sent to your email.");
        setTimer(60);
        setIsResendDisabled(true);
      } else {
        Alert.alert("Error", data.error || "An error occurred. Please try again later.");
      }
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
          <Text style={styles.title}>Enter Verification Code</Text>
          <Text style={styles.timer}>{timer > 0 ? `Time remaining: ${timer} seconds` : 'Code expired'}</Text>
          <View style={styles.codeContainer}>
            <TextInput
              style={styles.input}
              maxLength={1}
              value={code[0]}
              onChangeText={(text) => setCode(text + code.slice(1))}
              keyboardType="number-pad"
            />
            <TextInput
              style={styles.input}
              maxLength={1}
              value={code[1]}
              onChangeText={(text) => setCode(code.slice(0, 1) + text + code.slice(2))}
              keyboardType="number-pad"
            />
            <TextInput
              style={styles.input}
              maxLength={1}
              value={code[2]}
              onChangeText={(text) => setCode(code.slice(0, 2) + text + code.slice(3))}
              keyboardType="number-pad"
            />
            <TextInput
              style={styles.input}
              maxLength={1}
              value={code[3]}
              onChangeText={(text) => setCode(code.slice(0, 3) + text)}
              keyboardType="number-pad"
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
            <Text style={styles.buttonText}>Verify Code</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.resendButton, isResendDisabled && styles.buttonDisabled]} 
            onPress={handleResendCode} 
            disabled={isResendDisabled}
          >
            <Text style={styles.buttonText}>Resend Code</Text>
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
  timer: {
    fontSize: 16,
    marginBottom: 10,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  input: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 12,
    marginRight: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#53B175",
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  resendButton: {
    backgroundColor: "#0000FF",
  },
  buttonDisabled: {
    backgroundColor: "#a9a2f2",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CodeScreen;
