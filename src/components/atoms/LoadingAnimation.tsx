import { Colors } from "@constants/theme";
import React from "react";
import { ActivityIndicator, GestureResponderEvent, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface LoadingAnimationProps {
  isLoading: boolean;
  onPress: (event: GestureResponderEvent) => void;
  buttonText: string;
  buttonColor?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  isLoading,
  onPress,
  buttonText,
  buttonColor
}) => {
  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={buttonColor || Colors.primary}
          style={styles.loading}
        />
      ) : (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonColor || Colors.primary }]}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    height: 54,
    justifyContent: 'center',
  },
  loading: {
    paddingVertical: 10,
  },
  button: {
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "bold",
    textTransform: 'uppercase',
  },
});

export default LoadingAnimation;