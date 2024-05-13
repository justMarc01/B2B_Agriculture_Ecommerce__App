import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  SectionList,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  RefreshControl,
} from "react-native";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const SearchScreen = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!searchText) {
      loadRandomItems();
    } else {
      handleSearch();
    }
  }, [searchText]);

  const loadRandomItems = () => {
    axios
      .get(`http://192.168.1.7:3000/api/randomItems`)
      .then((response) => {
        setSearchResults(response.data);
      })
      .catch((error) => {
        console.error(error);
        Alert.alert(
          "Error",
          "There was an error loading search result, please make sure you are connected to the internet and try again."
        );
      });
  };

  const handleSearch = () => {
    axios
      .get(
        `http://192.168.1.7:3000/api/search?query=${encodeURIComponent(
          searchText
        )}`
      )
      .then((response) => {
        setSearchResults(response.data);
      })
      .catch((error) => {
        console.error(error);
        Alert.alert(
          "Error",
          "There was an error fetching data, please make sure you are connected to the internet and try again."
        );
      });
  };

  const NoResultsMessage = () => {
    /*  const funnyMessages = [
      "Oops! Nothing here but unicorns and rainbows 🦄🌈",
      "Oh no, the search monsters ate all the results! 🍭🍫",
      "Looks like the results are on vacation! 🏖️🍹",
      "Sorry, the results took a wrong turn at Albuquerque! 🤷‍♂️🌵",
      "404 Results Not Found, but don't worry, we're searching the Bermuda Triangle! 🔍🚢",
      "Houston, we have a problem... no results! 🚀🛸",
      "It's a ghost town here, no results in sight! 👻👀",
    ]; */

    const noResultMessage = "Search yielded no result!";

    /* const randomIndex = Math.floor(Math.random() * funnyMessages.length);
    const funnyMessage = funnyMessages[randomIndex]; */

    return (
      <View style={styles.noResultContainer}>
        <Icon name="search" size={100} color="#333" />
        <Text style={styles.noResultText}>{noResultMessage}</Text>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.resultItem}
        onPress={() => handleResultPress(item)}
      >
        <Image
          source={{ uri: item.image_path }}
          style={styles.resultItemImage}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, flexWrap: "wrap", width: "95%" }}>
            {item.name}
          </Text>
        </View>

        <Text
          style={{
            fontSize: 15,
            fontWeight: "bold",
            textAlignVertical: "bottom",
          }}
        >
          {item.price} USD
        </Text>
      </TouchableOpacity>
    );
  };

  const handleResultPress = (item) => {
    navigation.navigate("ProductDetails", { item });
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    loadRandomItems();
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Browse your desired items..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <Ionicons
          name="close-circle-outline"
          size={20}
          color="black"
          onPress={() => setSearchText("")}
        />
      </View>

      {searchResults.length === 0 ? (
        <View style={styles.NoResultContainer}>
          <NoResultsMessage />
        </View>
      ) : (
        <SectionList
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          sections={[{ data: searchResults, title: "Results" }]}
          renderItem={renderItem}
          keyExtractor={(item) =>
            item.id ? item.id.toString() : Math.random().toString()
          }
          ListHeaderComponent={
            searchText === "" ? (
              <Text style={{ fontSize: 17, marginBottom: "1%" }}>
                You might also like..
              </Text>
            ) : null
          }
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
  NoResultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listHeader: {
    height: 40,
    justifyContent: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#F7F9F9",
    borderWidth: 1.5,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  resultItem: {
    paddingVertical: 8,
    borderBottomWidth: 7,
    borderBottomColor: "#DEE1E1",
    flexDirection: "row",
  },
  resultItemImage: {
    width: 90,
    height: 90,
    marginRight: "2%",
  },
  noResultContainer: {
    alignItems: "center",
  },
  noResultText: {
    fontSize: 20,
    paddingTop: "5%",
  },
});

export default SearchScreen;
