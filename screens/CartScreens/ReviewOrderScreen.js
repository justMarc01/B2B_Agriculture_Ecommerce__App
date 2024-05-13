import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useCart } from "../../components/CartContext";

const ReviewOrderScreen = ({ navigation }) => {
  const { cartItems } = useCart();
  const [isLoading, setLoading] = useState(false);

  const navigateToBilling = () => {
    setLoading(true);
    navigation.navigate("BillingShippingScreen");
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setLoading(false);
    });

    return unsubscribe;
  }, [navigation]);

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Text>{item.name}</Text>
      <Text>Quantity: {item.quantity}</Text>
      <Text>Price: ${item.price}</Text>
      <Text>
        Price for {item.quantity}: $
        {parseFloat(item.price * item.quantity).toFixed(2)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.product_id.toString()}
      />
      <View style={styles.checkoutContainer}>
        <TouchableOpacity
          style={[
            styles.checkoutButton,
            cartItems.length === 0 && styles.disabledButton,
            isLoading,
          ]}
          onPress={() => navigateToBilling()}
          disabled={cartItems.length === 0 || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <>
              <Text style={styles.checkoutButtonText}>Proceed to Shipping</Text>
              <Text style={styles.checkoutButtonText}>
                Total: ${calculateTotalPrice().toFixed(2)}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  cartItem: {
    borderWidth: 1,
    borderColor: "grey",
    padding: 10,
    marginBottom: 10,
  },
  checkoutContainer: {
    borderTopWidth: 1,
    paddingTop: 20,
  },
  checkoutButton: {
    backgroundColor: "#2980B9",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 15,
  },
  checkoutButtonText: {
    color: "white",
    fontSize: 18,
    marginBottom: 5,
  },
  disabledButton: {
    backgroundColor: "gray",
  },
});

export default ReviewOrderScreen;
