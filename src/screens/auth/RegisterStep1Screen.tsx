import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RegisterStep1Screen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register Step 1</Text>
      <Text>To be implemented</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#14B8A6',
  },
});

export default RegisterStep1Screen;
