import React from "react";
import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";

interface LoadingAnimationProps {
  isLoading: Boolean;
  onPress: (event: GestureResponderEvent) => void;
  buttonText: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  isLoading,
  onPress,
  buttonText
}) => {
  return isLoading ? (
    <ActivityIndicator size="large" color="#0000ff" />
  ) : (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  loading: {
    paddingTop: 20
  },
  button: {
    backgroundColor: "#0066cc",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default LoadingAnimation;
