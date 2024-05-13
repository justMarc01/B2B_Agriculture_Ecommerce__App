import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

const AvatarModal = ({ isVisible, onSelectAvatar, closeModal }) => {
  const [avatarData, setAvatarData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const response = await fetch("http://192.168.1.7:3000/api/avatars");
        const data = await response.json();
        setAvatarData(data);
      } catch (error) {
        console.error("Error fetching avatars:", error);
      } finally {
        //set loading state to false after fetching
        setLoading(false);
      }
    };

    fetchAvatars();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => onSelectAvatar(item)}>
      <Image
        source={{ uri: `data:image/png;base64,${item.avatar_base64}` }}
        style={styles.avatarImage}
      />
    </TouchableOpacity>
  );

  return (
    <Modal visible={isVisible} onRequestClose={closeModal} transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="white" />
            </View>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={avatarData}
              numColumns={2}
              renderItem={renderItem}
              keyExtractor={(item) => item.avatar_id.toString()}
              contentContainerStyle={styles.avatarGrid}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    borderRadius: 10,
    padding: 20,
    width: 300,
    height: 400,
  },
  avatarGrid: {
    alignItems: "center",
  },
  avatarImage: {
    width: 90,
    height: 90,
    margin: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AvatarModal;
