import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants';

interface DividerProps {
  label?: string;
}

const Divider: React.FC<DividerProps> = ({ label = 'o' }) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.label}>{label}</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  label: {
    ...Typography.caption,
    color: Colors.muted,
    textTransform: 'lowercase',
  },
});

export default Divider;
