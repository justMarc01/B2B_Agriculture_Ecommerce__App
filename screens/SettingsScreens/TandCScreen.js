import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const TandCScreen = () => {
  return (
    <ScrollView>
      <View>
        <Text style={styles.description}>Last updated 20/05/2024</Text>
        <Text style={styles.description}>
          Please read these terms and conditions carefully before using Mahsoulna.
        </Text>
        <Text style={styles.title}>Conditions of Use :</Text>
        <Text style={styles.description}>
          By using this app, you certify that you have read and
          reviewed this Agreement and that you agree to comply with its terms.
          If you do not want to be bound by the terms of this Agreement, you are
          advised to leave the app accordingly. [Your Business Name]
          only grants use and access of this app, its products, and
          its services to those who have accepted its terms.
        </Text>
        <Text style={styles.title}>User Account and Registration:</Text>
        <Text style={styles.description}>
          If you register for an account, you guarantee that you are above the
          age of 18, and the information you provide is accurate and complete.
          You are responsible for maintaining the confidentiality of your user
          ID and password, and you accept responsibility for all activities that
          occur under your account.
        </Text>
        <Text style={styles.title}>Privacy:</Text>
        <Text style={styles.description}>
          Our privacy policy governs the use of information collected from you
          or that you provide to us through the app. Please review
          our privacy policy before using the app. By using the
          app, you agree that Mahsoulna can use your information
          in accordance with our privacy policy.
        </Text>
        <Text style={styles.title}>OUR SERVICE:</Text>
        <Text style={styles.description}>
          Subject to these Terms, we will provide you with our Services in
          accordance with these Terms and Agreement. We may change, modify,
          suspend, or discontinue any aspect of the Services at any time. We may
          also impose limits on certain features or restrict your access to
          parts of or the entire Services without notice or liability to you.
          You acknowledge that we will not be liable to you or to any third
          party for any modification, suspension, or discontinuance of the
          Services or any part thereof.
        </Text>
        <Text style={styles.title}>No Warranties:</Text>
        <Text style={styles.description}>
        You agree that the use of this app and its services is at your own risk.
        The services provided by this app are offered "as is" and on an "as available" basis without any warranties 
        of any kind, express or implied, including but not limited to, warranties of title,
        non-infringement of third-party rights, merchantability, satisfactory quality, or fitness
        for a particular purpose. Mahsoulna disclaims any and all warranties, express or implied, 
        including implied warranties of merchantability, satisfactory quality, fitness for a particular purpose,
        and non-infringement. Mahsoulna makes no representations or warranties that the use of the app will be complete, 
        accurate, reliable, current, secure, virus-free, legal, or safe.
        </Text>
        <Text style={styles.title}>Contact Us:</Text>
        <Text style={styles.description}>
          If you have any questions about these Terms, please feel free to contact us at
          mahsoulnagroup@gmail.com.
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

export default TandCScreen;
