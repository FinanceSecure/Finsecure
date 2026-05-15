import { Colors } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    alignItems: "center",
  },
  text: {
    color: Colors.text_muted,
    textAlign: "center",
  },
});
