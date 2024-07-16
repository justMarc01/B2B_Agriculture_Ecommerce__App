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
        Welcome to Mahsoulna, your premier destination for top-tier agricultural products tailored specifically for the esteemed clientele of the agricultural industry. 
        Situated amidst the verdant landscapes of Lebanon, Mahsoulna embodies a legacy of excellence in cultivating and delivering the finest fruits and vegetables.

        At Mahsoulna, we are driven by a passion for quality, sustainability, and innovation, ensuring that each product that graces our shelves is a testament to nature's bounty and human ingenuity. 
        From luscious fruits ripened to perfection under the warm embrace of the sun to crisp, garden-fresh vegetables nurtured with care, Mahsoulna offers a bounty of farm-fresh delights.

        Our platform serves as a seamless conduit between discerning agricultural enterprises and the abundance of nature, providing a comprehensive range of premium agricultural produce meticulously selected for superior quality and freshness.

        Beyond being purveyors of agricultural excellence, Mahsoulna is committed to forging enduring partnerships, fostering a harmonious ecosystem where farmers thrive and agricultural enterprises flourish. 
        Through sustainable practices and a dedication to ethical farming, we uphold the values of integrity, transparency, and environmental stewardship.

        Whether you're a seasoned agricultural giant seeking the crème de la crème of produce or a burgeoning enterprise eager to explore the world of premium agricultural offerings, Mahsoulna is your trusted ally on the path to success. 
        Join us in celebrating the richness of nature's harvest and embark on a journey of agricultural excellence with Mahsoulna. We eagerly anticipate the opportunity to collaborate with you, enriching the agricultural landscape and redefining standards of quality and freshness. 
        Welcome to Mahsoulna, where every harvest is a testament to our unwavering commitment to excellence.
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
