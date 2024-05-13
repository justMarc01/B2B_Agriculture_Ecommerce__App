import React from "react";
import { View, StyleSheet, Modal, ActivityIndicator } from "react-native";

const OverlayScreen = () => {
  return (
    <Modal animationType="none" transparent={true} visible={true}>
      <View style={styles.modalContainer}>
        <View style={styles.miniModal}>
          <ActivityIndicator size="large" color="#ccc" />
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  miniModal: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    borderRadius: 10,
    width: 130,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default OverlayScreen;
