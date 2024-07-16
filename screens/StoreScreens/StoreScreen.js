import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";

const StoreScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    //fetch categories from the database
    axios
      .get("http://192.168.1.8:3000/api/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error(error);
        Alert.alert(
          "Error",
          "There was an error loading categories, please make sure you are connected to the internet and try again."
        );
      });

    //fetch recently added items
    axios
      .get("http://192.168.1.8:3000/api/recentlyAddedItems")
      .then((response) => {
        setRecentlyAdded(response.data);
      })
      .catch((error) => {
        console.error(error);
        Alert.alert(
          "Error",
          "There was an error loading recently added items, please try again."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const numColumns = 2;
  const screenWidth = Dimensions.get("window").width;
  const itemWidth = screenWidth / numColumns;

  const renderRecentlyAddedItem = ({ item }) => (
    <TouchableOpacity
      style={styles.recentlyAddedItem}
      onPress={() =>
        navigation.navigate("ProductDetails", {
          item,
        })
      }
    >
      <Image
        source={{ uri: item.image_path }}
        style={styles.recentlyAddedImage}
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
          data={[...categories, { recentlyAdded: true, items: recentlyAdded }]}
          renderItem={({ item }) =>
            item.recentlyAdded ? (
              <View style={styles.recentlyAddedContainer}>
                <Text style={styles.recentlyAddedTitle}>Recently Added</Text>
                <FlatList
                  data={item.items}
                  renderItem={renderRecentlyAddedItem}
                  keyExtractor={(item) => item.product_id.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.categoryItem, { width: itemWidth }]}
                onPress={() =>
                  navigation.navigate("CategoryProduct", {
                    categoryId: item.category_id,
                    categoryName: item.category_name,
                  })
                }
              >
                <Image
                  source={{ uri: item.image_path }}
                  style={styles.categoryImage}
                />
                <Text style={styles.categoryName}>{item.category_name}</Text>
              </TouchableOpacity>
            )
          }
          keyExtractor={(item, index) =>
            item.recentlyAdded ? "recentlyAdded" : index.toString()
          }
          numColumns={numColumns}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: Dimensions.get("window").height,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryItem: {
    paddingTop: 20,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  categoryImage: {
    width: 140,
    height: 140,
    borderRadius: 10,
  },
  categoryName: {
    fontSize: 15,
    padding: 5,
  },
  recentlyAddedContainer: {
    marginTop: 10,
    marginBottom: 10,
    paddingVertical: 20,
    marginHorizontal: 10,
  },
  recentlyAddedTitle: {
    fontSize: 15,
    marginBottom: 10,
    marginLeft: 10,
    fontWeight: "bold",
  },
  recentlyAddedItem: {
    marginHorizontal: 7,
    alignItems: "center",
  },
  recentlyAddedImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
});

export default StoreScreen;
