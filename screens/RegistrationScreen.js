import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import DatePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { ImageBackground } from "react-native";
import { FontAwesome, Fontisto } from "@expo/vector-icons";

const genders = ["Male", "Female"];

const RegistrationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  gender: Yup.string().required("Gender is required"),
  selectedDate: Yup.date().required("Date of birth is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const RegistrationScreen = ({ navigation }) => {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isRegistring, setIsRegistring] = useState(false);

  const handleDateConfirm = (event, date) => {
    if (date !== undefined) {
      hideDatePicker();
      setSelectedDate(date);
    }
    console.log(selectedDate.toDateString());
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
    console.log(selectedDate.toDateString());
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleRegistration = async (values) => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    const userData = {
      ...values,
      selectedDate: formattedDate,
    };

    try {
      setIsRegistring(true);
      const response = await fetch(`http://192.168.1.8:3000/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        Alert.alert("Success!", "Registration completed successfully!", [
          {
            text: "OK",
            onPress: () => navigation.navigate("LoginScreen"),
          },
        ]);
      } else {
        Alert.alert("Registration failed!", "User already exists.");
      }
    } catch (error) {
      console.error("Error registering user:", error);
    } finally {
      setIsRegistring(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/white-background.jpg")}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Image
            source={require("../assets/signin.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              selectedDate: selectedDate,
              gender: "",
              phoneNumber: "",
              email: "",
              password: "",
            }}
            validationSchema={RegistrationSchema}
            onSubmit={handleRegistration}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={styles.formContainer}>
                <Text style={styles.title}>Personal Information</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderWidth: 1,
                      borderColor:
                        touched.firstName && errors.firstName
                          ? "#CB4335"
                          : "#ccc",
                    },
                  ]}
                  onChangeText={handleChange("firstName")}
                  onBlur={handleBlur("firstName")}
                  value={values.firstName}
                  placeholder={
                    touched.firstName && errors.firstName
                      ? errors.firstName
                      : "First Name"
                  }
                  placeholderTextColor={
                    touched.firstName && errors.firstName
                      ? "#CB4335"
                      : "#979A9A"
                  }
                />
                <TextInput
                  style={[
                    styles.input,
                    (style = {
                      borderWidth: 1,
                      borderColor:
                        touched.lastName && errors.lastName
                          ? "#CB4335"
                          : "#ccc",
                    }),
                  ]}
                  onChangeText={handleChange("lastName")}
                  onBlur={handleBlur("lastName")}
                  value={values.lastName}
                  placeholder={
                    touched.lastName && errors.lastName
                      ? errors.lastName
                      : "Last Name"
                  }
                  placeholderTextColor={
                    touched.lastName && errors.lastName ? "#CB4335" : "#979A9A"
                  }
                />
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    marginBottom: 10,
                    padding: 10,
                    borderRadius: 5,
                  }}
                  onPress={showDatePicker}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FontAwesome name="calendar" size={24} />

                    <Text style={{ marginLeft: "2%" }}>
                      {selectedDate.toDateString() === new Date().toDateString()
                        ? " Date of Birth"
                        : selectedDate.toDateString()}
                    </Text>
                  </View>
                </TouchableOpacity>

                {isDatePickerVisible && (
                  <DatePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={handleDateConfirm}
                  />
                )}
                <View
                  style={{
                    borderWidth: 1,
                    borderColor:
                      touched.gender && errors.gender ? "#CB4335" : "#ccc",
                    marginBottom: 10,
                    borderRadius: 5,
                  }}
                >
                  <Picker
                    selectedValue={values.gender}
                    onValueChange={handleChange("gender")}
                  >
                    <Picker.Item
                      style={{
                        fontSize: 15,
                        color: "lightblack",
                      }}
                      label="Select Gender"
                      value=""
                    />
                    {genders.map((gender, index) => (
                      <Picker.Item key={index} label={gender} value={gender} />
                    ))}
                  </Picker>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor:
                      touched.phoneNumber && errors.phoneNumber
                        ? "#CB4335"
                        : "#ccc",
                  }}
                >
                  <FontAwesome
                    name="mobile-phone"
                    size={29}
                    style={{ marginLeft: "3%" }}
                  />

                  <TextInput
                    style={{
                      padding: "4%",
                      marginLeft: "2%",
                      flex: 1,
                    }}
                    onChangeText={handleChange("phoneNumber")}
                    onBlur={handleBlur("phoneNumber")}
                    value={values.phoneNumber}
                    keyboardType="numeric"
                    placeholder={
                      touched.phoneNumber && errors.phoneNumber
                        ? errors.phoneNumber
                        : "Phone Number"
                    }
                    placeholderTextColor={
                      touched.phoneNumber && errors.phoneNumber
                        ? "#CB4335"
                        : "#979A9A"
                    }
                  />
                </View>

                <Text style={[styles.title, (style = { marginTop: "3%" })]}>
                  Account Information
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor:
                      touched.email && errors.email ? "#CB4335" : "#ccc",
                  }}
                >
                  <Fontisto
                    name="email"
                    size={24}
                    style={{ marginLeft: "3%" }}
                  />
                  <TextInput
                    style={{
                      padding: "4%",
                      marginLeft: "2%",
                      flex: 1,
                    }}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    placeholder={
                      touched.email && errors.email ? errors.email : "Email"
                    }
                    placeholderTextColor={
                      touched.email && errors.email ? "#CB4335" : "#979A9A"
                    }
                  />
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor:
                      touched.password && errors.password ? "#CB4335" : "#ccc",
                    marginTop: 10,
                  }}
                >
                  <Fontisto
                    name="locked"
                    size={24}
                    style={{ marginLeft: "3%" }}
                  />
                  <TextInput
                    style={{
                      padding: "4%",
                      marginLeft: "2%",
                      flex: 1,
                    }}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    placeholder={
                      touched.password && errors.password
                        ? errors.password
                        : "Password"
                    }
                    placeholderTextColor={
                      touched.password && errors.password
                        ? "#CB4335"
                        : "#979A9A"
                    }
                    secureTextEntry
                  />
                </View>
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={handleSubmit}
                  title="Register"
                >
                  {isRegistring ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={{ fontWeight: "bold", color: "white" }}>
                      Register
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 17,
    marginBottom: "3%",
  },
  formContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#ffffff",
  },
  input: {
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  registerButton: {
    marginTop: 10,
    backgroundColor: "#53B175",
    paddingHorizontal: "30%",
    paddingVertical: "5%",
    alignItems: "center",
    borderRadius: 10,
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
});

export default RegistrationScreen;
