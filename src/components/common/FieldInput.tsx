import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants';

interface FieldInputProps extends TextInputProps {
  label?: string;
  iconName: React.ComponentProps<typeof Feather>['name'];
  error?: string;
  showToggle?: boolean;
}

const FieldInput: React.FC<FieldInputProps> = ({
  label,
  iconName,
  error,
  showToggle = false,
  secureTextEntry,
  style,
  ...rest
}) => {
  const [isSecure, setIsSecure] = useState<boolean>(secureTextEntry ?? false);

  const toggleSecure = () => {
    setIsSecure(prev => !prev);
  };

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        <Feather name={iconName} size={18} color={Colors.muted} />
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Colors.muted}
          secureTextEntry={isSecure}
          {...rest}
        />
        {showToggle ? (
          <TouchableOpacity onPress={toggleSecure} style={styles.eyeButton}>
            <Feather
              name={isSecure ? 'eye' : 'eye-off'}
              size={18}
              color={Colors.muted}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.caption,
    color: Colors.muted,
    marginBottom: Spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.text,
  },
  eyeButton: {
    paddingLeft: Spacing.xs,
  },
  inputError: {
    borderColor: Colors.errorBorder,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
});

export default FieldInput;
