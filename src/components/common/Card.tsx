import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants';

// Props for the Card container component.
interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  padding?: 'small' | 'medium' | 'large';
  shadow?: boolean;
}

// Card component that provides padding, borders, and optional shadow.
const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  padding = 'medium',
  shadow = true,
}) => {
  // Compute card style based on padding and shadow preferences.
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: Colors.surface,
      borderRadius: BorderRadius.xl,
      borderWidth: 1,
      borderColor: Colors.border,
    };

    // Padding styles
    switch (padding) {
      case 'small':
        baseStyle.padding = Spacing.sm;
        break;
      case 'large':
        baseStyle.padding = Spacing.xl;
        break;
      default:
        baseStyle.padding = Spacing.lg;
    }

    // Shadow
    if (shadow) {
      baseStyle.shadowColor = Colors.shadow;
      baseStyle.shadowOffset = { width: 0, height: 8 };
      baseStyle.shadowOpacity = 0.08;
      baseStyle.shadowRadius = 16;
      baseStyle.elevation = 2;
    }

    return baseStyle;
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent style={[getCardStyle(), style]} onPress={onPress}>
      {children}
    </CardComponent>
  );
};

export default Card;
