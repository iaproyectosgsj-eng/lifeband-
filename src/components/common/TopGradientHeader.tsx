import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants';

interface TopGradientHeaderProps {
  title: string;
  subtitle?: string;
}

const TopGradientHeader: React.FC<TopGradientHeaderProps> = ({ title, subtitle }) => {
  return (
    <LinearGradient
      colors={[Colors.teal, Colors.blue]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.decorativeCircleOne} />
      <View style={styles.decorativeCircleTwo} />
      <View style={styles.iconPill}>
        <Ionicons name="shield-checkmark" size={18} color={Colors.surface} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 20,
    overflow: 'hidden',
    gap: Spacing.sm,
  },
  decorativeCircleOne: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    top: -60,
    right: -40,
  },
  decorativeCircleTwo: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    bottom: -70,
    left: -40,
  },
  iconPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  title: {
    ...Typography.title,
    color: Colors.surface,
  },
  subtitle: {
    ...Typography.body,
    color: 'rgba(255, 255, 255, 0.92)',
  },
});

export default TopGradientHeader;
