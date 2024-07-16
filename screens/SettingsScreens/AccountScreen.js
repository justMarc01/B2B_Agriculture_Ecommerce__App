import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Alert,
  NativeModules,
} from "react-native";
import { FontAwesome, Fontisto } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OverlayScreen from "../../components/OverlayScreen";

const LabeledText = ({
  label,
  value,
  icon,
  size,
  fontistoIcon,
  fontistoSize,
}) => {
  return (
    <View>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.input}>
        {icon && <FontAwesome name={icon} size={size} color="#888" />}
        {fontistoIcon && (
          <Fontisto name={fontistoIcon} size={fontistoSize} color="#888" />
        )}
        <Text style={{ marginLeft: 10 }}>{value}</Text>
      </View>
    </View>
  );
};

const AccountScreen = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isChangePasswordModalVisible, setChangePasswordModalVisible] =
    useState(false);
  const [password, setPassword] = useState("******");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isNewPasswordVisible, setNewPasswordVisible] = useState(false);
  const [isOldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingDisable, setLoadingDisable] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");

      if (userId) {
        const response = await fetch(
          `http://192.168.1.8:3000/api/user/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        const dateOfBirthString = data.date_of_birth;
        const dateOfBirth = new Date(dateOfBirthString);
        const options = { year: "numeric", month: "long", day: "numeric" };
        const formattedDate = dateOfBirth.toLocaleDateString("en-US", options);

        setUser({ ...data, date_of_birth: formattedDate });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsLoading(false);
    }
  };
  const handleOpenChangePasswordModal = () => {
    setChangePasswordModalVisible(true);
  };

  const handleCloseChangePasswordModal = () => {
    setChangePasswordModalVisible(false);
    setNewPassword("");
    setOldPassword("");
  };

  const handleChangePassword = async () => {
    try {
      setLoadingPassword(true);
      const userId = await AsyncStorage.getItem("userId");

      //send a request to the server to change the password
      const response = await axios.put(
        "http://192.168.1.8:3000/api/changePassword",
        {
          userId,
          oldPassword,
          newPassword,
        }
      );

      //check if the password was updated successfully
      if (response.data.message === "Password changed successfully") {
        //show success alert
        Alert.alert("Success", "Password changed successfully", [
          { text: "OK", onPress: handleCloseChangePasswordModal },
        ]);
      } else {
        //show an alert for unexpected response
        Alert.alert("Error", "Unexpected response from the server");
      }
    } catch (error) {
      //handle errors and show appropriate alerts
      if (error.response && error.response.status === 400) {
        //incorrect old password
        Alert.alert("Error", "Invalid old password");
      } else {
        console.error("Error changing password:", error.message);
        Alert.alert("Error", "An error occurred while changing the password");
      }
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleDisableAccount = () => {
    Alert.alert("Disable Account", "We are sad to see you leave 😞", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Disable",
        style: "destructive",
        onPress: performDisableAccount,
      },
    ]);
  };

  const performDisableAccount = async () => {
    try {
      setLoadingDisable(true);
      const userId = await AsyncStorage.getItem("userId");
      const response = await axios.post(
        "http://192.168.1.8:3000/disableAccount",
        {
          userId: userId,
        }
      );
      //clear the isLoggedIn state from AsyncStorage and reset the state to false
      await AsyncStorage.removeItem("isLoggedIn");
      await AsyncStorage.removeItem("userId");
      await AsyncStorage.removeItem("token");
      setIsLoggedIn(false);
      NativeModules.DevSettings.reload();

      console.log(response.data.message);
    } catch (error) {
      console.error("Error disabling account:", error.message);
    }
  };

  return (
    <>
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              <LabeledText
                label="First Name"
                value={user.u_Fname || ""}
                icon="user-circle-o"
                size={24}
              />
              <LabeledText
                label="Last Name"
                value={user.u_Lname || ""}
                icon="user-circle-o"
                size={24}
              />
              <LabeledText label="Gender" value={user.gender || ""} />

              <LabeledText
                label="Date of Birth"
                value={user.date_of_birth || ""}
                icon="calendar"
                size={24}
              />

              <LabeledText
                label="Phone Number"
                value={user.u_phone || ""}
                icon="mobile-phone"
                size={30}
              />
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account Information</Text>
              <LabeledText
                label="Email"
                value={user.email}
                placeholder={"Email Address"}
                fontistoIcon="email"
                fontistoSize={20}
              />
              <LabeledText
                label="Password"
                value={password}
                editable={false}
                icon="lock"
                size={24}
              />
              <TouchableOpacity onPress={handleOpenChangePasswordModal}>
                <Text
                  style={{
                    color: "#2874A6",
                    fontWeight: "bold",
                    alignSelf: "flex-end",
                  }}
                >
                  Change
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                title="Disable Account"
                onPress={handleDisableAccount}
                style={[
                  styles.disableAccountButton,
                  loadingDisable && styles.disabledButton,
                ]}
                disabled={loadingDisable}
              >
                <Text style={{ color: "white", fontSize: 20 }}>
                  Disable Account
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={isChangePasswordModalVisible}
          onRequestClose={handleCloseChangePasswordModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={{ flex: 1 }}
                  placeholder="Old Password"
                  secureTextEntry={!isOldPasswordVisible}
                  value={oldPassword}
                  onChangeText={setOldPassword}
                />
                <TouchableOpacity
                  onPress={() => setOldPasswordVisible(!isOldPasswordVisible)}
                  style={styles.togglePasswordButton}
                >
                  <FontAwesome
                    name={isOldPasswordVisible ? "eye" : "eye-slash"}
                    size={20}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={{ flex: 1 }}
                  placeholder="New Password"
                  secureTextEntry={!isNewPasswordVisible}
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity
                  onPress={() => setNewPasswordVisible(!isNewPasswordVisible)}
                  style={styles.togglePasswordButton}
                >
                  <FontAwesome
                    name={isNewPasswordVisible ? "eye" : "eye-slash"}
                    size={20}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={handleChangePassword}
                style={[
                  styles.submitButton,
                  loadingPassword || !newPassword
                    ? styles.disabledButton
                    : null,
                ]}
                disabled={loadingPassword || !newPassword}
              >
                {loadingPassword ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={{ color: "white" }}>Change</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCloseChangePasswordModal}
                style={styles.closeButton}
              >
                <Text style={{ color: "#2980B9" }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      {loadingDisable && <OverlayScreen />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "gray",
  },
  section: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
    marginLeft: "1%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#FBFCFC",
    flexDirection: "row",
    alignItems: "center",
  },
  passwordIcon: {
    padding: 10,
  },
  disableAccountButton: {
    backgroundColor: "#CB4335",
    paddingVertical: "5%",
    alignItems: "center",
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  passwordInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 5,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    padding: "1%",
  },
  togglePasswordButton: {
    padding: 10,
  },
  submitButton: {
    backgroundColor: "#2980B9",
    paddingHorizontal: "30%",
    paddingVertical: "5%",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
  },
  closeButton: {
    borderColor: "#2980B9",
    borderWidth: 1,
    paddingHorizontal: "30%",
    paddingVertical: "5%",
    alignItems: "center",
    borderRadius: 10,
  },

  iconView: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default AccountScreen;
