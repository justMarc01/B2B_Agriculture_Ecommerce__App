import React from "react";
import { TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Icon from "react-native-vector-icons/MaterialIcons";

const MapViewScreen = ({ route }) => {
  const { latitude, longitude } = route.params;

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      <Marker
        coordinate={{
          latitude: latitude,
          longitude: longitude,
        }}
        title="Store Location"
        description="Welcome to our store 😊"
      />
    </MapView>
  );
};

const MapButton = ({ latitude, longitude, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress({ latitude, longitude })}>
      <Icon name="map" size={27} color={"white"} style={{ marginRight: 12 }} />
    </TouchableOpacity>
  );
};

export { MapButton, MapViewScreen };
