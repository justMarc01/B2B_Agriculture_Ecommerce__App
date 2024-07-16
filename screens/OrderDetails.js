import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";

const OrderDetails = ({ route }) => {
  const [orders, setOrders] = useState([]);
  const { orderId } = route.params;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.8:3000/api/order/items/${orderId}`
      );

      if (!response.ok) {
        console.error("Error fetching orders. Response:", response);
        throw new Error("Failed to fetch orders");
      }

      const orderData = await response.json();

      //parse the ordered_products JSON string into a JavaScript object
      const parsedData = JSON.parse(orderData[0].ordered_products);

      //convert the parsedData object to an array
      const orderArray = Object.values(parsedData);

      setOrders(orderArray);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image_path }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.pricePerUnit}>Price per unit: ${item.price}</Text>
        <Text style={styles.totalPrice}>
          Total price for {item.quantity}: ${item.price * item.quantity}
        </Text>
      </View>
    </View>
  );

  return (
    <View>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  itemContainer: {
    flexDirection: "row",
    padding: 16,
    borderBottomColor: "#ccc",
    borderBottomWidth: 2,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  pricePerUnit: {
    fontSize: 14,
    color: "gray",
  },
  totalPrice: {
    fontSize: 14,
    color: "green",
  },
});

export default OrderDetails;
