// CompletedTestScreen.js

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import firebase from './firebaseConfig'; // Import your Firebase config

const CompletedTestScreen = ({ navigation }) => {
  const handleLogout = () => {
    firebase.auth().signOut();
    // Navigate back to the login/signup screen upon logout
    navigation.navigate('Auth');
  };

  return (
    <View style={styles.container}>
      <Text>Your Completed Test</Text>
      {/* Display completed test details here */}
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CompletedTestScreen;
