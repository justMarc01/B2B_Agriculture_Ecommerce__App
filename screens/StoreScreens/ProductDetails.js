import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  FlatList,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useCart } from "../../components/CartContext.js";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { StackActions } from "@react-navigation/native";

const ProductDetailsScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const { cartItems, setCartItems } = useCart();
  const [heartName, setHeartName] = useState("heart-o");
  const [moreFromCategory, setMoreFromCategory] = useState([]);
  const [isLoading, setLoading] = useState(true);

  //fetch user's wishlist items and check if the current item is in the wishlist and set the heart icon
  useEffect(() => {
    //function to fetch wishlist items for the current user
    const fetchWishlist = async () => {
      try {
        //get the user ID from AsyncStorage
        const userId = await AsyncStorage.getItem("userId");

        //make a request to the server to fetch the wishlist for the user
        const response = await axios.get(
          `http://192.168.1.7:3000/api/wishlist/${userId}`
        );

        //assuming the server responds with wishlist items in the response.data
        const fetchedWishlistItems = response.data.wishlistItems;

        //check if the item ID is in the wishlist
        const itemIdToCheck = item.product_id;
        const isItemInWishlist = fetchedWishlistItems.includes(itemIdToCheck);

        //update the heartName state based on whether the item is in the wishlist
        setHeartName(isItemInWishlist ? "heart" : "heart-o");
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    const fetchMoreFromCategory = async () => {
      try {
        const response = await axios.get(
          `http://192.168.1.7:3000/api/products/${item.category_id}`
        );
        setMoreFromCategory(response.data);
      } catch (error) {
        console.error("Error fetching more from category:", error);
      }
    };

    //call the fetchWishlist and fetchMoreFromCategory functions when the component mounts
    Promise.all([fetchWishlist(), fetchMoreFromCategory()])
      .then(() => {
        //set loading to false when both requests are completed
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error in Promise.all:", error);
        setLoading(false); //make sure to set loading to false in case of an error
      });
  }, [item.category_id]);

  const addRemoveWishlistItem = async () => {
    try {
      //get the user ID from AsyncStorage
      const userId = await AsyncStorage.getItem("userId");

      //make a request to the server to check and update the wishlist
      const response = await axios.post(
        `http://192.168.1.7:3000/api/wishlist/addRemove`,
        {
          userId,
          itemId: item.product_id,
        }
      );

      //check the response message to determine whether the item was added or removed
      const message = response.data.message;

      if (message === "Item added to the wishlist") {
        setHeartName("heart");
        ToastAndroid.showWithGravityAndOffset(
          "Item added to wishlist",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      } else if (message === "Item removed from the wishlist") {
        setHeartName("heart-o");
        ToastAndroid.showWithGravityAndOffset(
          "Item removed from wishlist",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
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

  const renderSimilarProducts = ({ item }) => (
    <TouchableOpacity
      style={styles.similarProductItem}
      onPress={() => {
        navigation.dispatch({
          ...StackActions.replace("ProductDetails", {
            item,
          }),
          source: route.key,
        });
      }}
    >
      <Image
        source={{ uri: item.image_path }}
        style={styles.similarProductImage}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={[{ item: item, moreFromCategory: moreFromCategory }]}
          renderItem={({ item }) => (
            <ScrollView>
              <View style={{ ...styles.container, padding: 16 }}>
                <Image
                  source={{ uri: item.item.image_path }}
                  style={styles.itemImage}
                />
                <Text style={styles.itemName}>{item.item.name}</Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.itemPrice}>
                    Price: {item.item.price} USD
                  </Text>
                  <TouchableOpacity onPress={addRemoveWishlistItem}>
                    <FontAwesome name={heartName} size={35} color="red" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={() => {
                    addToCart(item.item);
                  }}
                >
                  <Text style={styles.addToCartButtonText}>Add to Cart</Text>
                </TouchableOpacity>
                <View style={styles.similarProductContainer}>
                  <Text style={styles.similarProductTitle}>
                    Similar products
                  </Text>
                  <FlatList
                    data={item.moreFromCategory}
                    renderItem={renderSimilarProducts}
                    keyExtractor={(item) => item.product_id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              </View>
            </ScrollView>
          )}
          keyExtractor={(item, index) => index.toString()}
          numColumns={1}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").height,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemImage: {
    width: "100%",
    height: "50%",
    resizeMode: "cover",
    marginBottom: 10,
  },
  itemName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
  },
  addToCartButton: {
    backgroundColor: "#3498DB",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  addToCartButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  similarProductContainer: {
    paddingVertical: 20,
  },
  similarProductTitle: {
    fontSize: 15,
    marginBottom: 10,
    marginLeft: 10,
    fontWeight: "bold",
  },
  similarProductItem: {
    marginHorizontal: 7,
    alignItems: "center",
  },
  similarProductImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
});
export default ProductDetailsScreen;
