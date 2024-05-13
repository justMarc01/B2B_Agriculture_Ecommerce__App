import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";

const AboutUsScreen = () => {
  return (
    <ScrollView>
      <View style={styles.container}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>About Us</Text>
        <Text style={styles.description}>
          Welcome to Sweety Candy, your enchanting escape into the world of
          sweets nestled in the historic heart of Byblos, Lebanon. At Sweety
          Candy, we believe in the transformative power of indulgence and the
          joy that comes from savoring life's sweet moments. Our story begins
          with a passion for curating the finest candies and confections from
          across the globe. From nostalgic childhood favorites to the latest
          trends in the world of confectionery, we've carefully selected a
          kaleidoscope of flavors that will tantalize your taste buds and evoke
          a sense of pure delight. Situated in the charming streets of Byblos,
          our store is a whimsical haven where vibrant colors, enticing aromas,
          and a myriad of textures come together to create a magical candyland
          experience. We invite you to embark on a journey of discovery as you
          explore our shelves filled with an extensive array of candies,
          chocolates, and sweet delights. At Sweety Candy, we are not just a
          candy store; we are storytellers, weaving tales of joy and happiness
          through the language of sweets. Our commitment to quality ensures that
          every piece of candy is a celebration of flavor, texture, and
          craftsmanship. Whether you're seeking a nostalgic treat that
          transports you back to carefree days or a contemporary confection that
          tickles your taste buds, Sweety Candy is your destination for all
          things sweet and delightful. Join us in creating sweet memories as we
          celebrate the art of candy-making and the joy it brings to people of
          all ages. Indulge your senses, share a smile, and immerse yourself in
          the sweetness of life at Sweety Candy. We look forward to welcoming
          you to our candy haven in Byblos, where every visit is a celebration
          of the extraordinary world of confectionery.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
    marginTop: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  description: {
    textAlign: "left",
    fontSize: 16,
    color: "#555",
    padding: 10,
    lineHeight: 30,
  },
});

export default AboutUsScreen;
