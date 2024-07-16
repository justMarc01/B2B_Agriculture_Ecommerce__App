import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Button,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OrdersScreen = ({ navigation, route }) => {
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setLoading] = useState(true);

  const fetchUserOrders = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");

      const response = await axios.get(
        `http://192.168.1.8:3000/api/user/orders/${userId}?status=${statusFilter}`
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() =>
        navigation.navigate("OrderDetails", {
          orderReceipt: item.order_receipt,
          orderId: item.order_id,
        })
      }
    >
      <Text
        style={styles.orderId}
      >{`Order Receipt: #${item.order_receipt}`}</Text>
      <Text>{`Date: ${new Date(item.order_date).toLocaleString()}`}</Text>
      <Text>{`Total Amount (Delivery included): $${item.total_amount.toFixed(
        2
      )}`}</Text>
      <Text>{`Status: ${item.order_status}`}</Text>
    </TouchableOpacity>
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserOrders();
    setRefreshing(false);
  }, [fetchUserOrders]);

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterButtonsContainer}>
        <Button
          title="All"
          onPress={() => handleStatusFilter("all")}
          color={statusFilter === "all" ? "#000000" : "#CCCCCC"}
        />
        <Button
          title="In Progress"
          onPress={() => handleStatusFilter("In progress")}
          color={statusFilter === "In progress" ? "#000000" : "#CCCCCC"}
        />
        <Button
          title="Completed"
          onPress={() => handleStatusFilter("Completed")}
          color={statusFilter === "Completed" ? "#000000" : "#CCCCCC"}
        />
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ flexGrow: 1 }}
          data={orders}
          ListEmptyComponent={
            <View style={styles.loadingContainer}>
              <Text style={styles.emptyOrdersText}>
                No Orders to display.
              </Text>
            </View>
          }
          keyExtractor={(item) => item.order_id.toString()}
          renderItem={renderOrderItem}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  filterButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  orderItem: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  orderId: {
    fontWeight: "bold",
  },
  emptyOrdersText: {
    fontSize: 18,
    textAlign: "center",
    color: "gray",
  },
});

export default OrdersScreen;
