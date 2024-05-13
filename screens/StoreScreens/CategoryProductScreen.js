import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "../../components/CartContext.js";

const CategoryProductScreen = ({ route }) => {
  const { categoryId } = route.params;
  const { categoryName } = route.params;
  const [categoryProducts, setCategoryProducts] = useState([]);
  const { cartItems, setCartItems } = useCart();
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    //fetch products of the selected category from the database
    axios
      .get(`http://192.168.1.7:3000/api/products/${categoryId}`)
      .then((response) => {
        setCategoryProducts(response.data);
      })
      .catch((error) => {
        console.error(error);
        Alert.alert(
          "Error",
          "There was an error loading product, please make sure you are connected to the internet and try again."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoryId]);

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

  const navigateToProductDetails = (item) => {
    navigation.navigate("ProductDetails", { item });
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

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={categoryProducts}
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
    borderRadius: 10,
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
});

export default CategoryProductScreen;
