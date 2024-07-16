import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const AboutUsScreen = () => {
  return (
    <ScrollView>
      <View>
        <Text style={styles.description}>
          This privacy policy outlines how Mahsoulna collects, uses,
          discloses, and protects the personal information that you provide when
          using our mobile application. Please take a moment to read
          this policy before using our services.
        </Text>
        <Text style={styles.title}>Information We Collect:</Text>
        <Text style={styles.description}>
          We only collect information that helps us achieve the purpose set out
          in this privacy policy. We collect your name, email address, phone
          number, payment information, and any other information you voluntarily
          provide through our services. We do not collect any personal
          information without your consent.
        </Text>
        <Text style={styles.title}>We use your personal information to:</Text>
        <Text style={styles.description}>
          - Provide and deliver products and services you request.
        </Text>
        <Text style={styles.description}>- Process payments and refunds.</Text>
        <Text style={styles.description}>
          - Communicate with you about orders, products, services, promotional
          offers, and events.
        </Text>
        <Text style={styles.description}>
          - Administer contests, sweepstakes, surveys or other site features.
        </Text>
        <Text style={styles.description}>
          We do not rent, sell, or share your personal information with third
          parties except as necessary to provide our services or when required
          by law.
        </Text>
        <Text style={styles.title}>Cookies and Tracking:</Text>
        <Text style={styles.description}>
          We use tracking technologies like cookies or web beacons to analyze
          trends, track users' movement around the app, and gather
          information about our user base. We may receive reports on user
          demographics and traffic patterns from these services.
        </Text>
        <Text style={styles.title}>Data Security:</Text>
        <Text style={styles.description}>
          We take reasonable precautions to protect your personal information
          against unauthorized access, alteration, disclosure, misuse or
          destruction. However, no internet-based services can be 100% secure,
          so we cannot guarantee the security of transmitted information.
        </Text>
        <Text style={styles.title}>Changes to the Privacy Policy:</Text>
        <Text style={styles.description}>
          We may occasionally update this privacy policy to adapt to changes in
          laws or our services. Please read any updates carefully. If we make
          significant changes, we will notify you through your user account or
          by placing a prominent announcement on the app.
        </Text>
        <Text style={styles.title}>Contact Us:</Text>
        <Text style={styles.description}>
          If you have any questions about this policy or our information
          handling practices, please contact us at mahsoulnagroup@gmail.com.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  description: {
    fontSize: 16,
    color: "#555",
    padding: 10,
  },

  title: {
    fontSize: 18,
    color: "black",
    paddingHorizontal: 10,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default AboutUsScreen;
