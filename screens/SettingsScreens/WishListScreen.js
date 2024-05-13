import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import { useCart } from "../../components/CartContext.js";
import { useNavigation } from "@react-navigation/native";

const WishlistScreen = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { cartItems, setCartItems } = useCart();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlistItemIds = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const response = await axios.get(
        `http://192.168.1.7:3000/api/wishlist/${userId}`
      );
      const wishlistItemIds = response.data.wishlistItems;

      //check if the wishlist is empty
      if (wishlistItemIds.length === 0) {
        setWishlistItems([]); //set wishlist items to an empty array
      } else {
        //fetch product details based on wishlist item IDs
        const productDetailsResponse = await axios.get(
          `http://192.168.1.7:3000/api/productWishList`,
          {
            params: { wishlistItemIds },
          }
        );

        setWishlistItems(productDetailsResponse.data);
        console.log(wishlistItems);
      }
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistItemIds();
  }, []);

  const navigateToProductDetails = (item) => {
    navigation.navigate("ProductDetails", { item });
  };

  const addToCart = (item) => {
    //check if the item is already in the cart
    const existingCartItem = cartItems.find(
      (cartItem) => cartItem.product_id === item.product_id
    );

    if (existingCartItem) {
      //if the item is already in the cart, update the quantity
      const updatedCartItems = cartItems.map((cartItem) =>
        cartItem.product_id === item.product_id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );

      setCartItems(updatedCartItems);
    } else {
      //if the item is not in the cart, add it with quantity 1
      const newItem = { ...item, quantity: 1 };
      setCartItems([...cartItems, newItem]);
    }
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productItemContainer}>
      <TouchableOpacity onPress={() => navigateToProductDetails(item)}>
        <View style={styles.productItem}>
          <Image
            source={{ uri: item.image_path }}
            style={styles.productImage}
          />
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={styles.productName}
          >
            {item.name}
          </Text>
          <Text style={styles.productPrice}>{item.price} USD</Text>
        </View>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => addToCart(item)}
        >
          <FontAwesome name="plus-circle" size={33} color="#5DADE2" />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchWishlistItemIds();
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ flexGrow: 1 }}
          data={wishlistItems}
          ListEmptyComponent={
            <View style={styles.loadingContainer}>
              <Text style={styles.emptyWishlistText}>
                Your wishlist is empty.
              </Text>
            </View>
          }
          renderItem={renderProductItem}
          keyExtractor={(item) => item.product_id.toString()}
          numColumns={2}
        />
      )}
    </View>
  );
};

const windowWidth = Dimensions.get("window").width;
const itemWidth = windowWidth / 2 - 20;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  productItemContainer: {
    flex: 1,
    alignItems: "center",
    margin: 10,
  },
  productItem: {
    width: itemWidth,
    backgroundColor: "white",
    alignItems: "center",
    padding: "7%",
    borderRadius: 20,
  },
  productImage: {
    width: 90,
    height: 90,
    alignSelf: "center",
    margin: "8%",
  },
  productName: {
    fontSize: 15,
    textAlign: "center",
    padding: "2%",
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
  },
  addToCartButton: {
    position: "absolute",
    top: 1,
    right: "2%",
  },
  emptyWishlistText: {
    fontSize: 18,
    textAlign: "center",
    color: "gray",
  },
});

export default WishlistScreen;
