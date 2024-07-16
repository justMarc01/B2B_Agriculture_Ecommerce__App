import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
  ToastAndroid,
  ActivityIndicator,
  NativeModules,
  Alert,
} from "react-native";
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import AvatarModal from "../../components/AvatarModel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OverlayScreen from "../../components/OverlayScreen";

const SettingsScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userData, setUserData] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [logingout, setLogingout] = useState(false);

  const openWhatsApp = () => {
    const phoneNumber = "+961 81 953 573";
    const message =
      "Hello Mahsoulna Team! I have a question about your products.";
    const encodedMessage = encodeURIComponent(message);

    //create a WhatsApp deep link
    const whatsappLink = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;

    //check if WhatsApp is installed on the device
    Linking.canOpenURL(whatsappLink).then((supported) => {
      if (supported) {
        //open WhatsApp
        return Linking.openURL(whatsappLink);
      } else {
        console.error("WhatsApp is not installed on this device");
      }
    });
  };

  const fetchUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const response = await fetch(
        `http://192.168.1.8:3000/api/user/${userId}`
      );
      const data = await response.json();

      //update the component state with the user data
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user information:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  }, []);

  const handleLogout = async () => {
    try {
      Alert.alert(
        "Logout",
        "Are you sure you want to log out?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Logout",
            onPress: async () => {
              setLogingout(true);
              //clear the isLoggedIn state from AsyncStorage and reset the state to false
              await AsyncStorage.removeItem("isLoggedIn");
              await AsyncStorage.removeItem("userId");
              await AsyncStorage.removeItem("token");
              setIsLoggedIn(false);
              NativeModules.DevSettings.reload();
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setLogingout(false);
    }
  };
  const handleOpenTikTokPage = async () => {
    const tiktokURL = "https://www.tiktok.com/";
    const supported = await Linking.canOpenURL(tiktokURL);

    if (supported) {
      await Linking.openURL(tiktokURL);
    } else {
      console.log(`Cannot open URL: ${tiktokURL}`);
    }
  };

  const handleOpenInstagramPage = async () => {
    const instagramURL = "https://www.instagram.com/";
    const supported = await Linking.canOpenURL(instagramURL);

    if (supported) {
      await Linking.openURL(instagramURL);
    } else {
      console.log(`Cannot open URL: ${instagramURL}`);
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const onSelectAvatar = async (avatar) => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const response = await fetch(
        `http://192.168.1.8:3000/api/user/avatar/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ avatarBase64: avatar.avatar_base64 }),
        }
      );

      //handle the response as needed
      const result = await response.json();
      console.log(result);

      if (response) {
        closeModal();
        onRefresh();
      } else {
        ToastAndroid.showWithGravityAndOffset(
          "Failed to update image. Please try again.",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.profileContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <>
                <TouchableOpacity
                  style={styles.profileImageContainer}
                  onPress={openModal}
                >
                  <Image
                    source={{
                      uri: `data:image/png;base64,${userData.u_pp_base64}`,
                    }}
                    style={styles.profileImage}
                  />
                </TouchableOpacity>
                <AvatarModal
                  isVisible={modalVisible}
                  onSelectAvatar={onSelectAvatar}
                  closeModal={closeModal}
                />
                <Text style={styles.userName}>{userData.u_Fname}</Text>
                <Text style={styles.userLastName}>{userData.u_Lname}</Text>
              </>
            )}
          </View>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate("AccountScreen")}
          >
            <View style={styles.iconView}>
              <FontAwesome
                name="user-circle-o"
                size={20}
                style={{ paddingRight: "3%" }}
              />
              <Text style={styles.menuButtonText}>Account</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate("WishListScreen")}
          >
            <View style={styles.iconView}>
              <FontAwesome
                name="heart"
                size={20}
                color={"#E74C3C"}
                style={{ paddingRight: "3%" }}
              />
              <Text style={styles.menuButtonText}>Wish List</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={openWhatsApp}>
            <View style={styles.iconView}>
              <FontAwesome5
                name="whatsapp"
                size={20}
                color={"#2E4053"}
                style={{ paddingRight: "3%" }}
              />
              <Text style={styles.menuButtonText}>Contact Us</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate("AboutUsScreen")}
          >
            <View style={styles.iconView}>
              <Ionicons
                name="information-circle-outline"
                size={26}
                style={{ paddingRight: "2%" }}
              />
              <Text style={styles.menuButtonText}>About Us</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleOpenInstagramPage}
            >
              <FontAwesome
                name="instagram"
                size={40}
                color={"#E4405F"}
                style={{ verticalAlign: "middle", alignSelf: "center" }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleOpenTikTokPage}
            >
              <FontAwesome5
                name="facebook"
                size={35}
                style={{ verticalAlign: "middle", alignSelf: "center" }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.bottomContainer}>
            <TouchableOpacity
              style={styles.bottomButton}
              onPress={() => navigation.navigate("PrivacyPolicyScreen")}
            >
              <Text style={styles.bottomButtonText}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bottomButton}
              onPress={() => navigation.navigate("TandCScreen")}
            >
              <Text style={styles.bottomButtonText}>Terms and Conditions</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.logoutButton,
                logingout ? styles.disabledButton : null,
              ]}
              onPress={handleLogout}
              disabled={logingout}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      {logingout && <OverlayScreen />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    marginBottom: 5,
    marginTop: 5,
  },
  disabledButton: {
    backgroundColor: "gray",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  userName: {
    fontSize: 20,
  },
  userLastName: {
    fontSize: 18,
    color: "#777",
  },
  menuButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderBottomWidth: 3,
  },
  menuButtonText: {
    fontSize: 16,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 20,
  },
  socialButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 12,
    marginRight: 10,
    borderWidth: 1,
    borderBottomWidth: 3,
  },
  socialButtonText: {
    fontSize: 16,
    alignSelf: "center",
  },
  bottomContainer: {
    borderTopWidth: 1,
    borderTopColor: "#283747",
  },
  bottomButton: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomButtonText: {
    fontSize: 16,
    color: "#666666",
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#E74C3C",
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  iconView: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default SettingsScreen;
