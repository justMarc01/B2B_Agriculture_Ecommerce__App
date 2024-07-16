import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useCart } from "../../components/CartContext.js";
import Icon from "react-native-vector-icons/FontAwesome";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";

const CartScreen = ({ navigation }) => {
  const { cartItems, setCartItems } = useCart();
  const [isLoading, setLoading] = useState(false);

  const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
      const updatedCart = cartItems.map((cartItem) =>
        cartItem.product_id === item.product_id
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      );
      setCartItems(updatedCart);
    } else {
      const updatedCart = cartItems.filter(
        (cartItem) => cartItem.product_id !== item.product_id
      );
      setCartItems(updatedCart);
    }
  };

  const increaseQuantity = (item) => {
    const updatedCart = cartItems.map((cartItem) =>
      cartItem.product_id === item.product_id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
    setCartItems(updatedCart);
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setLoading(false); //reset isLoading when the screen gains focus
    });

    return unsubscribe;
  }, [navigation]);

  const navigateToReceipt = () => {
    setLoading(true);
    navigation.navigate("ReviewOrderScreen");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.itemContainer}
        showsVerticalScrollIndicator={false}
      >
        {cartItems.length === 0 ? (
          <View style={styles.emptyCart}>
            <MCIcon name="cart-variant" size={90} color="#53B175" />
            <Text style={styles.emptyCartText}>Your cart is lonely!</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("StoreTab")}
            >
              <Text style={styles.buttonText}>Shop now</Text>
            </TouchableOpacity>
          </View>
        ) : (
          cartItems.map((item) => (
            <View key={item.product_id} style={styles.cartItem}>
              <Image
                source={{ uri: item.image_path }}
                style={styles.itemImage}
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${item.price}</Text>
                <View style={styles.quantityControls}>
                  {item.quantity > 1 ? (
                    <TouchableOpacity onPress={() => decreaseQuantity(item)}>
                      <Icon name="minus-circle" size={25} color="#EC7063" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => decreaseQuantity(item)}>
                      <Icon name="trash" size={25} color="#EC7063" />
                    </TouchableOpacity>
                  )}
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => increaseQuantity(item)}>
                    <Icon name="plus-circle" size={25} color="#53B175" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <View style={styles.checkoutContainer}>
        <TouchableOpacity
          style={[
            styles.checkoutButton,
            cartItems.length === 0 && styles.disabledButton,
            isLoading,
          ]}
          onPress={() => navigateToReceipt()}
          disabled={cartItems.length === 0 || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <>
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
              <Text style={styles.totalPrice}>
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
  itemContainer: {
    flex: 1,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingVertical: 8,
    borderBottomWidth: 7,
    borderBottomColor: "#EAEDED",
  },
  itemImage: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    color: "gray",
    marginBottom: 5,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  quantity: {
    fontSize: 20,
    paddingHorizontal: 10,
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
  totalPrice: {
    fontSize: 16,
    color: "white",
  },
  disabledButton: {
    backgroundColor: "gray",
  },
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: "35%",
  },
  emptyCartText: {
    marginTop: 10,
    fontSize: 25,
    color: "gray",
  },

  buttonText: {
    color: "#2980B9",
    marginTop: "9%",
    fontSize: 18,
  },
});

export default CartScreen;
