import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Alert, ActivityIndicator } from "react-native";
import { useCart } from "../../components/CartContext";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const DEFAULT_LATITUDE = 33.8547;
const DEFAULT_LONGITUDE = 35.8623;

function generateRandomNumber() {
  const min = 1000000000;
  const max = 9999999999;

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const BillingShippingScreen = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isMapModalVisible, setMapModalVisible] = useState(false);
  const [manualSelectedLocation, setManualSelectedLocation] = useState(null);
  const [showManualMarker, setShowManualMarker] = useState(false);
  const [address, setAddress] = useState("");
  const [isOrderConfirmed, setOrderConfirmed] = useState(false);
  const [isBringChangeVisible, setBringChangeVisible] = useState(false);
  const { cartItems, setCartItems } = useCart();
  const [selectedChangeFor, setSelectedChangeFor] = useState(0);
  const [specialRequest, setSpecialRequest] = useState("");
  const [isSpecialRequestVisible, setSpecialRequestVisible] = useState(false);
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(false);
  const rand = generateRandomNumber();

  const closeBringChangeModal = (selectedChangeValue) => {
    setBringChangeVisible(false);
    setSelectedChangeFor(selectedChangeValue);
  };

  const calculateTotalPrice = (deliveryFee) => {
    const itemsTotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    return itemsTotal + deliveryFee;
  };

  const RequestPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        fetchCurrentLocation();
      }
    } catch (error) {
      console.log("Error while requesting location permission:", error);
    }
  };
  const fetchCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      setSelectedLocation(location.coords);
      setMapModalVisible(true);
      setManualSelectedLocation(null);
      setAddress("");
      setShowManualMarker(false);
    } catch (error) {
      console.log("Error while fetching current location:", error);
    }
  };

  const handleConfirmOrder = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem("userId");

      const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error("Request timeout"));
        }, 10000); //10 seconds timeout
      });

      const response = await Promise.race([
        fetch("http://192.168.1.8:3000/api/placeOrder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            userId: userId,
            orderReceipt: rand,
            cartItems: cartItems,
            totalAmount: calculateTotalPrice(3).toFixed(2),
            orderStatus: "In progress",
            location: {
              latitude: manualSelectedLocation
                ? manualSelectedLocation.latitude
                : selectedLocation.latitude,
              longitude: manualSelectedLocation
                ? manualSelectedLocation.longitude
                : selectedLocation.longitude,

              address: address,
            },
            changeFor: selectedChangeFor,

            specialReq: specialRequest,
          }),
        }),
        timeoutPromise,
      ]);

      if (response.ok) {
        //order placed successfully
        setOrderConfirmed(true);
        setCartItems([]);
      } else {
        const errorData = await response.json();
        Alert.alert("Order Error", errorData.error);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      if (error.message === "Request timeout") {
        Alert.alert("Network Error", "The request took too long to respond.");
      } else {
        Alert.alert(
          "Order Error",
          "An error occurred while placing your order."
        );
      }
    }
    setLoading(false);
  };
  const confirmLocation = async (location) => {
    try {
      setLoading(true);
      const locationInfo = await Location.reverseGeocodeAsync(location);

      if (locationInfo && locationInfo.length > 0) {
        const { street, city, region, country } = locationInfo[0];
        const formattedAddressParts = [];

        if (street) {
          formattedAddressParts.push(street);
        }
        if (city) {
          formattedAddressParts.push(city);
        }
        if (region) {
          formattedAddressParts.push(region);
        }
        if (country) {
          formattedAddressParts.push(country);
        }

        const formattedAddress = formattedAddressParts.join(", ");

        setAddress(formattedAddress);
      }

      setMapModalVisible(false);
    } catch (error) {
      console.log("Error while reverse geocoding:", error);
    } finally {
      setLoading(false);
    }
  };

  const onMapPress = (e) => {
    setManualSelectedLocation(e.nativeEvent.coordinate);
    setShowManualMarker(true);
    setSelectedLocation(null);
  };
  const handleCloseModal = () => {
    //reset the navigation stack to OrdersScreen
    navigation.reset({
      index: 0,
      routes: [{ name: "My Orders" }],
    });

    //close the modal
    setOrderConfirmed(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Delivery Address */}
      <Text style={styles.heading}>Delivery Address</Text>
      <Text>{address}</Text>
      <TouchableOpacity
        style={[styles.changeAddressButton, { marginTop: 10 }]}
        onPress={() => RequestPermission()}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons name="location-on" size={21} />
            <Text style={{ paddingLeft: "1%" }}>
              Allow access to your location
            </Text>
          </View>
          {selectedLocation && (
            <FontAwesome
              style={{ paddingHorizontal: "2%" }}
              name="check-circle-o"
              size={24}
              color="green"
            />
          )}
        </View>
      </TouchableOpacity>
      <Text style={{ textAlign: "center", fontSize: 15 }}>or</Text>
      <TouchableOpacity
        style={styles.changeAddressButton}
        onPress={() => setMapModalVisible(true)}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons name="location-off" size={21} />
            <Text style={{ paddingLeft: "1%" }}>Set your Address manually</Text>
          </View>
          {manualSelectedLocation && (
            <FontAwesome
              style={{ paddingHorizontal: "2%" }}
              name="check-circle-o"
              size={24}
              color="green"
            />
          )}
        </View>
      </TouchableOpacity>

      {/* Payment Method */}

      <Text style={styles.heading}>Payment Method</Text>
      <TouchableOpacity style={styles.paymentButton}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MaterialIcons name="payment" size={20} />
            <Text style={{ paddingLeft: "2%" }}>Pay with Cash</Text>
          </View>
          <FontAwesome
            style={{ paddingHorizontal: "2%" }}
            name="check-circle-o"
            size={24}
            color="green"
          />
        </View>
      </TouchableOpacity>

      {/* More Options */}
      <Text style={styles.heading}>More Options</Text>
      <TouchableOpacity
        style={styles.moreOptionsButton}
        onPress={() => setBringChangeVisible(true)}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Feather name="dollar-sign" size={20} />
            <Text style={{ paddingLeft: "1%" }}>Bring Change For...</Text>
          </View>

          <Text>{selectedChangeFor}.00 $</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.moreOptionsButton}
        onPress={() => setSpecialRequestVisible(true)}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row" }}>
            <FontAwesome name="file-text-o" size={20} color="black" />
            <Text style={{ paddingHorizontal: "2%" }}>Special Request</Text>
          </View>
          {specialRequest && (
            <FontAwesome
              style={{ paddingHorizontal: "2%" }}
              name="check-circle-o"
              size={24}
              color="green"
            />
          )}
        </View>
        <Modal
          visible={isSpecialRequestVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setSpecialRequestVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={{ fontSize: 18, paddingBottom: "3%" }}>
                Special Request
              </Text>
              <TextInput
                style={styles.specialRequestInputModal}
                multiline
                placeholder="Enter your special request here..."
                value={specialRequest}
                onChangeText={(text) => setSpecialRequest(text)}
              />

              <TouchableOpacity
                style={[
                  styles.closeButton,
                  (style = { backgroundColor: "#27AE60" }),
                ]}
                onPress={() => {
                  setSpecialRequestVisible(false);
                }}
              >
                <Text>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </TouchableOpacity>

      {/* Order Summary */}
      <View style={styles.orderSummaryBox}>
        <Text style={styles.heading}>Order Summary</Text>
        <View style={styles.separator} />
        <View style={styles.orderSummaryItem}>
          <Text style={styles.summaryLabelText}>Delivery Fee:</Text>
          <Text style={styles.summaryValueText}>3.00 USD</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.orderSummaryItem}>
          <Text style={styles.summaryLabelText}>Order Price:</Text>
          <Text style={styles.summaryValueText}>
            {calculateTotalPrice(0).toFixed(2)} USD
          </Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.orderSummaryItem}>
          <Text style={styles.summaryLabelText}>Total Price:</Text>
          <Text style={[styles.summaryValueText, styles.priceToRight]}>
            {calculateTotalPrice(3).toFixed(2)} USD
          </Text>
        </View>
      </View>

      {/* Confirm Order Button */}
      <TouchableOpacity
        style={[
          styles.confirmOrderButton,
          cartItems.length === 0 && styles.disabledButton,
          isLoading && styles.disabledButton,
        ]}
        onPress={() => {
          if (!manualSelectedLocation && !selectedLocation) {
            Alert.alert("Please add your location");
          } else {
            handleConfirmOrder();
          }
        }}
        disabled={cartItems.length === 0 || isLoading} //disable the button if any is true
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={{ fontSize: 18, color: "white" }}>Confirm Order</Text>
        )}
      </TouchableOpacity>
      {/* Modal for order confirmation message */}
      <Modal
        visible={isOrderConfirmed}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setOrderConfirmed(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Congratulations!</Text>
            <Text style={[styles.modalText, (style = { marginBottom: 10 })]}>
              Your order has been successfully placed.
            </Text>
            <Text style={[styles.modalText, (style = { marginBottom: 10 })]}>
              Time to patiently wait for the deliciousness! 🍩🍭🍫
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Map Modal */}
      <Modal
        visible={isMapModalVisible}
        animationType="slide"
        onRequestClose={() => setMapModalVisible(false)}
      >
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: selectedLocation
                ? selectedLocation.latitude
                : DEFAULT_LATITUDE,
              longitude: selectedLocation
                ? selectedLocation.longitude
                : DEFAULT_LONGITUDE,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={onMapPress}
          >
            {manualSelectedLocation && showManualMarker && (
              <Marker
                coordinate={{
                  latitude: manualSelectedLocation.latitude,
                  longitude: manualSelectedLocation.longitude,
                }}
              />
            )}
            {selectedLocation && !showManualMarker && (
              <Marker
                coordinate={{
                  latitude: selectedLocation.latitude,
                  longitude: selectedLocation.longitude,
                }}
              />
            )}
          </MapView>
          <TouchableOpacity
            style={[
              styles.confirmLocationButton,
              isLoading && styles.disabledButton,
            ]}
            onPress={() => {
              if (manualSelectedLocation) {
                confirmLocation(manualSelectedLocation);
              } else if (selectedLocation) {
                confirmLocation(selectedLocation);
              } else Alert.alert("Please add your location");
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={{ fontSize: 18, color: "white" }}>
                Confirm Location
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </Modal>
      {/* Bring Change Modal */}
      <Modal
        visible={isBringChangeVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {generateMoreOptionsButtons(closeBringChangeModal)}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const generateMoreOptionsButtons = (closeModalCallback) => {
  const [selectedChangeFor, setChangeFor] = useState(0);

  const buttonsData = [
    { label: "5.00 $", value: 5 },
    { label: "10.00 $", value: 10 },
    { label: "20.00 $", value: 20 },
    { label: "50.00 $", value: 50 },
    { label: "100.00 $", value: 100 },
    { label: "None", value: 0 },
  ];

  const handleButtonPress = (value) => {
    setChangeFor(value);
    closeModalCallback(value);
  };

  const buttons = [];
  for (let i = 0; i < buttonsData.length; i++) {
    const button = buttonsData[i];

    buttons.push(
      <View key={i}>
        <TouchableOpacity
          style={[
            styles.moreOptionsButton,
            selectedChangeFor === button.value && styles.selectedChangeButton,
          ]}
          onPress={() => handleButtonPress(button.value)}
        >
          <Text style={styles.changeButtonText}>
            {button.value === 0 ? "None" : `$${button.value.toFixed(2)}`}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  return buttons;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    paddingBottom: 5,
    marginTop: "5%",
  },
  changeAddressButton: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    borderRadius: 5,
  },
  paymentButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    borderRadius: 5,
  },
  moreOptionsButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    borderRadius: 5,
  },
  confirmOrderButton: {
    marginTop: "3%",
    marginBottom: "3%",
    backgroundColor: "#2980B9",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  map: {
    flex: 1,
    height: 300,
    width: "100%",
  },
  mapContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmLocationButton: {
    marginTop: 5,
    backgroundColor: "#2980B9",
    paddingHorizontal: "30%",
    paddingVertical: "5%",
    alignItems: "center",
    borderRadius: 10,
  },
  orderSummaryBox: {
    backgroundColor: "#f4f4f4",
    padding: 15,
    borderRadius: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  orderSummaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabelText: {
    fontSize: 16,
  },
  summaryValueText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  priceToRight: {
    textAlign: "right",
  },
  disabledButton: {
    backgroundColor: "gray",
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
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#2980B9",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  selectedChangeButton: {
    backgroundColor: "#2980B9",
  },
  changeButtonText: {
    fontSize: 16,
    color: "#333",
  },
  specialRequestInputModal: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: "2%",
    height: 120,
    textAlignVertical: "top",
  },
});

export default BillingShippingScreen;
